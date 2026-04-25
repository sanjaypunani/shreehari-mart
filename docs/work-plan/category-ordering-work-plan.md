# Work Plan: Category Custom Sort Order

**Status:** Ready for implementation
**Date:** 2026-03-21
**PRD:** `shreehari-mart/docs/prd/category-ordering-prd.md`
**Backend Design:** `shreehari-mart/docs/design/category-ordering-backend-design.md`
**Frontend Design:** `shreehari-mart/docs/design/category-ordering-frontend-design.md`

---

## Overview

This work plan organises the category ordering feature into three vertical slices. Each phase delivers a working, independently testable unit of functionality. The integration complete criteria at the end of Phase 3 define the exit condition for the full feature.

**Integration complete criteria:**

- `GET /api/categories` returns every category object with a `sortOrder` field and the array is ordered by `sortOrder ASC, name ASC`.
- `PATCH /api/categories/reorder` responds `200 { success: true }` with a valid complete UUID array.
- Admin categories page renders drag handles on each row and fires `PATCH /api/categories/reorder` on drop, with optimistic update and rollback on failure.

---

## Phase 1 — Data Foundation (Backend)

**Task file:** `category-ordering-backend-task-1.md`

### Objective

Persist the `sortOrder` column to the database, backfill existing rows, and update all repository operations to respect the new column. After this phase the API layer and frontend are unaffected — the database and repository are the only changed components.

### Target Files

| File | Change |
|------|--------|
| `libs/data-access/src/entities/Category.ts` | Add `sortOrder` column with `@Index()` decorator |
| `libs/data-access/src/database/migrations/<timestamp>-AddCategorySortOrder.ts` | Create new migration: add column, backfill, add index |
| `libs/data-access/src/repositories/CategoryRepository.ts` | Update `findAll()` ordering; update `create()` with shift transaction; add `reorder()` method; add `ReorderValidationError` class |

**Migration directory:** `libs/data-access/src/database/migrations/`
(existing files follow the `<timestamp>-<Name>.ts` convention, e.g. `1760000000000-CreateUsersAndCustomerLink.ts`)

### Detailed Steps

**1a — Entity: add `sortOrder` column**

In `libs/data-access/src/entities/Category.ts`, add a new column after `imageUrl` and before `createdAt`. The `Index` decorator is already imported in this file.

```typescript
@Index()
@Column({ type: 'int', default: 0 })
sortOrder!: number;
```

**1b — Migration: `<timestamp>-AddCategorySortOrder.ts`**

Generate the timestamp at file-creation time (`Date.now()`). The migration must:

- `up()`: Guard-check for column existence before `addColumn`; run unconditional backfill `UPDATE` using `ROW_NUMBER() OVER (ORDER BY name ASC) - 1`; guard-check for index existence before `createIndex('IDX_categories_sortOrder')`.
- `down()`: Drop index `IDX_categories_sortOrder` if present; drop column `sortOrder` if present.

The full `up()` and `down()` implementations are specified verbatim in the backend design doc (Section 7.2 and 7.3).

**1c — Repository: `findAll()` ordering change**

Change the single `.orderBy()` call from `'category.name', 'ASC'` to:

```typescript
.orderBy('category.sortOrder', 'ASC')
.addOrderBy('category.name', 'ASC')
```

**1d — Repository: `create()` transaction wrapping**

Replace the current simple `this.repository.create(data)` + `this.repository.save(category)` with a transaction that:
1. Issues `UPDATE categories SET "sortOrder" = "sortOrder" + 1` (all rows, no WHERE).
2. Inserts the new category with `sortOrder: 0`.

Full implementation in backend design doc Section 3.2.

**1e — Repository: add `ReorderValidationError` and `reorder()` method**

Add `ReorderValidationError` (exported class, extends `Error`) to `CategoryRepository.ts`.

