# Frontend Task 5 — Admin Product Enhancements

**Track:** Admin Frontend
**Depends on:** Task 4 (admin categories pages complete, hooks available)
**Blocks:** Nothing (final admin task)

---

## Objective

Extend the existing admin product management pages with category support:

1. Add a Category `Select` field to `ProductFormPage` — optional, clearable, pre-populated from `existingProduct.categoryId` in edit mode, included in create/update payloads.
2. Add a Category column to the `ProductsPage` DataTable.
3. Add a Category filter dropdown to `ProductsPage` SearchFilter.
4. Update `useProducts` call in `ProductsPage` to pass `categoryId` filter.

---

## Files Changed

| File | Status |
|------|--------|
| `apps/admin/src/pages/ProductFormPage.tsx` | Modified |
| `apps/admin/src/pages/ProductsPage.tsx` | Modified |

---

## Implementation Steps

### Step 1 — `apps/admin/src/pages/ProductFormPage.tsx`

#### 1a. Extend `ProductFormData` interface

Add `categoryId: string | null` to the existing interface:

```typescript
interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description: string;
  isAvailable: boolean;
  imageFile: File | null;
  categoryId: string | null;   // NEW
}
```

#### 1b. Update initial state default

Add `categoryId: null` to the `useState` initializer.

#### 1c. Add `useCategories` to the import block

```typescript
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
  useCategories,   // NEW
} from '@shreehari/data-access';
```

#### 1d. Add hook call

After the existing hook declarations:

```typescript
const { data: categoriesData, loading: categoriesLoading } = useCategories();
```

#### 1e. Add Category Select field in JSX

Add as a new `<Grid.Col span={{ base: 12, md: 4 }>` immediately **before** the description `<Grid.Col>` (the `span={12}` textarea column):

```tsx
<Grid.Col span={{ base: 12, md: 4 }}>
  <FormField>
    <Select
      label="Category"
      placeholder="Select category (optional)"
      clearable
      data={categoriesData?.map((c: any) => ({ value: c.id, label: c.name })) ?? []}
      value={formData.categoryId}
      onChange={(value) => updateFormData('categoryId', value)}
      disabled={categoriesLoading}
    />
  </FormField>
</Grid.Col>
```

`Select` is already imported from `@shreehari/ui`.

#### 1f. Update pre-population `useEffect`

In the existing effect that sets `formData` when `isEditing && existingProduct`, add:

```typescript
categoryId: existingProduct.categoryId ?? null,
```

#### 1g. Update submit payloads

In both the create and update paths inside `handleSubmit`, add:

```typescript
categoryId: formData.categoryId ?? undefined,
```

Also update `handleSaveAndAddAnother` (if it exists) with the same addition to `productData`.

#### 1h. Ensure `categoryId` is appended to `FormData` when using multipart

The `useCreateProduct` and `useUpdateProduct` hooks in `libs/data-access/src/index.ts` build `FormData` when an image file is present. Verify that `categoryId` is appended to `FormData` in both hooks:

```typescript
if (productData.categoryId) {
  formData.append('categoryId', productData.categoryId);
}
```

If this is not already done in Task 2, add it now as part of this task (modifying `libs/data-access/src/index.ts` accordingly).

---

### Step 2 — `apps/admin/src/pages/ProductsPage.tsx`

#### 2a. Add `categoryId` to filters state

```typescript
const [filters, setFilters] = useState({
  unit: '',
  isAvailable: '',
  categoryId: '',   // NEW
});
```

#### 2b. Add `useCategories` to the import block

```typescript
import {
  useProducts,
  useDeleteProduct,
  useToggleProductAvailability,
  useCategories,   // NEW
  API_BASE_URL,
} from '@shreehari/data-access';
```

#### 2c. Add hook call

After the existing hook declarations:

```typescript
const { data: categoriesData } = useCategories();
```

No `loading`/`error` destructuring needed — an empty dropdown during load is acceptable.

#### 2d. Update `useProducts` call — add `categoryId` as 6th argument

```typescript
const { data: productsData, loading, error, refetch } = useProducts(
  page,
  limit,
  searchValue || undefined,
  filters.unit || undefined,
  filters.isAvailable !== '' ? filters.isAvailable === 'true' : undefined,
  filters.categoryId || undefined,   // NEW 6th argument
);
```

#### 2e. Update `handleClearFilters`

```typescript
const handleClearFilters = () => {
  setFilters({
    unit: '',
    isAvailable: '',
    categoryId: '',   // NEW
  });
  setSearchValue('');
  setPage(1);
};
```

#### 2f. Update `useEffect` dependency array

The existing effect that resets `page` to 1 on filter change must include `filters.categoryId`:

```typescript
useEffect(() => {
  setPage(1);
}, [searchValue, filters.unit, filters.isAvailable, filters.categoryId]);
```

#### 2g. Add Category entry to `filterOptions` array

After the existing `isAvailable` filter object:

```typescript
{
  key: 'categoryId',
  label: 'Category',
  type: 'select',
  placeholder: 'All categories',
  options: categoriesData?.map((c: any) => ({ value: c.id, label: c.name })) ?? [],
  value: filters.categoryId,
},
```

#### 2h. Add Category column to the DataTable `columns` array

After the `isAvailable` status column:

```typescript
{
  key: 'categoryName',
  title: 'Category',
  render: (value) => (
    <Text size="sm" c={value ? undefined : 'dimmed'}>
      {value ?? '—'}
    </Text>
  ),
},
```

`key: 'categoryName'` matches the `categoryName` field on `ProductDto` (added in Task 1). Renders an em dash when no category is assigned.

---

## Acceptance Criteria

1. `ProductFormPage` in create mode shows an optional "Category" `Select` dropdown populated from `GET /api/categories`.
2. `ProductFormPage` in edit mode pre-selects the product's current category in the `Select`.
3. Clearing the `Select` (via the clearable `×`) sets `categoryId` to `null`; the submitted payload sends `undefined` (not empty string).
4. Submitting `ProductFormPage` with a category selected includes `categoryId` in the API request body.
5. Submitting `ProductFormPage` with an image file AND a category selected includes `categoryId` in the `FormData` payload.
6. `ProductsPage` DataTable has a "Category" column showing the category name or `"—"` for uncategorized products.
7. `ProductsPage` SearchFilter has a "Category" dropdown; selecting a category filters the table via `GET /api/products?categoryId=<uuid>`.
8. Clicking "Clear Filters" resets `categoryId` to `''` and clears the dropdown.
9. Changing the category filter resets pagination to page 1.
10. `nx serve admin` compiles without TypeScript errors.
11. No existing product form behavior is broken (name, price, quantity, unit, description, image, availability all work as before).

---

## Dependencies

- **Task 4** must be complete: `useCategories` hook is exported from `@shreehari/data-access` and `CategoryDto` is available.
- **Task 3** must be complete: `GET /api/products` returns `categoryName` on each product, and `GET /api/categories` returns the full list.
- **Task 1** must be complete: `CategoryDto`, `categoryId`, `categoryName` are in `@shreehari/types`.
