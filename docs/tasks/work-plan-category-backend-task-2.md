# Backend Task 2 — Repository + Service Layer

**Track:** Backend
**Depends on:** Task 1 (entity + types)
**Blocks:** Task 3, Task 4, Task 5

---

## Objective

Add all data-access layer code required to interact with the `categories` table and expose it to both the API layer and the admin frontend:

1. Create `CategoryRepository` with `findAll` (with `productCount`), `findById`, `findByName`, `create`, `update`, and `delete` methods.
2. Register `CategoryRepository` in `DatabaseService` via a new `getCategoryRepository()` method.
3. Export `CategoryRepository` and the new admin-layer hooks (`useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`) from the `libs/data-access` barrel.
4. Update `useProducts` to accept `categoryId` as a 6th optional argument.

---

## Files Changed

| File | Status |
|------|--------|
| `libs/data-access/src/repositories/CategoryRepository.ts` | New |
| `libs/data-access/src/services/DatabaseService.ts` | Modified |
| `libs/data-access/src/index.ts` | Modified |

---

## Implementation Steps

### Step 1 — `libs/data-access/src/repositories/CategoryRepository.ts` (new file)

Create the repository class. Full source is in `design-doc-category-backend.md` section 4. Summary of methods:

| Method | Signature | Notes |
|--------|-----------|-------|
| `findAll()` | `Promise<(Category & { productCount: number })[]>` | Uses `loadRelationCountAndMap` — one COUNT subquery, ordered by name ASC |
| `findById(id)` | `Promise<Category \| null>` | `findOne({ where: { id } })` |
| `findByName(name)` | `Promise<Category \| null>` | Used for uniqueness check on create |
| `create(data)` | `Promise<Category>` | `this.repository.create(data)` then `save` |
| `update(id, data)` | `Promise<Category \| null>` | `this.repository.update(id, data)` then `findById` |
| `delete(id)` | `Promise<boolean>` | Returns `result.affected! > 0` |

Constructor: `this.repository = AppDataSource.getRepository(Category)`.

---

### Step 2 — `libs/data-access/src/services/DatabaseService.ts`

**2a. Add import** at the top (after the existing repository imports):

```typescript
import { CategoryRepository } from '../repositories/CategoryRepository';
```

**2b. Add private field** in the class body, after `walletRepository`:

```typescript
private categoryRepository: CategoryRepository;
```

**2c. Instantiate in constructor** after `this.walletRepository = new WalletRepository()`:

```typescript
this.categoryRepository = new CategoryRepository();
```

**2d. Add public accessor method** after `getWalletRepository()`:

```typescript
public getCategoryRepository(): CategoryRepository {
  this.ensureConnection();
  return this.categoryRepository;
}
```

---

### Step 3 — `libs/data-access/src/index.ts`

#### 3a. Add entity type export

After the `MonthlyBill` export:

```typescript
export type { Category } from './entities/Category';
```

#### 3b. Add repository class export

After the `MonthlyBillRepository` export:

```typescript
export { CategoryRepository } from './repositories/CategoryRepository';
```

#### 3c. Add Category DTO imports to the `@shreehari/types` import block

Add `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` to the existing import from `@shreehari/types`.

#### 3d. Add `useCategories` and `useCategory` hooks

Following the exact `useState` + `useEffect` + `apiCall` pattern as `useProducts` and `useSocieties`. Add at the end of the hooks section:

```typescript
export const useCategories = () => {
  const [data, setData] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall<CategoryDto[]>('/categories');
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

export const useCategory = (id: string) => {
  const [data, setData] = useState<CategoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall<CategoryDto>(`/categories/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { data, loading, error };
};
```

#### 3e. Add `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` hooks

Follow the exact pattern of `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct` in the same file. Key differences:

- `useCreateCategory(data: CreateCategoryDto, imageFile?: File | null)` — POST to `/categories` as `multipart/form-data` when `imageFile` is present, otherwise JSON. FormData field name for the file: `'image'`.
- `useUpdateCategory(id: string, data: UpdateCategoryDto, imageFile?: File | null)` — PUT to `/categories/:id`.
- `useDeleteCategory()` — returns `{ deleteCategory(id: string): Promise<void>, loading: boolean }`. DELETE to `/categories/:id`.

Each returns `{ loading: boolean }` and the action function. See `design-doc-category-frontend.md` section 4 for the full data-access hook context.

#### 3f. Update `useProducts` to accept `categoryId`

The existing hook signature (approximate):

```typescript
export const useProducts = (
  page?: number,
  limit?: number,
  search?: string,
  unit?: string,
  isAvailable?: boolean
)
```

Add `categoryId?: string` as the 6th optional argument. When provided, append `?categoryId=<value>` to the `URLSearchParams` (or fetch URL). The hook already builds a query string — add `if (categoryId) params.append('categoryId', categoryId)`.

---

## Acceptance Criteria

1. `CategoryRepository` is instantiable: `new CategoryRepository()` does not throw when `AppDataSource` is initialized.
2. `DatabaseService.getInstance().getCategoryRepository()` returns a `CategoryRepository` instance.
3. `useCategories()` can be called in an admin React component and returns `{ data: CategoryDto[], loading, error, refetch }`.
4. `useCategory(id)` fires only when `id` is truthy; returns `{ data: CategoryDto | null, loading, error }`.
5. `useCreateCategory(data, imageFile)` posts `multipart/form-data` when `imageFile` is set; posts JSON otherwise. File field name is `'image'`.
6. `useUpdateCategory(id, data, imageFile)` puts the correct payload.
7. `useDeleteCategory()` returns `{ deleteCategory, loading }`.
8. `useProducts` called with a 6th `categoryId` argument appends `categoryId` to the API query string.
9. All new exports are importable from `@shreehari/data-access` without TypeScript errors.
10. `tsc --noEmit` passes for `libs/data-access`.

---

## Dependencies

- **Task 1** must be complete: `Category` entity exists, `CategoryDto`/`CreateCategoryDto`/`UpdateCategoryDto` are in `@shreehari/types`.
