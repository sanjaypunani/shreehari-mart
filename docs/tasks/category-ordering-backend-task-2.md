# Task: Category Ordering — API + Shared Types (Backend)

## Objective

Expose the data layer work from Phase 1 through the HTTP API and shared type system. After this task, any API consumer (storefront, admin, external client) receives `sortOrder` on every category object and can call `PATCH /api/categories/reorder` to persist a new order.

## Target Files

- `libs/types/src/index.ts` — modify — add `sortOrder: number` to `CategoryDto`; update `imageUrl` to `string | null`; add `ReorderCategoriesDto` interface
- `apps/api/src/app/routes/categories.routes.ts` — modify — add `PATCH /reorder` handler before all `/:id` routes; import `ReorderValidationError`
- `libs/data-access/src/index.ts` — modify — export `ReorderValidationError`; add `ReorderCategoriesDto` to the types import block; add `useReorderCategories` hook after `useDeleteCategory`

## Implementation Steps

1. **Update `CategoryDto` in `libs/types/src/index.ts`**

   In the `// Category DTOs` section (around line 274), make two changes to the existing `CategoryDto` interface:

   - Add `sortOrder: number;` (non-optional) after `productCount?: number;`:
   - Update `imageUrl?: string;` to `imageUrl?: string | null;` to accurately reflect the nullable DB column that TypeORM returns as `null` (not `undefined`) when no value is set.

   Resulting interface:

   ```typescript
   export interface CategoryDto {
     id: string;
     name: string;
     imageUrl?: string | null;   // updated — null reflects the nullable column
     productCount?: number;
     sortOrder: number;           // new — non-optional, backfilled on all rows
     createdAt: string;
     updatedAt: string;
   }
   ```

2. **Add `ReorderCategoriesDto` to `libs/types/src/index.ts`**

   Add the following interface immediately after `UpdateCategoryDto` in the same Category DTOs section:

   ```typescript
   export interface ReorderCategoriesDto {
     ids: string[];
   }
   ```

   Note: `ids` is typed as `string[]` (UUIDs), not `number[]`. The PRD specifies `number[]` but the `Category.id` column is a UUID string — use `string[]` to match the actual entity.

3. **Add `PATCH /reorder` route to `apps/api/src/app/routes/categories.routes.ts`**

   Register the handler **before** any `router.get('/:id', ...)` or other `/:id` routes in the file. This prevents Express from matching the literal string `"reorder"` as an `:id` parameter.

   Add the UUID validation regex constant near the top of the route file (or above the handler):

   ```typescript
   const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
   ```

   Full handler:

   ```typescript
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

       // Validate: every element must be a valid UUID string
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

   Add this import to the route file:

   ```typescript
   import { ReorderValidationError } from '@shreehari/data-access';
   ```

4. **Export `ReorderValidationError` from `libs/data-access/src/index.ts`**

   Add to the repository re-exports block:

   ```typescript
   export { ReorderValidationError } from './repositories/CategoryRepository';
   ```

5. **Add `ReorderCategoriesDto` to the types import block in `libs/data-access/src/index.ts`**

   Find the existing import block from `@shreehari/types` (currently around lines 46–76) and add `ReorderCategoriesDto` alongside the other category type imports:

   ```typescript
   import {
     // ... existing imports ...
     CategoryDto,
     CreateCategoryDto,
     UpdateCategoryDto,
     ReorderCategoriesDto,   // NEW
   } from '@shreehari/types';
   ```

6. **Add `useReorderCategories` hook to `libs/data-access/src/index.ts`**

   Add this hook after `useDeleteCategory` at the end of the Category API hooks section. The hook follows the same `useState` + native `fetch` pattern used by all other mutation hooks in this file (`useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`). Do not use React Query's `useMutation`.

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

   Uses `fetch` directly (not the internal `apiCall` helper) because the hook needs to read the `message` field from 400 error response bodies. The error is re-thrown so that `SortableCategoryList`'s `onDragEnd` handler can catch it and trigger `localOrder` rollback.

## Reference Documents

- Design Doc: `shreehari-mart/docs/design/category-ordering-backend-design.md` (Sections 4, 5)

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-BE-5 | `PATCH /categories/reorder` with a valid complete UUID array returns `200 { success: true }` and the new order persists after a subsequent `GET /categories` |
| AC-BE-6 | `PATCH /categories/reorder` with a partial, mismatched, or empty array returns `400` |
| AC-BE-7 | `CategoryDto` includes `sortOrder: number` in all list and detail responses |
| NFR-D-1 | Endpoint rejects arrays that do not exactly match all categories in the database |
| NFR-P-1 | Endpoint completes within 500 ms for up to 200 categories |
| NFR-BC-2 | Existing consumers that ignore `sortOrder` continue to function without modification |

**Integration tests to pass** (test skeleton in `apps/api/src/app/routes/categories.reorder.int.test.ts`):

- `PATCH /api/categories/reorder` suite: all 7 test cases (happy path, new-category insertion, 4 validation error cases, atomicity rollback).
- `GET /api/categories — sortOrder field` suite: both test cases (field presence, sort order correctness).

## Dependencies

- `category-ordering-backend-task-1` must be complete — the entity `sortOrder` column and the `reorder()` repository method must exist before this task can be implemented.
