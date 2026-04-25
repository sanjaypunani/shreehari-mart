# PRD: Category Custom Sort Order

**Status:** Draft
**Date:** 2026-03-21
**Project:** shreehari-mart (NX Monorepo)
**Feature Scope:** Backend + Admin Dashboard + Web Storefront

---

## 1. Overview & Goals

### 1.1 Problem Statement

Categories in the Shreehari Mart platform are currently displayed in an undefined or alphabetically-determined order. Admins have no way to control how categories appear to customers on the storefront, limiting their ability to promote seasonal collections, highlight high-margin categories, or align the category display with marketing priorities.

### 1.2 Feature Summary

Add a persistent `sortOrder` integer field to the Category entity. This field will power:

1. A drag-and-drop reorder interface in the admin dashboard.
2. Consistent, custom-ordered category display in both the admin panel and the customer-facing web storefront.

### 1.3 Goals

- Allow admins to set and persist a custom display order for categories via drag-and-drop.
- Ensure the storefront always renders categories in the admin-defined order without additional client-side logic.
- Keep the implementation backward-compatible: existing categories receive a default sort order backfilled by migration.
- New categories are inserted at the top of the list (sortOrder = 0), prompting admins to reorder if desired.

### 1.4 Non-Goals (Out of Scope)

See Section 7 for the complete out-of-scope list.

---

## 2. User Stories

### 2.1 Admin User

| ID | Story | Priority |
|----|-------|----------|
| A-1 | As an admin, I want to drag categories up or down in a list so that I can define the order customers see them on the storefront. | High |
| A-2 | As an admin, I want my reordered list to persist after page refresh so that I do not have to redo the ordering each session. | High |
| A-3 | As an admin, I want newly created categories to appear at the top of the list by default so that I am immediately aware of them and can reposition them if needed. | Medium |
| A-4 | As an admin, I want the drag-and-drop interface to be disabled while a search or filter is active so that I do not accidentally corrupt the global sort order when viewing a filtered subset. | Medium |
| A-5 | As an admin, I want visual feedback while dragging (ghost element, drop indicator) so that I can confirm where a category will land before I release. | Medium |

### 2.2 Customer

| ID | Story | Priority |
|----|-------|----------|
| C-1 | As a customer browsing the storefront, I want categories to appear in a consistent, intentional order set by the store team so that featured or promoted categories are easy to find. | High |
| C-2 | As a customer using the category sidebar for filtering products, I want the sidebar categories to reflect the same order as the rest of the site so that the experience feels coherent. | Medium |

---

## 3. Functional Requirements

### 3.1 Backend (`apps/api` + `libs/data-access` + `libs/types`)

#### 3.1.1 Database — Category Entity

- **FR-BE-1:** Add a `sortOrder` column of type integer to the `categories` table with a default value of `0`.
- **FR-BE-2:** Create a TypeORM migration (`…AddCategorySortOrder.ts`) that:
  - Adds the `sortOrder` column to the existing table.
  - Backfills `sortOrder` for all existing category rows, assigning sequential integers ordered by category name (alphabetical), starting from `0`.

#### 3.1.2 Repository — CategoryRepository

- **FR-BE-3:** All queries that return a list of categories must include `ORDER BY sortOrder ASC` as the primary sort.
- **FR-BE-4:** When a new category is created, its `sortOrder` must be set to `0` and all existing categories' `sortOrder` values must be incremented by `1` within a single database transaction, keeping the new category at the top of the list.
- **FR-BE-5:** Add a `reorder(orderedIds: number[]): Promise<void>` method to `CategoryRepository` that:
  - Accepts a complete ordered array of all category IDs representing the desired new order.
  - Assigns `sortOrder` equal to the array index for each ID (index 0 = top).
  - Executes all updates within a single database transaction.
  - Throws a validation error if the provided ID list does not match the full set of category IDs in the database.

#### 3.1.3 API Route

- **FR-BE-6:** Add a `PATCH /categories/reorder` endpoint to `apps/api/src/app/routes/categories.routes.ts`.
  - **Request body:** `{ ids: number[] }` — the complete ordered list of all category IDs.
  - **Authentication:** Requires admin-level authorization (same guard as other write endpoints).
  - **Response (200):** `{ success: true }`.
  - **Response (400):** If the `ids` array is missing, empty, or does not represent all categories.
  - **Response (500):** If the database transaction fails.

#### 3.1.4 Shared Types (`libs/types`)

- **FR-BE-7:** Add `sortOrder: number` to the `CategoryDto` type so all API consumers receive this field.
- **FR-BE-8:** Add a new `ReorderCategoriesDto` type: `{ ids: number[] }`.

#### 3.1.5 Data-Access Exports (`libs/data-access`)

