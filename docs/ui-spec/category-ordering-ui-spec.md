# UI Specification: Category Custom Sort Order (Admin Dashboard)

**Status:** Draft
**Date:** 2026-03-21
**Scope:** `apps/admin/src/pages/CategoriesPage.tsx` — admin dashboard only
**Linked PRD:** `docs/prd/category-ordering-prd.md`
**PRD Requirements covered:** FR-AD-1 through FR-AD-9, NFR-A-1 through NFR-A-4, NFR-P-4, NFR-R-2

---

## 1. Component Hierarchy

The existing `CategoriesPage` retains its outer layout (`Stack`, `PageHeader`, `SearchFilter`) unchanged. The `DataTable` is replaced entirely by the new sortable list structure.

```
CategoriesPage
├── PageHeader                          (existing — unchanged)
├── SearchFilter                        (existing — unchanged)
├── DnDStatusBanner                     (NEW — conditional, shown when search active)
└── SortableCategoryList                (NEW — replaces DataTable)
    ├── DndContext                       (@dnd-kit/core)
    │   ├── SortableContext              (@dnd-kit/sortable)
    │   │   └── SortableCategoryRow[]   (NEW — one per category)
    │   │       ├── DragHandle          (NEW — leftmost cell)
    │   │       ├── ImageCell           (existing column logic)
    │   │       ├── NameCell            (existing column logic)
    │   │       ├── ProductCountCell    (existing column logic)
    │   │       └── ActionsCell         (existing edit/delete actions)
    │   └── DragOverlay                 (@dnd-kit/core — ghost row during drag)
    │       └── CategoryRowSnapshot     (NEW — frozen visual clone of dragged row)
    └── LoadingOverlay                  (Mantine — reuses existing loading prop pattern)
```

### 1.1 New Component Responsibilities

| Component | File | Responsibility |
|-----------|------|----------------|
| `SortableCategoryList` | `apps/admin/src/components/categories/SortableCategoryList.tsx` | Owns `DndContext` + `SortableContext`, manages optimistic state, calls reorder API |
| `SortableCategoryRow` | `apps/admin/src/components/categories/SortableCategoryRow.tsx` | Single row wrapped with `useSortable`; renders drag handle + data cells + action buttons |
| `CategoryRowSnapshot` | `apps/admin/src/components/categories/CategoryRowSnapshot.tsx` | Stateless visual clone rendered inside `DragOverlay` during active drag |
| `DnDStatusBanner` | `apps/admin/src/components/categories/DnDStatusBanner.tsx` | Inline `Alert` shown when drag-and-drop is disabled due to active search |
| `DragHandle` | `apps/admin/src/components/categories/DragHandle.tsx` | Icon button that receives drag listeners from `useSortable`; handles disabled state |

All new component files live in `apps/admin/src/components/categories/`. `CategoriesPage.tsx` itself only instantiates `SortableCategoryList` and `DnDStatusBanner`.

---

## 2. State Design

### 2.1 State Location

All sortable list state is local to `SortableCategoryList`. `CategoriesPage` passes the fetched categories down as a prop and provides the `reorderCategories` mutation callback.

```
CategoriesPage (parent)
  ↓ categories: CategoryDto[]         (from useCategories())
  ↓ onReorder: (ids: string[]) => Promise<void>   (from useReorderCategories())
  ↓ loading: boolean
  ↓ isDndDisabled: boolean            (searchValue !== '' — computed in CategoriesPage)

SortableCategoryList (child)
  → localOrder: CategoryDto[]         (useState — optimistic copy)
  → preReorderSnapshot: CategoryDto[] (useState — saved before drag-end for rollback)
  → activeId: string | null           (useState — id of item being dragged)
  → isSaving: boolean                 (useState — true while PATCH /categories/reorder is in flight)
```

### 2.2 State Initialization and Sync

`localOrder` is initialized from the `categories` prop on first render:

```tsx
const [localOrder, setLocalOrder] = useState<CategoryDto[]>(categories);
```

A `useEffect` syncs `localOrder` from the `categories` prop only when there is no drag in progress (`activeId === null`) and the component is not saving (`isSaving === false`). This prevents the prop update (e.g., a background refetch) from overwriting an in-flight optimistic update.