Add `async reorder(orderedIds: string[]): Promise<void>` which:
- Validates no duplicates in the input array.
- Fetches all existing IDs inside the transaction.
- Validates exact set match (throws `ReorderValidationError` on mismatch).
- Issues a single parameterized `UPDATE … SET "sortOrder" = CASE … END WHERE id IN (…)` statement.

Full parameterized CASE implementation (no string interpolation) is in backend design doc Section 3.3.

### Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-BE-1 | Migration runs without error; `sortOrder` column exists after `npm run migration:run` |
| AC-BE-2 | After migration, existing categories have sequential `sortOrder` values ordered by name (0-indexed, alphabetical) |
| AC-BE-3 | `GET /categories` returns categories ordered by `sortOrder ASC` |
| AC-BE-4 | Creating a new category sets `sortOrder = 0` and increments all other categories' `sortOrder` by 1 |
| NFR-R-1 | `reorder()` is atomic; any failure rolls back the entire transaction |
| NFR-P-2 | Reorder update uses a single bulk statement — no per-row round-trips |
| NFR-P-3 | `IDX_categories_sortOrder` index created by the migration |
| NFR-D-2 | Migration `up()` is idempotent — safe to run against a DB where column already exists |
| NFR-BC-1 | Migration is non-destructive; existing category data unchanged except for addition of `sortOrder` |

### Dependencies

None — this is the first phase.

---

## Phase 2 — API + Shared Types (Backend)

**Task file:** `category-ordering-backend-task-2.md`

### Objective

Expose the data layer work from Phase 1 through the HTTP API and shared type system. After this phase, any API consumer (storefront, admin, external client) receives `sortOrder` on every category object and can call `PATCH /api/categories/reorder` to persist a new order.

### Target Files

| File | Change |
|------|--------|
| `libs/types/src/index.ts` | Add `sortOrder: number` to `CategoryDto`; update `imageUrl` to `string \| null`; add `ReorderCategoriesDto` interface |
| `apps/api/src/app/routes/categories.routes.ts` | Add `PATCH /reorder` handler before existing `/:id` routes; import `ReorderValidationError` |
| `libs/data-access/src/index.ts` | Export `ReorderValidationError`; add `ReorderCategoriesDto` to type imports; add `useReorderCategories` hook |

### Detailed Steps

**2a — Shared types: update `CategoryDto` and add `ReorderCategoriesDto`**

In `libs/types/src/index.ts`, in the `// Category DTOs` section (currently at line 274):

- Add `sortOrder: number;` (non-optional) after `productCount?: number;` in `CategoryDto`.
- Update `imageUrl?: string;` to `imageUrl?: string | null;` to accurately reflect the nullable DB column.
- Add after `UpdateCategoryDto`:

```typescript
export interface ReorderCategoriesDto {
  ids: string[];
}
```

**2b — API route: `PATCH /categories/reorder`**

In `apps/api/src/app/routes/categories.routes.ts`, register `router.patch('/reorder', ...)` **before** any `router.get('/:id', ...)` or other `/:id` routes to prevent Express from matching the literal string `"reorder"` as an `:id` parameter.

The handler must:
1. Validate `ids` is a non-empty array (400 if not).
2. Validate every element passes UUID regex `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` (400 if not).
3. Call `categoryRepo.reorder(ids)`.
4. Return `200 { success: true }` on success.
5. Catch `ReorderValidationError` → 400; all other errors → 500.

Import `ReorderValidationError` from `@shreehari/data-access`. Full handler implementation in backend design doc Section 4.1.

**2c — Data-access exports: `ReorderValidationError` and `useReorderCategories`**

In `libs/data-access/src/index.ts`:

- Add to the repository re-exports block:
  ```typescript
  export { ReorderValidationError } from './repositories/CategoryRepository';
  ```

- Add `ReorderCategoriesDto` to the existing type import block from `@shreehari/types` (currently lines 46–76).

- Add `useReorderCategories` hook after `useDeleteCategory` (end of the Category API hooks section). The hook uses `useState` + `fetch` directly (not `apiCall`, because the reorder hook reads the `message` field from error responses). Full implementation in frontend design doc Section 5.1 and backend design doc Section 5.3.

### Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-BE-5 | `PATCH /categories/reorder` with a valid complete UUID array returns `200 { success: true }` and the new order persists |
| AC-BE-6 | `PATCH /categories/reorder` with partial/mismatched/empty array returns 400 |
| AC-BE-7 | `CategoryDto` includes `sortOrder: number` in all list and detail responses |
| NFR-D-1 | Endpoint rejects arrays that do not exactly match all categories in the database |
| NFR-P-1 | Endpoint completes within 500 ms for up to 200 categories |
| NFR-BC-2 | Existing consumers that ignore `sortOrder` continue to function without modification |

**Integration tests to pass (test skeleton in `apps/api/src/app/routes/categories.reorder.int.test.ts`):**

- `PATCH /api/categories/reorder` suite: all 7 test cases (happy path, new-category insertion, 4 validation error cases, atomicity rollback).
- `GET /api/categories — sortOrder field` suite: both test cases (field presence, sort order correctness).

### Dependencies

- Phase 1 must be complete (entity column and `reorder()` repository method must exist).

---

## Phase 3 — Admin UI (Frontend)

**Task file:** `category-ordering-frontend-task-1.md`

### Objective

Replace the `DataTable` on the admin Categories page with a drag-and-drop sortable list. After this phase the full feature is live end-to-end: the admin can reorder categories via drag-and-drop or keyboard, the order persists to the database, and the storefront reflects the change automatically.

### Target Files

| File | Change |
|------|--------|
| `shreehari-mart/package.json` | Add `@dnd-kit/core` and `@dnd-kit/sortable` to `dependencies` |
| `apps/admin/src/components/categories/SortableCategoryList.tsx` | Create — core DnD list, owns all DnD context and optimistic state |
| `apps/admin/src/components/categories/SortableCategoryRow.tsx` | Create — per-row component with `useSortable()` |
| `apps/admin/src/components/categories/CategoryRowSnapshot.tsx` | Create — stateless ghost row for `DragOverlay` |
| `apps/admin/src/components/categories/DragHandle.tsx` | Create — handle with correct ARIA attributes |
| `apps/admin/src/components/categories/DnDStatusBanner.tsx` | Create — banner shown when search is active |
| `apps/admin/src/pages/CategoriesPage.tsx` | Modify — remove `DataTable`, add `useReorderCategories`, derive `isDndDisabled`, render new components |

**New directory to create:** `apps/admin/src/components/categories/` (does not currently exist)

### Detailed Steps

**3a — Install dependencies**

Add to the monorepo root `shreehari-mart/package.json` `dependencies` section (the admin app uses the monorepo root package.json; there is no separate `apps/admin/package.json`):

```json
"@dnd-kit/core": "^6.x",
"@dnd-kit/sortable": "^8.x"
```

Run `npm install` from `shreehari-mart/`.

**3b — `DnDStatusBanner.tsx`**

Simplest component; create first to unblock `CategoriesPage` changes.

- Props: `visible: boolean`
- Renders `null` when `visible` is false.
- Renders a Mantine `Alert` (variant="light", color="yellow") with `title="Reordering unavailable"`, `icon={<IconInfoCircle size={16} />}` (from `@tabler/icons-react`, already installed), and message `"Clear the search field to drag and reorder categories."` when visible.

**3c — `DragHandle.tsx`**

- Props: `disabled: boolean; listeners: SyntheticListenerMap | undefined; attributes: DraggableAttributes`
- Renders a Mantine `ActionIcon` with `IconGripVertical` (from `@tabler/icons-react`, already installed).
- When `disabled`: spreads no `listeners` or `attributes`; sets `aria-disabled="true"`; sets `aria-label="Drag to reorder (unavailable while searching)"`; applies `style={{ cursor: 'not-allowed', opacity: 0.4 }}`.
- When not disabled: spreads `{...listeners} {...attributes}`; sets `aria-label="Drag to reorder"`; sets `aria-describedby="category-list-keyboard-hint"`.