- **FR-BE-9:** Export the `reorder` method (or a `useReorderCategories` hook if the library exposes React Query wrappers) from `libs/data-access/src/index.ts`.

---

### 3.2 Admin Dashboard (`apps/admin`)

#### 3.2.1 Drag-and-Drop Category List

- **FR-AD-1:** Replace the existing `DataTable` component on `CategoriesPage.tsx` with a sortable list powered by `@dnd-kit/core` and `@dnd-kit/sortable`.
- **FR-AD-2:** Each list row must display the same information currently shown in the `DataTable` (name, product count, actions). Note: `slug` field was removed from scope — it does not exist on the Category entity.
- **FR-AD-3:** Each row must include a drag handle icon on its left edge, providing a clear affordance for reordering.
- **FR-AD-4:** During an active drag, the dragged item must render as a ghost/overlay using `DragOverlay` from `@dnd-kit/core`, preserving the row's visual appearance.
- **FR-AD-5:** A drop-indicator line or highlighted zone must appear between rows to show the prospective insertion position.
- **FR-AD-6:** On `dragEnd`, and only on `dragEnd` (not on intermediate `dragOver` events), the admin client must:
  1. Optimistically update the local category order in UI state.
  2. Call `PATCH /categories/reorder` with the new complete ordered ID list.
  3. On API error, revert the local state to the pre-drag order and surface an error notification to the admin.

#### 3.2.2 Interaction Constraints

- **FR-AD-7:** When a search term is entered or a filter is active in the `CategoriesPage`, drag-and-drop must be disabled. The drag handles must become visually inactive (e.g., reduced opacity, `not-allowed` cursor) and must not initiate a drag on pointer-down.
- **FR-AD-8:** A tooltip or inline message must inform the admin that reordering is unavailable while search/filter is active.

#### 3.2.3 Dependencies

- **FR-AD-9:** Add `@dnd-kit/core` and `@dnd-kit/sortable` to `apps/admin/package.json`. No other new dependencies are required for this feature.

---

### 3.3 Web Storefront (`apps/web`)

- **FR-WEB-1:** No code changes are required in `apps/web`. The storefront already fetches categories from the API and renders them in the order returned. Because the API now returns categories `ORDER BY sortOrder ASC`, the storefront automatically reflects the admin-defined order.
- **FR-WEB-2:** The `CategorySidebar` component similarly requires no changes; it benefits automatically from the sorted API response.

---

## 4. Non-Functional Requirements

### 4.1 Performance

- **NFR-P-1:** The `PATCH /categories/reorder` endpoint must complete within 500 ms for a catalog of up to 200 categories under normal load.
- **NFR-P-2:** The `reorder()` repository method must use a single bulk update statement or a minimal batch of statements within one transaction — individual per-row round-trips are not acceptable.
- **NFR-P-3:** Adding `ORDER BY sortOrder ASC` to the category list query must be supported by a database index on `sortOrder`. The migration should add this index.
- **NFR-P-4:** The drag-and-drop list in the admin must not cause layout thrash or frame drops during drag on a list of up to 200 items. Use CSS transforms (`translate3d`) for drag positioning, which `@dnd-kit` handles by default.

### 4.2 Reliability

- **NFR-R-1:** The reorder operation must be atomic. If any update in the batch fails, the entire transaction must roll back and the API must return a 500 error; no partial reorder should persist.
- **NFR-R-2:** The admin UI must implement optimistic updates with automatic rollback on API failure, ensuring the displayed order never diverges permanently from the persisted order.

### 4.3 Accessibility

- **NFR-A-1:** The drag-and-drop interface must support keyboard reordering. `@dnd-kit` provides built-in keyboard sensor support; it must be configured and not disabled.
- **NFR-A-2:** Keyboard reorder instructions (e.g., "Press Space to pick up, arrow keys to move, Space to drop") must be available via an `aria-describedby` or visually-hidden hint associated with the list.
- **NFR-A-3:** Drag handles must have an accessible label (`aria-label="Drag to reorder"` or equivalent).
- **NFR-A-4:** The disabled-DnD state (when search/filter is active) must be communicated to screen readers (e.g., `aria-disabled="true"` on the handle element).

### 4.4 Data Integrity

- **NFR-D-1:** The `PATCH /categories/reorder` endpoint must validate that the submitted `ids` array contains exactly the same set of IDs as all categories in the database. Mismatches must return 400.
- **NFR-D-2:** The migration's backfill must be idempotent — re-running it on a database that already has `sortOrder` populated must not overwrite existing values.

### 4.5 Backward Compatibility