```tsx
useEffect(() => {
  if (activeId === null && !isSaving) {
    setLocalOrder(categories);
  }
}, [categories, activeId, isSaving]);
```

### 2.3 Optimistic Update State Sequence

| Step | `localOrder` | `preReorderSnapshot` | `isSaving` |
|------|-------------|---------------------|------------|
| Initial render | `categories` prop | `[]` | `false` |
| `onDragStart` fires | unchanged | unchanged | `false` |
| `onDragEnd` fires (valid move) | reordered (new order) | saved copy of old `localOrder` | `true` |
| API call resolves (success) | unchanged | cleared (`[]`) | `false` |
| API call resolves (error) | rolled back to `preReorderSnapshot` | cleared (`[]`) | `false` |
| API call resolves (error) | — | — | — + error toast shown |

### 2.4 `isDndDisabled` Derivation

Computed in `CategoriesPage` and passed as a prop to `SortableCategoryList`:

```tsx
const isDndDisabled = searchValue.trim() !== '';
```

This is the single source of truth. Both the `DragHandle` disabled styling and the `sensors` configuration in `DndContext` reference this value.

---

## 3. Interaction Design

### 3.1 Drag Start

1. User presses pointer down on a `DragHandle` (or presses Space/Enter on keyboard).
2. `onDragStart` callback fires. `activeId` is set to the dragged category's `id`.
3. The dragged row transitions to a placeholder state (see Section 4.3 — Placeholder Row).
4. `DragOverlay` renders a `CategoryRowSnapshot` of the dragged row at the pointer position.
5. No API call is made at drag start.

**Keyboard path:** With the `KeyboardSensor` configured via `@dnd-kit/sortable`'s `sortableKeyboardCoordinates`, pressing Space or Enter on a focused `DragHandle` activates drag mode. Arrow keys then move the item.

### 3.2 Drag Over

1. As the pointer or keyboard moves over other rows, `onDragOver` fires.
2. A drop indicator (horizontal line) appears between the two rows that bracket the current insertion position (see Section 4.4).
3. The `localOrder` array is NOT mutated during `onDragOver` — only the visual indicator updates.
4. No API call is made during `onDragOver`.

> **NOTE:** The live row-shuffle effect (arrayMove on onDragOver) is intentionally omitted. Only the drop indicator line updates during drag. This satisfies A-5 (ghost element + drop indicator) without the complexity of live reordering. If stakeholders require live row shuffling, arrayMove must move to onDragOver.

### 3.3 Drag End

On `onDragEnd`:

1. `activeId` is cleared (`null`).
2. If `over` is null or the item was dropped back onto its own position, no state change occurs and no API call is made.
3. Otherwise:
   a. Save the current `localOrder` into `preReorderSnapshot`.
   b. Compute `newOrder` using `arrayMove(localOrder, oldIndex, newIndex)` from `@dnd-kit/sortable`.
   c. Call `setLocalOrder(newOrder)` — optimistic update visible immediately.
   d. Set `isSaving = true`.
   e. Call `onReorder(newOrder.map(cat => cat.id))`.
   f. On success: set `isSaving = false`, clear `preReorderSnapshot`.
   g. After the `await` on `onReorder(newOrder.map(cat => cat.id))` resolves successfully, `CategoriesPage.handleReorder` must call `refetch()` (returned by `useCategories()`) so `localOrder` stays in sync with server state. This is the mechanism that satisfies AC-AD-3 (order persists after page refresh). Note: the codebase uses raw useState+fetch hooks, not React Query — `refetch()` from `useCategories()` is the correct mechanism.
   h. On error: call `setLocalOrder(preReorderSnapshot)`, set `isSaving = false`, clear `preReorderSnapshot`, show error toast.

### 3.4 Disabled State Interactions

When `isDndDisabled === true`:

- `DragHandle` elements render with `aria-disabled="true"` and `cursor: not-allowed`.
- The pointer sensor and keyboard sensor are replaced by an empty sensors array (or sensors configured to immediately cancel) in `DndContext`. This prevents any drag from being initiated at the dnd-kit level, not just at the handle level.
- The `DnDStatusBanner` is shown above the list (see Section 4.6).
- Existing edit and delete actions remain fully active — only drag-and-drop is disabled.

### 3.5 Error and Revert

