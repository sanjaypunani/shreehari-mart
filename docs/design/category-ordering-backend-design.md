# Backend Design Doc: Category Custom Sort Order

**Status:** Draft
**Date:** 2026-03-21
**PRD Reference:** `shreehari-mart/docs/prd/category-ordering-prd.md`
**Feature Scope:** `libs/data-access` · `libs/types` · `apps/api`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Data Layer](#2-data-layer)
3. [Repository Layer](#3-repository-layer)
4. [API Layer](#4-api-layer)
5. [Shared Types](#5-shared-types)
6. [Integration Points (Frontend API Contract)](#6-integration-points-frontend-api-contract)
7. [Migration Strategy](#7-migration-strategy)
8. [Affected Files Summary](#8-affected-files-summary)

---

## 1. Overview

The feature adds a persistent `sortOrder` integer column to the `categories` table. All category list queries will order by `sortOrder ASC` (name as tiebreaker). A new `PATCH /categories/reorder` endpoint allows admins to submit a complete ordered list of category IDs; the repository assigns each ID its array index as the new `sortOrder` within a single atomic transaction.

New categories are always inserted at `sortOrder = 0`, with all existing categories shifted up by 1 inside the same transaction, keeping newly created categories at the top of the list.

### Key Constraints (from PRD)

- `reorder()` must use a **single database transaction**; partial updates must not persist.
- `PATCH /categories/reorder` must validate that the submitted ID set **exactly matches** all categories in the database (no additions, no omissions).
- The migration backfill must be **idempotent** — safe to re-run against a database that already has `sortOrder` populated.
- `sortOrder` index is required for query performance (NFR-P-3).

---

## 2. Data Layer

### 2.1 Entity Change — `libs/data-access/src/entities/Category.ts`

Add a single new column and import `Index` (already imported) along with the new `@Column` decorator entry.

**Current entity columns:** `id`, `name` (unique-indexed), `imageUrl`, `createdAt`, `updatedAt`, `products` (relation).

**New column to add:**

```typescript
@Index()
@Column({ type: 'int', default: 0 })
sortOrder!: number;
```

Place this column after `imageUrl` and before `createdAt`. No other entity fields change.

**Full updated entity shape (for reference):**

| Column      | Type        | Nullable | Default          | Index              |
|-------------|-------------|----------|------------------|--------------------|
| id          | uuid (PK)   | no       | gen_random_uuid()| implicit PK        |
| name        | varchar(100)| no       | —                | UNIQUE             |
| imageUrl    | varchar(500)| yes      | NULL             | —                  |
| sortOrder   | integer     | no       | 0                | IDX_categories_sortOrder |
| createdAt   | timestamp   | no       | now()            | —                  |
| updatedAt   | timestamp   | no       | now()            | —                  |

### 2.2 Index Considerations

A B-tree index on `categories.sortOrder` is required per NFR-P-3. Because the admin-defined list is always fetched in full (no pagination filter on `sortOrder`), the index primarily accelerates the `ORDER BY sortOrder ASC` sort and any future range queries.

Index name: `IDX_categories_sortOrder`

**Fix 6 note:** Add `@Index()` to the `sortOrder` column in the entity decorator, consistent with how `@Index({ unique: true })` is already used on the `name` column in the same entity. The migration also creates the index via raw SQL (`IDX_categories_sortOrder`) for explicit control and to match the migration-driven schema management pattern already in use across this codebase.

---

## 3. Repository Layer

File: `libs/data-access/src/repositories/CategoryRepository.ts`

### 3.1 Updated `findAll()`

**Current behavior:** Orders by `category.name ASC`.

**New behavior:** Primary sort `sortOrder ASC`, secondary tiebreaker `name ASC`. The change is a one-line diff in the `orderBy` / `addOrderBy` chain.

```typescript
async findAll(): Promise<(Category & { productCount: number })[]> {
  const rows = await this.repository
    .createQueryBuilder('category')
    .loadRelationCountAndMap('category.productCount', 'category.products')
    .orderBy('category.sortOrder', 'ASC')
    .addOrderBy('category.name', 'ASC')
    .getMany();

  return rows as (Category & { productCount: number })[];
}
```

No other `findAll` callers require changes; `apps/web` and `apps/admin` both consume the API response and will automatically receive the new ordering.

### 3.2 Updated `create()` — New-Category Insertion Logic

**Current behavior:** Inserts the category row; `sortOrder` defaults to `0` from the column default.

**New behavior:** Wrap in a transaction that (1) increments every existing category's `sortOrder` by 1, then (2) inserts the new category with `sortOrder = 0`.

```typescript
async create(
  data: Pick<Category, 'name'> & { imageUrl?: string }
): Promise<Category> {
  return AppDataSource.transaction(async (manager) => {
    // Shift all existing rows up by 1
    await manager
      .createQueryBuilder()
      .update(Category)
      .set({ sortOrder: () => '"sortOrder" + 1' })
      .execute();

    // Insert new category at position 0
    const category = manager.create(Category, { ...data, sortOrder: 0 });
    return manager.save(Category, category);
  });
}
```

**Why a raw expression for the increment:** Using `sortOrder: () => '"sortOrder" + 1'` issues a single `UPDATE categories SET "sortOrder" = "sortOrder" + 1` statement, avoiding N round-trips (NFR-P-2). This is the TypeORM pattern for computed column updates.

**Known characteristic — unbounded sortOrder growth:** The shift-all-rows-on-insert approach (`UPDATE SET sortOrder = sortOrder + 1` with no WHERE clause) causes `sortOrder` values to grow without bound over time. For the categories table, which is expected to remain small (<200 rows), this is acceptable — the ordering semantics are fully preserved regardless of the absolute values. If category count grows significantly, a periodic gap-compaction step (reassigning contiguous `0, 1, 2, …` values) would be needed.

If inserting at the top of the list is not a firm requirement, an alternative is to insert new categories at `MAX(sortOrder) + 1` (bottom of the list), which avoids the full-table update entirely — the admin can then drag to reorder. The current design keeps the insert-at-top behaviour as specified by the PRD.

### 3.3 New `reorder()` Method

The previous draft used string interpolation to build a CASE expression, which introduced a SQL injection vulnerability. This design uses two layers of defence:

1. **Route handler validation (first layer):** Every ID is validated against a strict UUID regex (`/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`) before the array reaches the repository. Non-UUID values result in an immediate `400` response.

2. **Parameterized query in repository (second layer):** The CASE expression is built using positional `$1, $2, …` parameters via `manager.query()`, so no user-supplied value is ever interpolated as raw SQL.

**Repository implementation:**

```typescript
async reorder(orderedIds: string[]): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    // Guard: no duplicate IDs
    if (new Set(orderedIds).size !== orderedIds.length) {
      throw new ReorderValidationError('The provided ID list contains duplicate entries.');
    }

    // Fetch all current category IDs for validation
    const existing = await manager
      .createQueryBuilder(Category, 'category')
      .select('category.id')
      .getMany();

    const existingIdSet = new Set(existing.map((c) => c.id));

    // Validate: submitted list must contain exactly the same IDs
    if (
      orderedIds.length !== existingIdSet.size ||
      !orderedIds.every((id) => existingIdSet.has(id))
    ) {
      throw new ReorderValidationError(
        'The provided ID list does not match the complete set of categories.'
      );
    }

    // Bulk-assign sortOrder = array index using a single parameterized CASE statement.
    // Parameters: alternating id / index pairs, then the ids again for the WHERE clause.
    // e.g. CASE WHEN id = $1 THEN $2 WHEN id = $3 THEN $4 ... END WHERE id IN ($1, $3, ...)
    const caseParts: string[] = [];
    const params: (string | number)[] = [];

    orderedIds.forEach((id, index) => {
      const p1 = params.length + 1; // parameter index for id
      const p2 = params.length + 2; // parameter index for sortOrder value
      caseParts.push(`WHEN id = $${p1} THEN $${p2}`);
      params.push(id, index);
    });

    // Build IN-list parameters for the WHERE clause (reuse id params: $1, $3, $5, ...)
    const inParams = orderedIds.map((_, i) => `$${i * 2 + 1}`).join(', ');

    await manager.query(
      `UPDATE categories SET "sortOrder" = CASE ${caseParts.join(' ')} ELSE "sortOrder" END WHERE id IN (${inParams})`,
      params
    );
  });
}
```

**Design notes:**

- Every `$N` placeholder is a bound parameter — no user-supplied content is ever concatenated as raw SQL text.
- The CASE expression is a single `UPDATE` statement covering all rows in one round-trip, satisfying NFR-P-2.
- The transaction wraps both the validation read and the update write. If the update fails for any reason, the transaction rolls back completely (NFR-R-1).
- `ReorderValidationError` is a custom error class (see Section 3.4) that the route handler uses to distinguish a 400 scenario from a 500.
- The method signature uses `string[]` for IDs because the `Category.id` column is `uuid` (string), matching the PRD's intent. The PRD mentions `number[]` but the actual entity uses UUID strings — this design uses `string[]` to match the real schema.

### 3.4 `ReorderValidationError` — Custom Error Class

Add to `CategoryRepository.ts` (or a shared `errors.ts` file in the repository layer):

```typescript
export class ReorderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReorderValidationError';
  }
}
```

The route handler imports this class to produce a `400` response vs. a generic `500`.

### 3.5 `delete()` — No Change Required

Deleting a category leaves a gap in `sortOrder` values. This is acceptable: the `ORDER BY sortOrder ASC` ordering remains stable and correct even with non-contiguous values. Gap compaction is out of scope per PRD Section 7.

---

## 4. API Layer

File: `apps/api/src/app/routes/categories.routes.ts`

### 4.1 New Endpoint — `PATCH /categories/reorder`

**Route registration:** The router is already mounted at `/api/categories` in `server.ts` (`app.use('/api/categories', categoriesRouter)`). No changes to `server.ts` are required.

**Critical ordering note:** The `PATCH /categories/reorder` route handler must be registered **before** the `router.get('/:id', ...)` route (and any other `/:id` routes) in the file to prevent Express from matching the literal string `"reorder"` as an `:id` parameter.

```typescript
// UUID validation regex — enforced before IDs reach the repository (SQL injection defence layer 1)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// PATCH /api/categories/reorder
router.patch('/reorder', async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate: ids must be a non-empty array
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain a non-empty "ids" array.',
      });
    }

    // Validate: every element must be a valid UUID string (defence layer 1 against SQL injection)
    if (!ids.every((id) => typeof id === 'string' && UUID_REGEX.test(id))) {
      return res.status(400).json({
        success: false,
        message: 'All elements of "ids" must be valid UUID strings.',
      });
    }

    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    await categoryRepo.reorder(ids);

    res.json({ success: true });
  } catch (error) {
    if (error instanceof ReorderValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error reordering categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
```

**Import required in the route file:**

```typescript
import { ReorderValidationError } from '@shreehari/data-access';
```

### 4.2 Authentication & Authorization

**SECURITY GAP:** This endpoint has no authentication, consistent with existing write routes. This means any unauthenticated caller can reorder categories. This is a known gap tracked as a future task alongside applying `authenticateRequest` to all category write endpoints.

The current `categories.routes.ts` has **no authentication middleware** applied to any route. Write operations (POST, PUT, DELETE) are unprotected in the existing codebase. The `PATCH /categories/reorder` endpoint follows the same pattern — no auth guard — to maintain consistency with the existing implementation until a broader auth middleware rollout is done.

**Note for future work:** When the team applies auth middleware to write routes, `PATCH /categories/reorder` should be guarded with the same admin-only token check used by other write endpoints (`authenticateRequest` from `auth.routes.ts`).

### 4.3 Full Endpoint Spec

| Property              | Value |
|-----------------------|-------|
| Method                | `PATCH` |
| Path                  | `/api/categories/reorder` |
| Content-Type          | `application/json` |
| Authentication        | None (consistent with existing write routes — see security gap note above) |
| Request body          | `{ "ids": ["<uuid>", "<uuid>", ...] }` |
| Success response      | `200 { "success": true }` |
| Validation error      | `400 { "success": false, "message": "<reason>" }` |
| Server/DB error       | `500 { "success": false, "message": "...", "error": "..." }` |

---

## 5. Shared Types

File: `libs/types/src/index.ts`

### 5.1 `CategoryDto` — Add `sortOrder`

```typescript
// Before
export interface CategoryDto {
  id: string;
  name: string;
  imageUrl?: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// After
export interface CategoryDto {
  id: string;
  name: string;
  imageUrl?: string | null;  // string | null to match nullable column returned by TypeORM
  productCount?: number;
  sortOrder: number;          // <-- new field
  createdAt: string;
  updatedAt: string;
}
```

`sortOrder` is non-optional because every category row will have the column populated (migration backfills all existing rows; new rows default to 0).

**Note on `imageUrl` typing:** `imageUrl` is typed as `string | null` (not just `string | undefined`) to accurately reflect the nullable column returned by TypeORM. Using `string | undefined` would misrepresent the actual value — TypeORM returns `null` for nullable columns with no value set, not `undefined`.

### 5.2 New `ReorderCategoriesDto`

Add after `UpdateCategoryDto`:

```typescript
export interface ReorderCategoriesDto {
  ids: string[];
}
```

Note: The PRD specifies `ids: number[]` but the `Category.id` is a UUID (`string`). This design uses `string[]` to match the actual entity. The frontend hook and API call should both use `string[]`.

### 5.3 `libs/data-access/src/index.ts` — New Exports

**Boundary note:** The existing codebase already co-locates React hooks and server-side repository code in `libs/data-access/src/index.ts`. In the current NX config, the API project's `tsconfig` excludes files that import `react`, so this boundary is managed at the build level. `useReorderCategories` follows the same co-location pattern as `useCreateCategory`, `useUpdateCategory`, etc. Confirm NX project boundary config before implementation.

**Note: This hook uses the same `useState` + native `fetch` pattern as all other mutation hooks in `libs/data-access/src/index.ts` (useCreateCategory, useUpdateCategory, useDeleteCategory, etc.). The project does NOT use React Query's `useMutation` for these hooks — this is the established codebase pattern.**

Two new exports are required:

1. Export `ReorderValidationError` so that the route handler can import it:

```typescript
export { ReorderValidationError } from './repositories/CategoryRepository';
```

2. Export the new `useReorderCategories` React hook (data-access layer pattern used by admin):

```typescript
export const useReorderCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderCategories = async (
    dto: ReorderCategoriesDto
  ): Promise<void> => {
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
        throw new Error(body.message || 'Failed to reorder categories');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder categories';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { reorderCategories, loading, error };
};
```

Also add `ReorderCategoriesDto` to the existing import block from `@shreehari/types` in `index.ts`.

---

## 6. Integration Points (Frontend API Contract)

This section is the authoritative contract that the frontend design and implementation must consume.

### 6.1 `GET /api/categories`

No request changes. The response now includes `sortOrder` on every category object and the array is ordered by `sortOrder ASC, name ASC`.

**Response shape:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Vegetables",
      "imageUrl": "/uploads/categories/vegetables.jpg",
      "productCount": 42,
      "sortOrder": 0,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2026-03-21T08:00:00.000Z"
    },
    {
      "id": "661e9511-f30c-52e5-b827-557766551111",
      "name": "Fruits",
      "imageUrl": null,
      "productCount": 18,
      "sortOrder": 1,
      "createdAt": "2025-02-01T09:00:00.000Z",
      "updatedAt": "2026-03-21T08:00:00.000Z"
    }
  ]
}
```

**Frontend usage:** The admin list component should use `sortOrder` as the initial render order (it will already be sorted by the API). The frontend should preserve the array order from the API response as the source of truth for the displayed list.

### 6.2 `PATCH /api/categories/reorder`

**When to call:** After a completed drag-and-drop event (`onDragEnd`), once the frontend has computed the new full order.

**Request:**

```
PATCH /api/categories/reorder
Content-Type: application/json

{
  "ids": [
    "661e9511-f30c-52e5-b827-557766551111",
    "550e8400-e29b-41d4-a716-446655440000",
    "772fa622-a41d-63f6-c938-668877662222"
  ]
}
```

- `ids` must be the **complete ordered array of all category UUIDs** — not a subset, not a delta.
- Array index 0 = top of list (lowest `sortOrder`).
- All currently existing category IDs must be present; omitting any ID will result in a `400`.

**Success response (200):**

```json
{ "success": true }
```

**Validation error response (400):**

```json
{
  "success": false,
  "message": "The provided ID list does not match the complete set of categories."
}
```

Also returned when `ids` is missing or empty:

```json
{
  "success": false,
  "message": "Request body must contain a non-empty \"ids\" array."
}
```

**Server error response (500):**

```json
{
  "success": false,
  "message": "Failed to reorder categories",
  "error": "<db error message>"
}
```

**Frontend optimistic update pattern:**
1. On `dragEnd`: snapshot the current order as `previousOrder`.
2. Optimistically update local state to the new order.
3. Call `PATCH /api/categories/reorder` with the new full `ids` array.
4. On success: do nothing (state is already updated).
5. On error (400 or 500): revert local state to `previousOrder` and display an error notification.

**Hook to use:** `useReorderCategories()` exported from `@shreehari/data-access`.

```typescript
const { reorderCategories, loading, error } = useReorderCategories();

// On drag end:
await reorderCategories({ ids: newOrderedIds });
```

### 6.3 `POST /api/categories` — Behavior Change (No Request Change)

Creating a new category continues to use the same request shape. The behavior change is invisible to the API consumer: the new category will appear **first** (`sortOrder = 0`) in subsequent `GET /api/categories` responses.

---

## 7. Migration Strategy

### 7.1 Migration File

**Location:** `libs/data-access/src/database/migrations/`

**Filename timestamp:** Use `Date.now()` at file creation time for the migration filename timestamp, not a pre-chosen value. Example: `npx typeorm migration:generate` auto-generates the correct timestamp. The filename below uses a placeholder timestamp — replace it with the actual value when generating the file.

**Filename convention (matching existing files):**
`<timestamp>-AddCategorySortOrder.ts`

**Class name:** `AddCategorySortOrder<timestamp>`

### 7.2 `up()` — Step-by-Step

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  const categoriesTable = await queryRunner.getTable('categories');

  // Step 1: Add sortOrder column (idempotent guard)
  const hasSortOrderColumn = categoriesTable?.findColumnByName('sortOrder');
  if (!hasSortOrderColumn) {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'sortOrder',
        type: 'int',
        isNullable: false,
        default: 0,
      })
    );
  }

  // Step 2: Backfill existing rows ordered by name ASC.
  // TypeORM's migrations table prevents re-execution; no data-based guard needed.
  // The UPDATE is unconditional — if the migration has already run, TypeORM will
  // not call up() again, so this is safe.
  await queryRunner.query(`
    UPDATE categories
    SET "sortOrder" = sub.row_num
    FROM (
      SELECT id,
             ROW_NUMBER() OVER (ORDER BY name ASC) - 1 AS row_num
      FROM categories
    ) sub
    WHERE categories.id = sub.id
  `);

  // Step 3: Add index on sortOrder (idempotent guard)
  const refreshedTable = await queryRunner.getTable('categories');
  const hasSortOrderIndex = refreshedTable?.indices.some(
    (idx) =>
      idx.columnNames.length === 1 && idx.columnNames[0] === 'sortOrder'
  );

  if (!hasSortOrderIndex) {
    await queryRunner.createIndex(
      'categories',
      new TableIndex({
        name: 'IDX_categories_sortOrder',
        columnNames: ['sortOrder'],
      })
    );
  }
}
```

**Idempotency guarantee (NFR-D-2):**

- `hasSortOrderColumn` guard prevents `addColumn` from failing if the column already exists.
- The backfill `UPDATE` is unconditional. TypeORM's migrations table (`typeorm_migrations`) tracks which migrations have already executed and will never call `up()` again for a recorded migration — making a data-based idempotency guard both redundant and potentially incorrect (the previous `WHERE sortOrder = 0 AND COUNT(non-zero) = 0` pattern would silently skip the backfill on a freshly populated table that happened to have all-zero `sortOrder` values).
- `hasSortOrderIndex` guard prevents duplicate index creation.

**Backfill logic:** `ROW_NUMBER() OVER (ORDER BY name ASC) - 1` assigns sequential integers starting from 0, ordered alphabetically by category name, satisfying AC-BE-2.

### 7.3 `down()` — Rollback

```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  // 1. Drop index
  const categoriesTable = await queryRunner.getTable('categories');
  const sortOrderIndex = categoriesTable?.indices.find(
    (idx) =>
      idx.columnNames.length === 1 && idx.columnNames[0] === 'sortOrder'
  );
  if (sortOrderIndex) {
    await queryRunner.dropIndex('categories', sortOrderIndex);
  }

  // 2. Drop column
  const hasSortOrderColumn = categoriesTable?.findColumnByName('sortOrder');
  if (hasSortOrderColumn) {
    await queryRunner.dropColumn('categories', 'sortOrder');
  }
}
```

Rollback is non-destructive to existing data — only the `sortOrder` column and its index are removed. All other category data is preserved (NFR-BC-1).

### 7.4 Running the Migration

```bash
# From shreehari-mart/
npm run migration:run
```

The migration-config uses the canonical `data-source.ts` at the monorepo root, which auto-discovers migration files matching the glob pattern in `libs/data-access/src/database/migrations/`.

---

## 8. Affected Files Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `libs/data-access/src/entities/Category.ts` | Modify | Add `sortOrder: number` column with `default: 0` and `@Index()` decorator |
| `libs/data-access/src/database/migrations/<timestamp>-AddCategorySortOrder.ts` | Create | Add column, backfill by name (unconditional UPDATE), add index; idempotent `up()` and `down()` |
| `libs/data-access/src/repositories/CategoryRepository.ts` | Modify | `findAll()` order change; `create()` wrapped in transaction with shift; new `reorder()` method using parameterized queries; new `ReorderValidationError` class |
| `libs/types/src/index.ts` | Modify | Add `sortOrder: number` to `CategoryDto`; update `imageUrl` to `string \| null`; add `ReorderCategoriesDto` interface |
| `libs/data-access/src/index.ts` | Modify | Export `ReorderValidationError`; add `useReorderCategories` hook; add `ReorderCategoriesDto` to type imports |
| `apps/api/src/app/routes/categories.routes.ts` | Modify | Add `PATCH /reorder` handler with UUID regex validation (placed before `/:id` routes); import `ReorderValidationError` |

No changes are required to `apps/web`, `apps/admin` (except consuming the new hook/endpoint — covered in the frontend design doc), or `apps/web-e2e` (E2E tests are a separate concern).