Full ARIA spec in frontend design doc Section 9.2.

**3d — `CategoryRowSnapshot.tsx`**

- Props: `category: CategoryDto`
- Stateless clone of the row visual, rendered inside `DragOverlay` during an active drag.
- Must not use `useSortable()` or any dnd-kit hooks.
- Renders: image thumbnail, name (`Text` size="sm" fw={500}), product count (`Badge` variant="outline"), Edit + Delete `ActionIcon` (both visually present but non-interactive, i.e. no `onClick`).
- Does not render `category.slug` (field does not exist on the entity).

**3e — `SortableCategoryRow.tsx`**

- Props: `category: CategoryDto; isDndDisabled: boolean; isSaving: boolean; onEdit: () => void; onDelete: () => void`
- Uses `useSortable({ id: category.id })`.
- Applies `transform: CSS.Transform.toString(transform)` and `transition` styles during drag.
- When `isDragging` (`isActive`): applies placeholder style (e.g. reduced opacity, dashed border).
- Renders in order: `DragHandle` (receives `disabled={isDndDisabled || isSaving}`, `listeners`, `attributes`), image, name, product count, Edit `ActionIcon`, Delete `ActionIcon` (`disabled={isSaving}`).
- Sets `role="listitem"` on the row container.

**3f — `SortableCategoryList.tsx`**

This is the core component. It owns:

- `localOrder: CategoryDto[]` — initialised from the `categories` prop; synced via `useEffect` only when `activeId === null && !isSaving`.
- `preReorderSnapshot: CategoryDto[]` — saved copy before a drag for rollback.
- `activeId: string | null` — UUID of item being dragged, set in `onDragStart`.
- `isSaving: boolean` — true while the PATCH API call is in flight.

Sensor configuration (frontend design doc Section 9.1):

```typescript
const activeSensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);
const disabledSensors = useSensors(); // empty
```

`DndContext` receives `sensors={isDndDisabled || isSaving ? disabledSensors : activeSensors}`.

`onDragEnd` logic:

1. If `over === null` or `active.id === over.id`: clear `activeId`, return early (no API call).
2. Save `preReorderSnapshot`.
3. Compute `newOrder = arrayMove(localOrder, oldIndex, newIndex)`.
4. `setLocalOrder(newOrder)` (optimistic).
5. `setIsSaving(true)`.
6. Call `onReorder(newOrder.map(c => c.id))`.
7. On success: clear `preReorderSnapshot`, set `isSaving(false)`.
8. On error: `setLocalOrder(preReorderSnapshot)`, clear snapshot, set `isSaving(false)`, show error toast.

The rendered structure is: `Card` (position: relative) wrapping `LoadingOverlay`, `VisuallyHidden` keyboard hint, `div[role="list"]` with `SortableCategoryRow[]` inside `SortableContext`, then `DragOverlay` rendering `CategoryRowSnapshot` when `activeId` is set.

Props: `categories: CategoryDto[]; onReorder: (ids: string[]) => Promise<void>; loading: boolean; isDndDisabled: boolean; onEdit: (id: string) => void; onDelete: (category: CategoryDto) => void`

**3g — Update `CategoriesPage.tsx`**

Changes from the current implementation (`apps/admin/src/pages/CategoriesPage.tsx`):

- Add import: `useReorderCategories` from `@shreehari/data-access`.
- Add import: `DnDStatusBanner`, `SortableCategoryList` from the new `categories/` components.
- Remove imports: `DataTable`, `Column`, `DataTableAction` from `@shreehari/ui`.
- Add hook call: `const { reorderCategories, loading: reorderLoading } = useReorderCategories();`
- Derive `isDndDisabled`: `const isDndDisabled = searchValue.trim() !== '';`
- Add `handleReorder` callback:
  ```typescript
  const handleReorder = async (ids: string[]) => {
    await reorderCategories({ ids });
    refetch();
  };
  ```