On API error:

1. `localOrder` is restored to `preReorderSnapshot` — the list snaps back to the pre-drag order visually.
2. `isSaving` is set to `false`.
3. An error toast is shown via `notifications.show(...)`:

```ts
notifications.show({
  title: 'Reorder failed',
  message: 'Could not save the new order. The list has been restored.',
  color: 'red',
  autoClose: 5000,
});
```

4. The admin can attempt another drag immediately after the revert.

### 3.6 Loading State During Save

While `isSaving === true`:

- A `LoadingOverlay` with `visible={isSaving}` is rendered over the list card. This uses Mantine's `LoadingOverlay` component (consistent with `DataTable`'s existing loading pattern).
- Drag handles become non-interactive via pointer-events during the save (achieved by setting `isDndDisabled || isSaving` as the disabled condition throughout).
- The overlay is semi-transparent (`opacity: 0.4`) so the optimistically updated order remains readable underneath.

---

## 4. Visual Design

### 4.1 List Container

The sortable list is wrapped in a Mantine `Card` matching the existing `DataTable` container style:

```
Card
  shadow="sm"
  padding="lg"
  radius="md"
  withBorder={true}
  style={{ position: 'relative' }}   ← required for LoadingOverlay positioning
```

No scroll area is applied by default. If the catalog exceeds viewport height, the page's own scroll handles it. A `maxHeight` prop can be passed from `CategoriesPage` to enable `ScrollArea` wrapping (same API as `DataTable`).

### 4.2 Row Layout

Each `SortableCategoryRow` is rendered as a horizontal `Group` with `align="center"` and `gap="md"` (16px). The row has a fixed minimum height of 64px to accommodate the 48px image thumbnail with comfortable padding.

Column widths match the existing `DataTable` layout:

| Column | Width | Content |
|--------|-------|---------|
| Drag handle | 32px fixed | `DragHandle` icon button |
| Image | 64px fixed | 48×48px thumbnail with `radius="sm"` |
| Name | flex (fill) | `Text size="sm" fw={500}` |
| Products | 96px fixed | `Badge variant="outline"` |
| Actions | 80px fixed | Edit + Delete `ActionIcon` row |

Name uses `flex` (fill) and shrinks proportionally when the viewport narrows. A horizontal `Divider` (`color="gray.2"`) separates rows. The divider is not rendered after the last row.

Row background on hover (when not dragging): `gray.0` (`#fafafa`) via an inline `onMouseEnter`/`onMouseLeave` handler or a CSS class. This replaces the DataTable's `highlightOnHover` behavior.

### 4.3 Placeholder Row (Active Dragged Item)

When a row is being dragged, the row in the list becomes a visual placeholder:

- Background: `gray.1` (`#f5f5f5`)
- Border: `1px dashed gray.3` (`#d9d9d9`)
- Contents: same cells but rendered at `opacity: 0.4`
- Height: identical to the original row (preserves layout space)
- Achieved by checking `id === activeId` inside `SortableCategoryRow` and applying the placeholder styles conditionally

### 4.4 Drop Indicator

The insertion target between rows is indicated by a `2px solid` horizontal line in the brand primary color `#1890ff` (`brand.500`).

Implementation: use `@dnd-kit/sortable`'s `over` id to determine the insertion gap. Render a `Box` with `height: 2px`, `backgroundColor: brand.500`, `borderRadius: 1px`, and negative vertical margin (`my: -1px`) between the rows that bracket the current `overId`. No border animation is required; the indicator appears and disappears instantly as the pointer crosses row midpoints.

### 4.5 Drag Overlay (Ghost Row)

The `DragOverlay` renders a `CategoryRowSnapshot` — a stateless clone of the dragged row:

- Same column layout as a normal row (Section 4.2)
- Background: `white`
- Box shadow: `shadows.md` (`0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`)
- Border radius: `8px` (`borderRadius.md`)
- No drag handle interaction in the overlay (it is a visual snapshot only)
- `@dnd-kit/core` positions the overlay via `transform: translate3d(...)` — no manual positioning required

### 4.6 DnD Disabled Banner

When `isDndDisabled === true`, a Mantine `Alert` is rendered between the `SearchFilter` and the list card:

```
Alert
  variant="light"
  color="yellow"
  icon={<IconInfoCircle size={16} />}
  title="Reordering unavailable"
```

Message text: `"Clear the search field to drag and reorder categories."`

The `Alert` disappears as soon as `searchValue` is cleared (controlled by the same `isDndDisabled` boolean). No animation is needed.

### 4.7 Drag Handle Icon

The handle uses `IconGripVertical` from `@tabler/icons-react` (size 18, `color="gray.5"`).

**Normal state:**

```
ActionIcon
  variant="subtle"
  color="gray"
  size="sm"
  cursor="grab"
  aria-label="Drag to reorder"
  aria-describedby="category-list-keyboard-hint"
  {...listeners}   ← spread from useSortable()
  {...attributes}  ← spread from useSortable()
```

**Disabled state** (when `isDndDisabled || isSaving`):

```
ActionIcon
  variant="subtle"
  color="gray"
  size="sm"
  aria-disabled="true"
  aria-label="Drag to reorder (unavailable while searching)"
  aria-describedby="category-list-keyboard-hint"
  style={{ opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none' }}
```

Do not spread `listeners` or `attributes` onto the handle when disabled — omitting them prevents any drag activation.

**Active drag state** (while this row's handle is being held):

```
cursor: "grabbing"
```

---

## 5. Accessibility

### 5.1 Keyboard Navigation

`@dnd-kit` must be configured with both `PointerSensor` and `KeyboardSensor`. Use `sortableKeyboardCoordinates` from `@dnd-kit/sortable` as the coordinate getter for the keyboard sensor.

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },   // prevents accidental drag on click
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

When `isDndDisabled || isSaving` is true, pass `sensors={[]}` to `DndContext` (empty sensors array) to prevent all drag initiation.

**Keyboard flow for reordering:**

1. Tab to the `DragHandle` of the desired row.
2. Press Space or Enter to pick up the item.
3. Press ArrowUp / ArrowDown to move the item.
4. Press Space or Enter to drop at the current position.
5. Press Escape to cancel and return the item to its original position.

### 5.2 ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| `DragHandle` (normal) | `aria-label` | `"Drag to reorder"` |
| `DragHandle` (normal) | `aria-describedby` | `"category-list-keyboard-hint"` |
| `DragHandle` (disabled) | `aria-label` | `"Drag to reorder (unavailable while searching)"` |
| `DragHandle` (disabled) | `aria-disabled` | `"true"` |
| `DragHandle` (disabled) | `aria-describedby` | `"category-list-keyboard-hint"` |
| `SortableCategoryRow` | `aria-roledescription` | `"sortable item"` (set via `useSortable` `attributes`) |
| List container (`ul` or `div[role="list"]`) | `aria-label` | `"Categories list, drag to reorder"` |
| List container | `aria-describedby` | ID of the keyboard instructions element |

`aria-describedby="category-list-keyboard-hint"` is applied to every `DragHandle` element (not only the list container) to ensure screen reader users hear keyboard instructions when focusing any individual handle.

### 5.3 Screen Reader Keyboard Instructions

A visually-hidden paragraph (Mantine `VisuallyHidden`) is rendered once, above the list, with an `id` referenced by `aria-describedby` on the list container and on each `DragHandle`:

```
id="category-list-keyboard-hint"
text: "Press Space or Enter to pick up an item, use arrow keys to move it, and press Space or Enter again to drop it. Press Escape to cancel."
```

This text is announced when a screen reader user focuses the list or any drag handle.

### 5.4 Live Region Announcements

`@dnd-kit` emits screen reader announcements automatically via its built-in `Announcements` system when using `DndContext`. The default announcements cover:

- Item picked up: "Picked up sortable item."
- Item moved: "Sortable item was moved into position N of M."
- Item dropped: "Sortable item was dropped."
- Drag cancelled: "Dragging was cancelled."

No custom announcement configuration is required unless the product team wants category-name–specific messages (out of scope for this spec).

### 5.5 Focus Management

After a keyboard drop (`dragEnd` via keyboard), focus must remain on the `DragHandle` of the moved row at its new position. `@dnd-kit`'s keyboard sensor handles this automatically — verify during QA that focus does not jump to the top of the page after a keyboard reorder.

### 5.6 Color Contrast