- **NFR-BC-1:** The migration must be non-destructive. Existing category data must not be altered other than the addition of `sortOrder`.
- **NFR-BC-2:** Existing API consumers that do not use `sortOrder` must continue to function without modification; the field is additive.

---

## 5. Acceptance Criteria

### 5.1 Backend

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-BE-1 | Migration runs without error on a database containing existing categories and adds the `sortOrder` column. | Run `npm run migration:run`; confirm column exists via DB introspection. |
| AC-BE-2 | After migration, existing categories have sequential non-null `sortOrder` values ordered by name. | Query `SELECT name, sortOrder FROM categories ORDER BY sortOrder`; verify alphabetical backfill. |
| AC-BE-3 | `GET /categories` returns categories ordered by `sortOrder ASC`. | Verify response array order matches DB `sortOrder` column. |
| AC-BE-4 | Creating a new category sets its `sortOrder` to `0` and increments all other categories' `sortOrder` by 1. | Create a category; query DB; verify new category is first, others shifted. |
| AC-BE-5 | `PATCH /categories/reorder` with a valid complete ID array returns 200 and persists the new order. | Call endpoint; fetch category list; verify order matches submitted array. |
| AC-BE-6 | `PATCH /categories/reorder` with a partial or mismatched ID array returns 400. | Submit an incomplete `ids` array; confirm 400 response. |
| AC-BE-7 | `CategoryDto` includes a `sortOrder` field in all list and detail responses. | Inspect API response shape. |

### 5.2 Admin Dashboard

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-AD-1 | The categories page renders a reorderable list (not a data table) when no search/filter is active. | Visual inspection. |
| AC-AD-2 | Dragging a category row to a new position and releasing updates the displayed list order immediately (optimistic). | Manual drag-and-drop test. |
| AC-AD-3 | After a successful drag-and-drop, refreshing the page shows the same order. | Drag; refresh; verify persistence. |
| AC-AD-4 | On `PATCH /categories/reorder` API failure, the list reverts to its pre-drag order and an error message is shown. | Mock a 500 from the API; verify rollback and error notification. |
| AC-AD-5 | When a search term is typed, drag handles appear disabled and initiating a drag has no effect. | Type in search box; attempt drag; verify no reorder occurs. |
| AC-AD-6 | The disabled state is communicated accessibly (`aria-disabled="true"` on drag handles). | Inspect DOM attributes when search is active. |
| AC-AD-7 | The list is keyboard-navigable for reordering using Space + arrow keys. | Keyboard-only test: pick up item, move, drop; verify order changes and persists. |

### 5.3 Web Storefront

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-WEB-1 | After an admin reorders categories, the storefront category list reflects the new order without any code changes. | Reorder in admin; visit storefront; verify matching order. |
| AC-WEB-2 | The `CategorySidebar` also reflects the new order. | Reorder in admin; visit a product listing page; inspect sidebar order. |

---

## 6. Affected Files Reference

| File | Change Type | Purpose |
|------|-------------|---------|
| `libs/data-access/src/entities/Category.ts` | Modify | Add `sortOrder` integer column, default `0` |
| `libs/data-access/src/database/migrations/…AddCategorySortOrder.ts` | Create | Add column; backfill existing rows; add index |
| `libs/data-access/src/repositories/CategoryRepository.ts` | Modify | ORDER BY sortOrder; new-category shift logic; `reorder()` method |
| `libs/types/src/index.ts` | Modify | Add `sortOrder` to `CategoryDto`; add `ReorderCategoriesDto` |
| `apps/api/src/app/routes/categories.routes.ts` | Modify | Add `PATCH /categories/reorder` endpoint |
| `libs/data-access/src/index.ts` | Modify | Export `useReorderCategories` / reorder hook |
| `apps/admin/src/pages/CategoriesPage.tsx` | Modify | Replace DataTable with `@dnd-kit` sortable list |

---

## 7. Out of Scope

- **Sub-category ordering:** This feature applies only to top-level categories. Nested category hierarchies, if introduced in the future, will require a separate feature.
- **Per-user or per-session ordering:** The `sortOrder` is a single global order set by admins. There is no personalized category ordering for individual customers.
- **Automatic reordering rules:** No algorithmic sorting (by popularity, revenue, or recency). Order is always manually set by admins.
- **Bulk import/export of sort order:** CSV import or export of `sortOrder` values is not in scope.
- **Category ordering on mobile app:** The `order_delivery_manager_app` does not display storefront categories and is unaffected.
- **Undo/redo history:** The admin cannot undo a drag-and-drop action through a dedicated history mechanism; they must manually drag again.
- **Drag-and-drop on the storefront:** Customers cannot influence category order.
- **Storefront code changes:** No changes to `apps/web` are required or planned; the feature is delivered entirely through API response ordering.
