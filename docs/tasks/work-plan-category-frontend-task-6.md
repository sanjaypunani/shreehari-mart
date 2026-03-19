# Frontend Task 6 — Web Dynamic Categories

**Track:** Web Frontend
**Depends on:** Task 3 (API routes live)
**Blocks:** Task 7

---

## Objective

Replace all static/mock category data in the web app with live API data, and wire category-filtered product fetching:

1. Add `queryKeys.categories` to the TanStack Query key factory.
2. Add `categoriesApi` service (`getAll`, `getById`) to the axios service layer.
3. Extend `productsApi.getAll` type to accept `categoryId`.
4. Add `useCategories` and `useCategory` TanStack Query hooks; update `useProducts` to accept `categoryId`.
5. Replace the hardcoded `categories` array in `root.tsx` with live data + skeleton loading state.
6. Remove `MOCK_CATEGORIES` from `CategoryDetail.tsx`, connect to real API, add `categoryId` filter to product fetch, wire sidebar navigation to URL, and attach `IconSearch` to the search dialog.

---

## Files Changed

| File | Status |
|------|--------|
| `apps/web/src/lib/query-client.ts` | Modified |
| `apps/web/src/lib/api/services.ts` | Modified |
| `apps/web/src/hooks/use-api.ts` | Modified |
| `apps/web/src/app/components/root.tsx` | Modified |
| `apps/web/src/components/category/CategoryDetail.tsx` | Modified |

---

## Implementation Steps

### Step 1 — `apps/web/src/lib/query-client.ts`

Add a `categories` key factory inside the `queryKeys` object, after the `buildings` block:

```typescript
categories: {
  all: ['categories'] as const,
  lists: () => [...queryKeys.categories.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...queryKeys.categories.lists(), filters] as const,
  details: () => [...queryKeys.categories.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.categories.details(), id] as const,
},
```

Note: `useCategories` uses `queryKeys.categories.lists()` (no params — always fetches all). `useCategory(id)` uses `queryKeys.categories.detail(id)`.

---

### Step 2 — `apps/web/src/lib/api/services.ts`

#### 2a. Add `categoriesApi` after the `productsApi` block

```typescript
export const categoriesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/categories/${id}`);
    return response.data;
  },
};
```

Use `ApiResponse<any[]>` (NOT `PaginatedResponse`) — `GET /api/categories` returns a flat array, not paginated. This matches the `societiesApi.getAll()` pattern.

#### 2b. Extend `productsApi.getAll` type

Update the `params` parameter type to include `categoryId`:

```typescript
getAll: async (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean; categoryId?: string }
) => { ... }
```

Axios serializes the `params` object as query string automatically, so `categoryId` will appear as `?categoryId=<uuid>` when provided.

---

### Step 3 — `apps/web/src/hooks/use-api.ts`

#### 3a. Add `categoriesApi` to the existing import from `'../lib/api/services'`

#### 3b. Update `useProducts` params type

```typescript
export const useProducts = (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean; categoryId?: string },
  options?: QueryHookOptions<PaginatedResponse<any>>
) => { ... }
```

#### 3c. Add `useCategories` hook

Add after the `useToggleProductAvailability` hook, before the Orders section:

```typescript
export const useCategories = (
  options?: QueryHookOptions<ApiResponse<any[]>>
) => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoriesApi.getAll(),
    ...options,
  });
};
```

Return type via TanStack Query: `UseQueryResult<ApiResponse<any[]>>`. Callers access the array via `data?.data ?? []`.

#### 3d. Add `useCategory` hook

```typescript
export const useCategory = (
  id: string,
  options?: QueryHookOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
    ...options,
  });
};
```

`enabled: !!id` prevents the query from firing when `id` is empty or undefined.

---

### Step 4 — `apps/web/src/app/components/root.tsx`

#### 4a. Remove static array

Delete the entire `const categories = [...]` block (the array of ~8 hardcoded objects with Swiggy CDN image URLs).

#### 4b. Add import

```typescript
import { useCategories } from '../../hooks/use-api';
import { Skeleton, SimpleGrid, Box } from '@mantine/core';
```

Also ensure `colors`, `spacing`, `typography` are accessible (import from `'../../theme'` if not already imported).

#### 4c. Add hook call inside `HomeRoot`

After `const addItem = useCartStore(...)`:

```typescript
const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