| Element | Foreground | Background | Contrast Ratio | WCAG AA |
|---------|-----------|------------|----------------|---------|
| Drop indicator | `#1890ff` (brand.500) | `#ffffff` (page bg) | 3.0:1 | Pass (non-text UI component) |
| Drag handle icon | `#8c8c8c` (gray.500) | `#ffffff` | 3.5:1 | Pass (non-text UI component) |
| Drag handle icon (disabled) | `#8c8c8c` at 35% opacity | `#f5f5f5` | below 3:1 | Acceptable — purely decorative in disabled state; `aria-disabled` conveys state |
| DnDStatusBanner text | Mantine yellow `color="yellow"` light variant | `#fffde7` approx | Mantine-managed | Verify in QA |
| Ghost row text | `#262626` (gray.800) | `#ffffff` | 14.7:1 | Pass |

---

## 6. Error States

### 6.1 API Failure — Reorder Rollback

**Trigger:** `onReorder(ids)` promise rejects (any non-2xx response or network error).

**Behavior sequence:**

1. `localOrder` is set back to `preReorderSnapshot` synchronously.
2. `isSaving` is set to `false` — `LoadingOverlay` disappears.
3. The list visually snaps to the pre-drag order.
4. Error toast is shown (Section 3.5).

**User experience:** The admin sees their drag undo itself. The toast explains the failure. No manual refresh is needed; the list is already in a correct, consistent state matching the last persisted order.

### 6.2 Initial Load Error

The existing `CategoriesPage` error state (red `Text` message) is preserved unchanged. If `useCategories()` returns an error, the `SortableCategoryList` is not rendered at all — the error message is shown instead. No change to this behavior.

### 6.3 Delete During Optimistic Reorder

If the admin clicks the Delete action on a row while a reorder save is in flight (`isSaving === true`):

- The Delete `ActionIcon` is disabled (`disabled={isSaving}`) to prevent concurrent mutations.
- The Edit `ActionIcon` remains enabled (navigation-only, no state mutation).

This prevents the edge case where a delete resolves before the reorder, causing the reorder to submit a stale ID list.

### 6.4 Partial ID Mismatch (API 400 Response)

