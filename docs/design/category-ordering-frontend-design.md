# Frontend Design Doc: Category Custom Sort Order

**Status:** Draft
**Date:** 2026-03-21
**PRD Reference:** `shreehari-mart/docs/prd/category-ordering-prd.md`
**Backend Design Reference:** `shreehari-mart/docs/design/category-ordering-backend-design.md`
**UI Spec Reference:** `shreehari-mart/docs/ui-spec/category-ordering-ui-spec.md`
**Feature Scope:** `apps/admin` · `libs/data-access/src/index.ts`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Dependency Changes](#2-dependency-changes)
3. [Component Architecture](#3-component-architecture)
4. [State Management](#4-state-management)
5. [Data Fetching and Hook Design](#5-data-fetching-and-hook-design)
6. [API Integration](#6-api-integration)
7. [Integration Points with Backend](#7-integration-points-with-backend)
8. [File Changes](#8-file-changes)
9. [Accessibility Implementation](#9-accessibility-implementation)
10. [Error Handling](#10-error-handling)
11. [Acceptance Criteria Cross-Reference](#11-acceptance-criteria-cross-reference)

---

## 1. Overview

The existing `DataTable` component on the admin `CategoriesPage` is replaced entirely with a drag-and-drop sortable list powered by `@dnd-kit/core` and `@dnd-kit/sortable`. The feature introduces five new components in a dedicated `apps/admin/src/components/categories/` directory, one new data-access hook (`useReorderCategories`), and targeted modifications to `CategoriesPage.tsx`.

Key design decisions:

- **Drag-and-drop is disabled — not hidden — when search is active.** The list still filters; only drag initiation is blocked (sensors set to empty array in `DndContext`).
- **Optimistic updates with rollback.** On `dragEnd`, the local order is updated immediately; if the API call fails the pre-drag order is restored and an error toast is shown.
- **No live row-shuffle on drag-over.** The `localOrder` array is mutated only in `onDragEnd`, not `onDragOver`. A drop-indicator line provides positional feedback during drag without the complexity of live reordering.
- **New categories appear at top.** The backend inserts new categories with `sortOrder = 0` and shifts all others up. The frontend reflects this automatically because `GET /api/categories` returns rows ordered by `sortOrder ASC`.
- **The hook follows the existing data-access pattern** — raw `useState` + `fetch`, not React Query — matching `useDeleteCategory` and all other mutation hooks already in `libs/data-access/src/index.ts`. Cache invalidation is achieved by calling `refetch()` from `useCategories()` after a successful reorder, consistent with how `handleDeleteCategory` already works.

---

## 2. Dependency Changes

### 2.1 New npm Packages

Add to `apps/admin/package.json` (FR-AD-9):

```json
"@dnd-kit/core": "^6.x",
"@dnd-kit/sortable": "^8.x"
```

`@dnd-kit/utilities` is a peer dependency of `@dnd-kit/sortable` and will be installed automatically. It provides `CSS.Transform.toString` used in `SortableCategoryRow` to apply the `transform` style during drag.

No other new packages are required. All visual components (`Card`, `Alert`, `Badge`, `ActionIcon`, `Text`, `Group`, `Divider`, `LoadingOverlay`, `VisuallyHidden`) are already available from `@mantine/core`. The drag handle icon (`IconGripVertical`) is already available from `@tabler/icons-react`, which is already installed.

### 2.2 Installation Command

```bash
# Run from apps/admin/
npm install @dnd-kit/core @dnd-kit/sortable
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

The `CategoriesPage` outer layout (`Stack`, `PageHeader`, `SearchFilter`) is unchanged. The `DataTable` is removed and replaced by the two new top-level elements shown below.

```
CategoriesPage                              (modified — apps/admin/src/pages/CategoriesPage.tsx)
├── PageHeader                              (existing — unchanged)
├── SearchFilter                            (existing — unchanged)
├── DnDStatusBanner                         (NEW — conditional, shown when isDndDisabled)
└── SortableCategoryList                    (NEW — replaces DataTable entirely)
    ├── Card (Mantine)                      (list container with position:relative for LoadingOverlay)
    │   ├── LoadingOverlay                  (Mantine — visible when isSaving or loading)
    │   ├── VisuallyHidden                  (Mantine — keyboard hint, id="category-list-keyboard-hint")
    │   └── div[role="list"]               (list container with aria-label + aria-describedby)
    │       └── SortableCategoryRow[]       (NEW — one per category in localOrder)
    │           ├── DragHandle              (NEW — leftmost cell, receives useSortable listeners)
    │           ├── Image (Mantine)         (48×48 thumbnail)
    │           ├── Text (name)             (size="sm" fw={500})
    │           ├── Badge (productCount)    (variant="outline")
    │           └── ActionsCell             (Edit + Delete ActionIcon, Delete disabled when isSaving)
    ├── DndContext (@dnd-kit/core)          (wraps SortableContext and DragOverlay)
    │   ├── SortableContext (@dnd-kit/sortable)
    │   └── DragOverlay (@dnd-kit/core)
    │       └── CategoryRowSnapshot        (NEW — stateless ghost row during active drag)
    └── drop-indicator Box                  (Mantine Box, 2px horizontal line, shown between rows at overId)
```

**LoadingOverlay positioning note:** The Mantine `Card` must have `position: relative`. `LoadingOverlay` must be a direct child of the `Card` to position correctly over the list area. `DndContext` wraps `SortableContext` and `DragOverlay` and should be rendered as a sibling inside the Card, after `LoadingOverlay`.

### 3.2 New Components — Responsibilities and File Locations

All new component files are created in `apps/admin/src/components/categories/`. This directory does not currently exist and must be created.

| Component | File | Responsibility |
|-----------|------|----------------|
| `SortableCategoryList` | `apps/admin/src/components/categories/SortableCategoryList.tsx` | Owns `DndContext`, `SortableContext`, `DragOverlay`. Manages `localOrder`, `preReorderSnapshot`, `activeId`, and `isSaving` local state. Calls `onReorder` on drag end. Renders the Mantine `Card` container with `LoadingOverlay`. |
| `SortableCategoryRow` | `apps/admin/src/components/categories/SortableCategoryRow.tsx` | Wraps a single category with `useSortable()`. Renders `DragHandle` + all data cells (image, name, product count, actions) + action buttons. Does not render category.slug. Applies placeholder styles when `isActive` is true. Applies CSS transform from `useSortable` during drag. |
| `CategoryRowSnapshot` | `apps/admin/src/components/categories/CategoryRowSnapshot.tsx` | Stateless visual clone rendered inside `DragOverlay` during active drag. Receives one `category` prop. Renders the same column layout as `SortableCategoryRow` but without drag listeners, transform, or interactive actions. |
| `DnDStatusBanner` | `apps/admin/src/components/categories/DnDStatusBanner.tsx` | Renders a Mantine `Alert` (variant="light", color="yellow") with `title="Reordering unavailable"`, `icon={<IconInfoCircle size={16} />}`, and the message "Clear the search field to drag and reorder categories." Controlled by a `visible: boolean` prop — renders `null` when false. Note: `IconInfoCircle` is from `@tabler/icons-react` (already installed, no new dependency). |
| `DragHandle` | `apps/admin/src/components/categories/DragHandle.tsx` | Renders a Mantine `ActionIcon` containing `IconGripVertical`. Accepts `disabled`, `listeners`, and `attributes` props from `useSortable()`. Spreads listeners and attributes only when not disabled. Applies `aria-disabled`, `aria-label`, and `aria-describedby` correctly for both normal and disabled states. |

### 3.3 Rationale for Component Split

`SortableCategoryList` is intentionally separate from `CategoriesPage` so that all dnd-kit context, optimistic state, and sensor configuration are encapsulated and do not leak into the page component. `CategoriesPage` remains responsible only for data fetching and routing; it passes down data and callbacks.

`CategoryRowSnapshot` is separate from `SortableCategoryRow` because `DragOverlay` renders outside the `SortableContext` and must not receive `useSortable` hooks or transform styles. A dedicated stateless clone avoids conditional hook usage.

`DragHandle` is a separate component because its prop API is non-trivial (listeners, attributes from `useSortable`) and the disabled/active conditional logic on aria attributes needs a single, testable unit.

### 3.4 Existing Components — No Changes

The following components from `@shreehari/ui` are used by the existing `CategoriesPage` and require no modification for this feature:

- `PageHeader` — title, subtitle, "New Category" button action unchanged
- `SearchFilter` — props, behavior, state unchanged
- `DataTable` — removed from `CategoriesPage` but the component itself is not modified; it remains available for other pages

---

## 4. State Management

### 4.1 State Location

All sortable-list state lives locally in `SortableCategoryList`. `CategoriesPage` owns only data fetching state (via `useCategories`) and derives `isDndDisabled` from `searchValue`.

```
CategoriesPage (owns)
  searchValue: string                     (useState — existing)
  filtersExpanded: boolean                (useState — existing)
  isDndDisabled: boolean                  (derived: searchValue.trim() !== '')

  ↓ props passed to SortableCategoryList:
  categories: CategoryDto[]               (filteredCategories — already in existing code)
  onReorder: (ids: string[]) => Promise<void>   (from useReorderCategories)
  loading: boolean                        (loading || deleteLoading || reorderLoading)
  isDndDisabled: boolean

SortableCategoryList (owns)
  localOrder: CategoryDto[]               (useState — optimistic copy of the displayed list)
  preReorderSnapshot: CategoryDto[]       (useState — pre-drag snapshot for rollback)
  activeId: string | null                 (useState — UUID of item currently being dragged)
  isSaving: boolean                       (useState — true while PATCH /categories/reorder is in flight)
```

### 4.2 State Initialization and Sync

`localOrder` is initialized from the `categories` prop on first render:

```tsx
const [localOrder, setLocalOrder] = useState<CategoryDto[]>(categories);
```

A `useEffect` syncs `localOrder` from the `categories` prop only when no drag is in progress and no save is in flight. This prevents a background `refetch()` triggered after a successful delete (via `refetch()` in `handleDeleteCategory`) from overwriting an in-flight optimistic update.

```tsx
useEffect(() => {
  if (activeId === null && !isSaving) {
    setLocalOrder(categories);
  }
}, [categories, activeId, isSaving]);
```

**Why `categories` and not `categoriesData`:** `CategoriesPage` passes `filteredCategories` (which is `categoriesData` when no search is active, or the filtered subset when search is active). When search is inactive (the only time DnD is enabled), `filteredCategories === categoriesData`, so the full set flows into `localOrder` correctly.

### 4.3 Optimistic Update State Sequence

| Step | `localOrder` | `preReorderSnapshot` | `activeId` | `isSaving` |
|------|-------------|---------------------|------------|------------|
| Initial render | `categories` prop | `[]` | `null` | `false` |
| `onDragStart` fires | unchanged | unchanged | set to dragged id | `false` |
| `onDragEnd` (same position / no move) | unchanged | unchanged | `null` | `false` |
| `onDragEnd` (valid move) | reordered via `arrayMove` | saved copy of prior `localOrder` | `null` | `true` |
| API success | unchanged | cleared (`[]`) | `null` | `false` |
| API error | reverted to `preReorderSnapshot` | cleared (`[]`) | `null` | `false` + error toast |

### 4.4 `isDndDisabled` Derivation

Computed in `CategoriesPage`, derived from the existing `searchValue` state that already controls `filteredCategories`:

```tsx
const isDndDisabled = searchValue.trim() !== '';
```

This boolean is passed as a prop to both `SortableCategoryList` (controls sensor configuration and handle interactivity) and `DnDStatusBanner` (controls visibility). It is the single source of truth for the disabled state throughout the feature.

**Effect on sensors:** When `isDndDisabled || isSaving` is true, `DndContext` receives `sensors={[]}` (an empty array). This prevents dnd-kit from initiating any drag at the framework level, not just at the handle level. The handle-level `aria-disabled` and `pointerEvents: none` provide a visual and accessibility layer on top, but the empty sensors array is the authoritative mechanism that prevents drag state from ever being entered.

### 4.5 "Cache Invalidation" — Pattern Alignment

> **Note:** The UI Spec (Section 3.3 step g) references `queryClient.invalidateQueries(['categories'])` — this is incorrect for this codebase. The codebase uses raw useState+fetch hooks, not React Query. The correct mechanism is `refetch()` from `useCategories()`, as documented here. The UI Spec reference to `queryClient` should be ignored.

The existing data-access layer uses raw `useState` + `fetch` hooks (not React Query), so there is no `queryClient.invalidateQueries` available. Cache invalidation after a successful reorder is achieved by calling `refetch()` from `useCategories()`, exactly as `handleDeleteCategory` already does after a successful delete. This keeps the pattern consistent with the rest of the admin codebase.

The `onReorder` callback in `CategoriesPage` will call `refetch()` after `reorderCategories` resolves:

```tsx
const handleReorder = async (ids: string[]) => {
  await reorderCategories({ ids });
  refetch();
};
```

`refetch()` is called only on success (awaited before it). On error, `reorderCategories` throws, the `await` never completes normally, and `SortableCategoryList` catches the error and rolls back `localOrder` — `refetch()` is not called, preserving the rolled-back state.

---

## 5. Data Fetching and Hook Design

### 5.1 `useReorderCategories` — New Hook

**File:** `libs/data-access/src/index.ts` — added at the end of the Category API hooks section, after `useDeleteCategory`.

The hook follows the exact same pattern as `useDeleteCategory`: `useState` for `loading` and `error`, a mutation function that calls `apiCall`, and returns `{ reorderCategories, loading, error }`.

```tsx
export const useReorderCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderCategories = async (dto: ReorderCategoriesDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/categories/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = body.message || 'Failed to reorder categories';
        throw new Error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder categories';
      setError(message);
      throw new Error(message);   // re-throw so SortableCategoryList can trigger rollback
    } finally {
      setLoading(false);
    }
  };

  return { reorderCategories, loading, error };
};
```

**Design notes:**

- Uses `fetch` directly (not the internal `apiCall` helper) because `apiCall` only handles `response.ok` as a boolean and discards the response body. The reorder hook needs to read the `message` field from 400 error responses to display specific toast messages (see Section 10.2).
- Re-throws the error after setting state so the caller (`SortableCategoryList`'s `onDragEnd` handler) can catch it and trigger `localOrder` rollback.
- `loading` is used in `CategoriesPage` to contribute to the combined `loading` prop sent to `SortableCategoryList`, which controls `LoadingOverlay` visibility.

### 5.2 `useReorderCategories` — Import Requirement

Add `ReorderCategoriesDto` to the import block in `libs/data-access/src/index.ts` alongside the existing category type imports:

```tsx
import {
  // ... existing imports ...
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoriesDto,      // NEW
} from '@shreehari/types';
```

`ReorderCategoriesDto` is defined in `libs/types/src/index.ts` by the backend implementation (Section 5.2 of the backend design doc): `{ ids: string[] }`.

### 5.3 Existing Hooks — No Changes

`useCategories()` and `useDeleteCategory()` are unchanged. They are consumed by `CategoriesPage` identically to the current implementation. The only addition is calling `refetch()` (already returned by `useCategories`) in the new `handleReorder` wrapper.

### 5.4 Hook Usage in `CategoriesPage`

```tsx
const {
  data: categoriesData,
  loading,
  error,
  refetch,
} = useCategories();

const { deleteCategory, loading: deleteLoading } = useDeleteCategory();
const { reorderCategories, loading: reorderLoading } = useReorderCategories();  // NEW
```

---

## 6. API Integration

### 6.1 Endpoint Consumed

The frontend consumes a single new endpoint defined in the backend design doc (Section 6.2):

| Property | Value |
|----------|-------|
| Method | `PATCH` |
| Path | `/api/categories/reorder` |
| Content-Type | `application/json` |
| Auth | None (consistent with existing write routes) |
| Request body | `{ "ids": ["<uuid>", "<uuid>", ...] }` |
| Success | `200 { "success": true }` |
| Validation error | `400 { "success": false, "message": "<reason>" }` |
| Server error | `500 { "success": false, "message": "...", "error": "..." }` |

### 6.2 When to Call

The endpoint is called exclusively in `onDragEnd`, after the optimistic `localOrder` update:

1. `onDragEnd` receives the `active` and `over` ids from dnd-kit.
2. If `over` is null or `active.id === over.id`, no call is made (no-op drop).
3. Otherwise:
   a. `preReorderSnapshot` is saved.
   b. `newOrder` is computed with `arrayMove(localOrder, oldIndex, newIndex)`.
   c. `setLocalOrder(newOrder)` — optimistic update.
   d. `setIsSaving(true)`.
   e. `onReorder(newOrder.map(cat => cat.id))` is called (which calls `PATCH /categories/reorder`).

The `ids` array must contain **all category UUIDs** in the new desired order. Because `isDndDisabled` is true during any active search, when DnD is available `localOrder` always contains the full (unfiltered) category set. Therefore `newOrder.map(cat => cat.id)` is always a complete list.

### 6.3 `GET /api/categories` — Modified Response Shape

No frontend request changes. The response now includes `sortOrder` on every category object and the array is pre-sorted by `sortOrder ASC, name ASC`. The frontend trusts the array order from the API as the initial render order and does not re-sort client-side.

The updated `CategoryDto` shape (from backend design doc Section 5.1):

```typescript
interface CategoryDto {
  id: string;
  name: string;
  imageUrl?: string;
  productCount?: number;
  sortOrder: number;        // NEW — non-optional
  createdAt: string;
  updatedAt: string;
}
```

The Slug column has been removed from the row layout per product decision. `SortableCategoryRow` does not render `category.slug`.

### 6.4 `POST /api/categories` — Behavior Change, No Frontend Change

Creating a new category continues to use the same request shape. The backend now inserts the new category at `sortOrder = 0` and shifts all others up. After `refetch()` runs (triggered by the existing post-create navigation back to the list), the new category appears at the top of `localOrder` automatically.

---

## 7. Integration Points with Backend

This section maps each frontend component and decision to the authoritative backend contract defined in the backend design doc.

### 7.1 Type Dependencies

> **Note:** The UI Spec Section 7.1 contains a type error — it defines `onReorder: (ids: number[]) => Promise<void>`. The correct type is `string[]` (UUIDs). Use this document's definition (`string[]`) — do not reference the UI Spec's prop interface for this type.

| Frontend consumer | Backend source | Contract |
|---|---|---|
| `useReorderCategories` hook parameter | `libs/types/src/index.ts` → `ReorderCategoriesDto` | `{ ids: string[] }` — UUIDs, not integers |
| `SortableCategoryList.onReorder` callback signature | Backend design doc Section 6.2 | `ids` must be the complete ordered array of all category UUIDs, typed as `string[]` |
| `SortableCategoryRow` and `CategoryRowSnapshot` rendering | `libs/types/src/index.ts` → `CategoryDto` | Must include `sortOrder: number` (non-optional) after backend type update |

### 7.2 ID Type Clarification

The PRD specifies `ids: number[]` but the `Category.id` column is a UUID (`string`). The backend design doc (Section 3.3) explicitly uses `string[]` to match the real entity. All frontend code must use `string[]` for category IDs in reorder payloads.

### 7.3 Backend Exports Required Before Frontend Implementation

The following must be delivered by the backend implementation before the frontend hook can import them:

1. `ReorderCategoriesDto` exported from `libs/types/src/index.ts`
2. `sortOrder: number` field present on `CategoryDto` in `libs/types/src/index.ts`

No direct import of `ReorderValidationError` is needed in the frontend; error discrimination is handled by HTTP status code (400 vs 500) in the hook.

### 7.4 Error Response Discrimination

The `useReorderCategories` hook reads the `message` field from the API error body. `SortableCategoryList` uses HTTP status or the message text to decide which toast message to show:

| API status | Toast title | Toast message |
|---|---|---|
| 400 (stale ID list) | "Reorder failed" | "Category list has changed. Please refresh the page and try again." |
| 400 (other) / 500 / network error | "Reorder failed" | "Could not save the new order. The list has been restored." |

The hook throws the `message` from the API body as the error message. `SortableCategoryList` inspects the thrown error message string to distinguish the stale-list case (message contains "does not match" or "non-empty") from a generic failure.

---

## 8. File Changes

### 8.1 Files to Create (New)

| File | Rationale |
|------|-----------|
| `apps/admin/src/components/categories/SortableCategoryList.tsx` | Core DnD list component. Replaces `DataTable` in `CategoriesPage`. Owns all optimistic state and the `DndContext` configuration. |
| `apps/admin/src/components/categories/SortableCategoryRow.tsx` | Per-row component with `useSortable()` integration. Applies CSS transform during drag. Renders placeholder styles when `isActive`. |
| `apps/admin/src/components/categories/CategoryRowSnapshot.tsx` | Stateless ghost row for `DragOverlay`. Must not use `useSortable()`. |
| `apps/admin/src/components/categories/DragHandle.tsx` | Isolated handle component with correct ARIA attributes in both normal and disabled states. |
| `apps/admin/src/components/categories/DnDStatusBanner.tsx` | Informational `Alert` shown when search is active. |

### 8.2 Files to Modify (Existing)

| File | Change | Rationale |
|------|--------|-----------|
| `apps/admin/src/pages/CategoriesPage.tsx` | Remove `DataTable` and its column/action definitions. Add `useReorderCategories` hook call. Derive `isDndDisabled` from `searchValue`. Add `handleReorder` wrapper. Render `DnDStatusBanner` + `SortableCategoryList` in place of `DataTable`. | Integrates the new components into the existing page layout without changing PageHeader, SearchFilter, or delete/edit flows. |
| `libs/data-access/src/index.ts` | Add `ReorderCategoriesDto` to the import block from `@shreehari/types`. Add `useReorderCategories` export after `useDeleteCategory`. | Follows the established pattern of all other mutation hooks in this file. |
| `apps/admin/package.json` | Add `@dnd-kit/core` and `@dnd-kit/sortable` to `dependencies`. | Required per FR-AD-9. |

### 8.3 Files with Zero Changes

| File | Reason unchanged |
|------|-----------------|
| `apps/web/**` | Storefront automatically reflects sorted API response — no code changes needed (FR-WEB-1) |
| `libs/ui/src/components/DataTable.tsx` | DataTable is removed from `CategoriesPage` but the component itself is not modified; other pages still use it |
| `libs/ui/src/components/PageHeader.tsx` | Layout unchanged |
| `libs/ui/src/components/SearchFilter.tsx` | Props, behavior, and state unchanged |
| `apps/admin/src/components/Layout.tsx` | Not affected |

---

## 9. Accessibility Implementation

### 9.1 Sensor Configuration

```tsx
const activeSensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },   // prevents accidental drag on click
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

const disabledSensors = useSensors();  // empty — no drag initiation allowed

// In DndContext:
sensors={isDndDisabled || isSaving ? disabledSensors : activeSensors}
```

The `distance: 8` activation constraint on `PointerSensor` prevents accidental drags when the user intends a click on the Edit or Delete action icons.

### 9.2 ARIA Attributes

| Element | Attribute | Normal value | Disabled value |
|---------|-----------|-------------|----------------|
| List container (`div[role="list"]`) | `aria-label` | `"Categories list, drag to reorder"` | same |
| List container | `aria-describedby` | `"category-list-keyboard-hint"` | same |
| `DragHandle` | `aria-label` | `"Drag to reorder"` | `"Drag to reorder (unavailable while searching)"` |
| `DragHandle` | `aria-describedby` | `"category-list-keyboard-hint"` | `"category-list-keyboard-hint"` |
| `DragHandle` | `aria-disabled` | not set | `"true"` |
| `SortableCategoryRow` | `aria-roledescription` | `"sortable item"` (via `useSortable` attributes) | same |

### 9.3 Screen Reader Keyboard Instructions

A `VisuallyHidden` paragraph is rendered once inside `SortableCategoryList`, above the list container:

```tsx
<VisuallyHidden id="category-list-keyboard-hint">
  Press Space or Enter to pick up an item, use arrow keys to move it, and press
  Space or Enter again to drop it. Press Escape to cancel.
</VisuallyHidden>
```

Referenced by both the list container and every `DragHandle` via `aria-describedby="category-list-keyboard-hint"`.

### 9.4 Keyboard Flow

1. Tab to the `DragHandle` of the desired row.
2. Press Space or Enter — item is picked up; dnd-kit announces "Picked up sortable item."
3. Press ArrowUp / ArrowDown — item moves; dnd-kit announces position.
4. Press Space or Enter — item is dropped; `onDragEnd` fires, optimistic update and API call proceed as per pointer flow.
5. Press Escape — drag cancelled; item returns to original position with no API call.

dnd-kit's built-in `Announcements` system covers all live region announcements automatically. No custom announcement configuration is required.

### 9.5 Focus Management

After a keyboard drop, focus must remain on the `DragHandle` of the moved row at its new position. dnd-kit's keyboard sensor handles this automatically. Verify in QA that focus does not jump to the top of the document after a keyboard reorder.

---

## 10. Error Handling

### 10.1 Optimistic Rollback

On any error from `onReorder`:

1. `setLocalOrder(preReorderSnapshot)` — list snaps back to pre-drag order.
2. `setPreReorderSnapshot([])` — snapshot cleared.
3. `setIsSaving(false)` — `LoadingOverlay` disappears.
4. Error toast is shown via `notifications.show(...)` from `@mantine/notifications`.

### 10.2 Toast Messages

```tsx
// On 400 with stale-list message:
notifications.show({
  title: 'Reorder failed',
  message: 'Category list has changed. Please refresh the page and try again.',
  color: 'red',
  autoClose: 5000,
});

// On 400 (other) / 500 / network error:
notifications.show({
  title: 'Reorder failed',
  message: 'Could not save the new order. The list has been restored.',
  color: 'red',
  autoClose: 5000,
});
```

### 10.3 Delete During Active Save

While `isSaving === true`, the Delete `ActionIcon` in `SortableCategoryRow` is rendered with `disabled={isSaving}`. The Edit `ActionIcon` remains enabled (navigation-only, no mutation). This prevents a concurrent delete from submitting a stale ID list to the reorder endpoint.

### 10.4 Initial Load Error

The existing error state in `CategoriesPage` is preserved unchanged. If `useCategories()` returns an error, the `SortableCategoryList` is not rendered; the error `Text` message is shown instead.

### 10.5 No-Op Drop

If `onDragEnd` fires with `over === null` (drop outside a droppable area) or `active.id === over.id` (dropped on itself), the handler returns early with no state change and no API call.

---

## 11. Acceptance Criteria Cross-Reference

| AC ID | Frontend Design Section | Implementation mechanism |
|-------|------------------------|-------------------------|
| AC-AD-1 | Section 3.1 | `DataTable` removed; `SortableCategoryList` renders `SortableCategoryRow` per category |
| AC-AD-2 | Section 4.3 | `setLocalOrder(newOrder)` called before `await onReorder(...)` in `onDragEnd` |
| AC-AD-3 | Section 4.5 | `refetch()` called in `handleReorder` after `reorderCategories` resolves successfully |
| AC-AD-4 | Section 10.1–10.2 | `setLocalOrder(preReorderSnapshot)` + error toast in catch block |
| AC-AD-5 | Sections 4.4, 9.1 | `isDndDisabled` sets `sensors=[]` in `DndContext`; handle has `pointerEvents: none` |
| AC-AD-6 | Section 9.2 | `aria-disabled="true"` on `DragHandle` when `isDndDisabled \|\| isSaving` |
| AC-AD-7 | Sections 9.1–9.4 | `KeyboardSensor` + `sortableKeyboardCoordinates` configured; keyboard flow documented |