- Remove the `columns` array, `actions` array definitions.
- Replace `<DataTable ... />` with:
  ```tsx
  <DnDStatusBanner visible={isDndDisabled} />
  <SortableCategoryList
    categories={filteredCategories}
    onReorder={handleReorder}
    loading={loading || deleteLoading || reorderLoading}
    isDndDisabled={isDndDisabled}
    onEdit={(id) => navigate(`/categories/${id}/edit`)}
    onDelete={handleDeleteCategory}
  />
  ```

The `handleDeleteCategory` function, `PageHeader`, `SearchFilter`, and error state are unchanged.

### Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-AD-1 | Categories page renders a reorderable list (not a DataTable) when no search is active |
| AC-AD-2 | Dragging a row updates the displayed order immediately (optimistic update) |
| AC-AD-3 | After a successful drag-and-drop, refreshing the page shows the same order |
| AC-AD-4 | On API failure, the list reverts to its pre-drag order and a "Reorder failed" error toast appears |
| AC-AD-5 | When search is active, drag handles appear disabled and dragging has no effect |
| AC-AD-6 | Disabled drag handles carry `aria-disabled="true"` |
| AC-AD-7 | The list is keyboard-reorderable via Space + arrow keys |
| AC-WEB-1 | After admin reorders, the storefront category list reflects the new order (no code change to `apps/web`) |
| AC-WEB-2 | The storefront `CategorySidebar` reflects the new order (no code change to `apps/web`) |
| NFR-A-1 | `KeyboardSensor` with `sortableKeyboardCoordinates` is configured and not disabled |
| NFR-A-2 | `VisuallyHidden` keyboard instructions are present and referenced via `aria-describedby` |
| NFR-A-3 | `DragHandle` has accessible `aria-label` in both normal and disabled states |
| NFR-A-4 | Disabled drag handles communicate state to screen readers via `aria-disabled="true"` |
| NFR-R-2 | Displayed order never permanently diverges from the persisted order (optimistic rollback on failure) |

**E2E tests to pass (skeleton in `apps/web-e2e/src/category-reorder.e2e.ts`):**

All 11 test cases in the `Category drag-and-drop reorder — Admin Dashboard` suite, covering: drag handle visibility, drag-to-persist, optimistic update, error rollback, DnD-disabled-when-searching (3 tests), and ARIA attribute verification (3 tests).

### Dependencies

- Phase 1 must be complete (entity and repository changes provide the correct sort on `GET /api/categories`).
- Phase 2 must be complete (`useReorderCategories` hook exported from `@shreehari/data-access`; `ReorderCategoriesDto` and updated `CategoryDto` in `@shreehari/types`).

---

## Dependency Graph

```
Phase 1 (Data Foundation)
  └── Phase 2 (API + Types)
        └── Phase 3 (Admin UI)
```

Phases must be implemented sequentially. Within each phase, steps can be implemented in any order because they target different files, but all steps in a phase should be complete before moving to the next phase.

---

## Files Not Changed

| File | Reason |
|------|--------|
| `apps/web/**` | Storefront automatically reflects sorted API response (FR-WEB-1, FR-WEB-2) |
| `apps/api/src/app/server.ts` | Router already mounted at `/api/categories`; no registration change needed |
| `libs/ui/src/components/DataTable.tsx` | Component not modified; only removed from `CategoriesPage` usage |
| `libs/ui/src/components/PageHeader.tsx` | Unchanged |
| `libs/ui/src/components/SearchFilter.tsx` | Props and behavior unchanged |
| `apps/admin/src/components/Layout.tsx` | Unaffected |
| `order_delivery_manager_app/**` | Out of scope per PRD Section 7 |

---

## Out of Scope (PRD Section 7)

- Sub-category ordering
- Per-user or per-session ordering
- Automatic reordering rules
- Bulk import/export of sort order values
- Undo/redo history for drag-and-drop
- Drag-and-drop on the storefront
- Category ordering in `order_delivery_manager_app`