If the API returns 400 (ID list does not match the server's category set — e.g., a category was created or deleted in another session between the page load and the drag):

- Treated identically to a general API error (Section 6.1): rollback + error toast.
- The error toast message for a 400 response uses a more specific text: `"Category list has changed. Please refresh the page and try again."` — this distinguishes the stale-list case from a generic server error.
- For 500 or network errors, the generic toast message is used: `"Could not save the new order. The list has been restored."` (Section 3.5).
- The admin should refresh the page to get the current category list before attempting another reorder.

---

## 7. Component API Summary

### 7.1 `SortableCategoryList` Props

```ts
interface SortableCategoryListProps {
  categories: CategoryDto[];              // sorted by sortOrder from API
  onReorder: (ids: string[]) => Promise<void>;  // calls PATCH /categories/reorder
  loading: boolean;                       // initial fetch / delete loading
  isDndDisabled: boolean;                 // true when search or filter is active
}
```

`SortableCategoryList` receives the `categories` prop as the filtered list from the parent (when search is active, this is `filteredCategories`). The full category set for the reorder API is managed separately — the `onReorder` callback always sends all category IDs in the correct order, not just the filtered subset (see Section 8.2).

### 7.2 `SortableCategoryRow` Props

```ts
interface SortableCategoryRowProps {
  category: CategoryDto;
  isActive: boolean;                      // true when this row is being dragged
  isDndDisabled: boolean;
  isSaving: boolean;
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
}
```

### 7.3 `CategoryRowSnapshot` Props

```ts
interface CategoryRowSnapshotProps {
  category: CategoryDto;                  // the category being dragged
}
```

### 7.4 `DragHandle` Props

```ts
interface DragHandleProps {
  disabled: boolean;
  listeners?: DraggableSyntheticListeners;   // from useSortable()
  attributes?: DraggableAttributes;          // from useSortable()
}
```

### 7.5 `DnDStatusBanner` Props

```ts
interface DnDStatusBannerProps {
  visible: boolean;                       // render only when true
}
```

---

## 8. Integration Points in `CategoriesPage`

### 8.1 Required Additions to `CategoriesPage`

```tsx
// New hook (from @shreehari/data-access)
const { reorderCategories, loading: reorderLoading } = useReorderCategories();

// isDndDisabled derivation
const isDndDisabled = searchValue.trim() !== '';

// filteredCategories — retained for list display (see Section 8.2)
const filteredCategories = searchValue.trim()
  ? (categoriesData ?? []).filter(cat =>
      cat.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  : (categoriesData ?? []);

// Replace DataTable with:
<DnDStatusBanner visible={isDndDisabled} />
<SortableCategoryList
  categories={filteredCategories}
  onReorder={reorderCategories}
  loading={loading || deleteLoading || reorderLoading}
  isDndDisabled={isDndDisabled}
/>
```

### 8.2 Filtering Behaviour

`filteredCategories` is **retained** in `CategoriesPage`. The computed variable filters the rendered rows when `searchValue` is non-empty. `SortableCategoryList` receives `filteredCategories` (not the full `categoriesData`) so the visible list reflects the search query.

**Explicit design decision:** "Search filters the visible list AND disables DnD. The reorder API always operates on the full category set, not the filtered subset."

- `isDndDisabled` remains `searchValue.trim() !== ''` — this disables drag-and-drop without removing the filtering of visible rows.
- When a reorder is performed (only possible when `searchValue` is empty, i.e., `filteredCategories === categoriesData`), `onReorder` sends the complete ordered ID list.
- The `DnDStatusBanner` communicates to the admin that reordering is unavailable while searching.

> **Note on previous spec version:** An earlier draft removed `filteredCategories` and kept the full list visible while search was active. This decision has been reverted. Filtering the visible list is retained for usability; DnD is disabled (not the filtering) to prevent sort order corruption.

### 8.3 Unchanged in `CategoriesPage`

- `PageHeader` (title, subtitle, "New Category" button action)
- `SearchFilter` (props, behavior, state)
- `handleDeleteCategory` (modal confirmation flow, notification messages)
- Navigation to `/categories/:id/edit`
- Navigation to `/categories/new`
- Error state rendering (`if (error) return ...`)

---

## 9. Dependencies

### 9.1 New npm Packages

Per FR-AD-9, only two new packages are added to `apps/admin/package.json`:

```json
"@dnd-kit/core": "^6.x",
"@dnd-kit/sortable": "^8.x"
```

No other new dependencies. `@dnd-kit/utilities` (used for `CSS.Transform.toString`) is a peer dependency of `@dnd-kit/sortable` and will be installed automatically.

### 9.2 New Data Access Hook

`useReorderCategories` must be exported from `@shreehari/data-access` (FR-BE-9). The hook calls `PATCH /categories/reorder` and returns `{ reorderCategories, loading, error }` matching the pattern of existing mutation hooks (`useDeleteCategory`, etc.) in the data-access library.

### 9.3 Updated Type

`CategoryDto` from `@shreehari/types` must include `sortOrder: number` (FR-BE-7). The `SortableCategoryList` does not use `sortOrder` directly (the API already returns categories sorted by `sortOrder ASC`), but the field is present on each `CategoryDto` in case it is needed for debugging or future display. No slug field is required by any component in this feature.

---

## 10. Acceptance Criteria Cross-Reference

| AC ID | UI Spec Section | Notes |
|-------|----------------|-------|
| AC-AD-1 | Sections 1, 4.1–4.2 | Sortable list replaces DataTable; verified by visual inspection |
| AC-AD-2 | Section 3.3 (step c) | Optimistic update via `setLocalOrder(newOrder)` before API returns |
| AC-AD-3 | Section 3.3 (step g) | Persistence relies on backend; `refetch()` (from `useCategories()`) called by `CategoriesPage.handleReorder` on success to sync local state |
| AC-AD-4 | Section 3.5, 6.1 | Rollback to `preReorderSnapshot` + error toast |
| AC-AD-5 | Sections 2.4, 3.4, 4.7 | `isDndDisabled` disables sensors + handle styling |
| AC-AD-6 | Section 5.2 | `aria-disabled="true"` on `DragHandle` when disabled |
| AC-AD-7 | Section 5.1 | `KeyboardSensor` + `sortableKeyboardCoordinates` configured |