const categories = (categoriesResponse?.data ?? []).map((cat: any) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));
```

`toApiAssetUrl` already handles `null`/`undefined` — no null check needed.

#### 4d. Replace `<CategoryGrid>` with conditional block

```tsx
{categoriesLoading ? (
  <Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
    <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
      style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
      Grocery & Kitchen
    </Text>
    <SimpleGrid cols={{ base: 4, xs: 4, sm: 6, md: 8, lg: 10 }} spacing={spacing.xs}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={80} radius="sm" />
      ))}
    </SimpleGrid>
  </Box>
) : categories.length === 0 ? (
  <Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
    <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
      style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
      Grocery & Kitchen
    </Text>
    <Text variant="secondary" size="sm">No categories available yet.</Text>
  </Box>
) : (
  <CategoryGrid
    title="Grocery & Kitchen"
    categories={categories}
    onCategoryClick={handleCategoryClick}
  />
)}
```

`handleCategoryClick` is unchanged — it already calls `router.push('/category/${categoryId}')`. After this change, `categoryId` will be a real UUID.

---

### Step 5 — `apps/web/src/components/category/CategoryDetail.tsx`

#### 5a. Remove mock data

Delete the entire `MOCK_CATEGORIES` array and the line that derives `categoryName` from it via `.find(...)`.

#### 5b. Add imports

```typescript
import { useDisclosure } from '@mantine/hooks';
import { Skeleton, SimpleGrid } from '@mantine/core';
import { useCategories, useCategory } from '../../hooks/use-api';
import { ProductSearchDialog } from '../ProductSearchDialog';
```

`ProductSearchDialog` does not exist yet — it will be created in Task 7. Add this import but note that the page will only compile fully after Task 7 is complete. If needed, comment it out temporarily during development of this task.

#### 5c. Fix initial `selectedCategory` state

```typescript
// BEFORE:
const [selectedCategory, setSelectedCategory] = useState(categoryId || '1');
// AFTER:
const [selectedCategory, setSelectedCategory] = useState(categoryId);
```

#### 5d. Add new hooks inside component

After existing `addItem`/`hasCartItems` declarations:

```typescript
const { data: categoryResponse, isLoading: categoryLoading } = useCategory(selectedCategory);
const { data: allCategoriesResponse } = useCategories();
const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
```

#### 5e. Update `categoryName` derivation

```typescript
const categoryName = categoryResponse?.data?.name ?? 'Category';
```

#### 5f. Update `useProducts` call

```typescript
const { data: productsResponse, isLoading } = useProducts({
  page: 1,
  limit: 200,
  isAvailable: true,
  categoryId: selectedCategory,  // NEW
});
```

#### 5g. Add `sidebarCategories` derivation

Before `handleAddToCart`:

```typescript
const sidebarCategories = (allCategoriesResponse?.data ?? []).map((cat: any) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));
```

#### 5h. Add sidebar category select handler

```typescript
const handleSidebarCategorySelect = (newCategoryId: string) => {
  setSelectedCategory(newCategoryId);
  router.replace(`/category/${newCategoryId}`);
};
```

#### 5i. Update `CategorySidebar` JSX

```tsx
<CategorySidebar
  categories={sidebarCategories}
  selectedCategoryId={selectedCategory}
  onSelectCategory={handleSidebarCategorySelect}
/>
```

#### 5j. Add category name loading skeleton

In the header JSX where category name is displayed:

```tsx
<Text size="lg" fw={typography.fontWeight.bold} variant="primary">
  {categoryLoading ? <Skeleton height={20} width={120} /> : categoryName}
</Text>
```

#### 5k. Add products loading skeleton

Wrap the `ProductGrid` with:

```tsx
{isLoading ? (
  <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={spacing.sm} p={spacing.sm}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} height={200} radius="md" />
    ))}
  </SimpleGrid>
) : (
  <ProductGrid
    title=""
    products={products}
    columns={{ base: 2, xs: 2, sm: 2, md: 3, lg: 4 }}
    onProductClick={handleProductClick}
    onAddToCart={handleAddToCart}
  />
)}
```

#### 5l. Wire `IconSearch` to `openSearch`

Replace the existing inert `<ActionIcon>`:

```tsx
<ActionIcon
  variant="transparent"
  color="dark"
  onClick={openSearch}
  aria-label="Search products"
>
  <IconSearch size={24} />
</ActionIcon>
```

#### 5m. Mount `ProductSearchDialog` at bottom of return

```tsx
{searchOpened && (
  <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
)}
```

---

## Acceptance Criteria

1. Web home page renders `CategoryGrid` with real category data from `GET /api/categories`.
2. During `categoriesLoading`, 8 `Skeleton` boxes render in the `CategoryGrid` area.
3. When API returns no categories, "No categories available yet." text renders.
4. Clicking a category card navigates to `/category/<uuid>` (real UUID, not a slug).
5. `CategoryDetail` page at `/category/<uuid>` calls `useCategory(<uuid>)` and displays the real category name in the header.
6. While category name is loading, a skeleton renders in its place.
7. `CategoryDetail` calls `GET /api/products?categoryId=<uuid>&isAvailable=true&limit=200` and shows only that category's products.
8. While products are loading, 6 skeleton cards render in the product grid area.
9. Tapping a category in `CategorySidebar` updates both `selectedCategory` state and the URL via `router.replace`.
10. `IconSearch` button in the `CategoryDetail` header opens `ProductSearchDialog` (dialog renders — full behavior tested in Task 7).
11. `tsc --noEmit` passes for `apps/web`.
12. `nx serve web` starts without errors.

---

## Dependencies

- **Task 3** must be complete: `GET /api/categories` and `GET /api/products?categoryId=` endpoints are live.
- **Task 1** must be complete: `CategoryDto` is in `@shreehari/types`.
- **Task 7** (search dialog) is the downstream dependency — the `ProductSearchDialog` import in `CategoryDetail.tsx` will cause a compile error until Task 7 creates the file. Either comment out the import/usage during this task, or complete Task 7 in parallel.
