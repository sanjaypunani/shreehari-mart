# UI Specification: Product Category Module + Product Search

**Status:** Draft
**Date:** 2026-03-19
**Scope:** `apps/admin` (React/Vite/Mantine) + `apps/web` (Next.js 16)
**PRD Reference:** `docs/prd-category-search.md`

---

## 1. Admin — Categories List Page (`/categories`)

### Page Layout

Follows the identical pattern as `ProductsPage.tsx`. The page renders inside `<Layout>` which provides the `AppShell` frame.

```
<Stack gap="md">
  <PageHeader ... />
  <SearchFilter ... />
  <DataTable ... />
  <PaginationControls ... />    ← omitted for now (PRD states < 100 categories expected)
</Stack>
```

> Note: `PaginationControls` can be omitted on first pass since the PRD explicitly states pagination is not required for categories. The `DataTable` renders all rows returned from `GET /api/categories`.

### PageHeader Config

```tsx
<PageHeader
  title="Categories"
  subtitle="Manage product categories"
  actions={[
    {
      label: 'New Category',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: () => navigate('/categories/new'),
    },
  ]}
/>
```

- Title text: `"Categories"`
- Subtitle text: `"Manage product categories"`
- Single action button. Label: `"New Category"`. Variant: `'brand'` (matches the green Shreehari brand color used in `ProductsPage`). Icon: `IconPlus` from `@tabler/icons-react`, size `16`.

### SearchFilter Config

```tsx
<SearchFilter
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  searchPlaceholder="Search categories by name..."
  filters={[]}
  onFilterChange={() => {}}
  onClearFilters={handleClearFilters}
  filtersExpanded={false}
  onToggleFilters={() => {}}
/>
```

- No filter dropdowns are needed for categories (no unit or availability concept).
- Passing an empty `filters={[]}` array hides the filter panel.
- Search is client-side: filter the local `categories` array by `category.name.toLowerCase().includes(searchValue.toLowerCase())` since the API returns all categories in one response.

### DataTable Columns

Column type: `Column<CategoryDto>[]` imported from `@shreehari/ui`.

| Column key | Title | Render function |
|------------|-------|-----------------|
| `imageUrl` | `"Image"` | `<Image src={getImageUrl(value)} w={48} h={48} radius="sm" fallbackSrc="https://via.placeholder.com/48" />` — `import { Image } from '@mantine/core'`; `import { getImageUrl } from '@shreehari/utils'` (same as `ProductsPage.tsx`) |
| `name` | `"Name"` | `<Text size="sm" fw={500}>{value}</Text>` |
| `productCount` | `"Products"` | `<Badge variant="outline">{value ?? 0}</Badge>` |
| `createdAt` | `"Created At"` | `<Text size="sm" c="dimmed">{new Date(value).toLocaleDateString('en-IN')}</Text>` |

Actions column (via the `actions` prop of `DataTable`):

```tsx
const actions: DataTableAction<CategoryDto>[] = [
  {
    icon: <IconEdit size={16} />,
    label: 'Edit',
    color: 'gray',
    onClick: (category) => navigate(`/categories/${category.id}/edit`),
  },
  {
    icon: <IconTrash size={16} />,
    label: 'Delete',
    color: 'red',
    onClick: handleDeleteCategory,
  },
];
```

No "View" action is needed for categories (no separate detail view).

### Delete Confirmation Modal

Triggered by the Delete action. Matches the exact pattern in `ProductsPage.tsx`:

```tsx
const handleDeleteCategory = (category: CategoryDto) => {
  modals.openConfirmModal({
    title: 'Delete Category',
    children: (
      <Text size="sm">
        Are you sure you want to delete <strong>{category.name}</strong>?
        Products in this category will become uncategorized.
        This action cannot be undone.
      </Text>
    ),
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      try {
        await deleteCategory(category.id);
        notifications.show({
          title: 'Success',
          message: 'Category deleted successfully',
          color: 'green',
        });
        refetch();
      } catch {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete category',
          color: 'red',
        });
      }
    },
  });
};
```

Body text: `"Are you sure you want to delete <strong>{category.name}</strong>? Products in this category will become uncategorized. This action cannot be undone."`

### Empty State

`DataTable` receives `emptyMessage="No categories found"` prop.

### Loading State

`DataTable` receives `loading={loading || deleteLoading}` prop. The `DataTable` renders a `LoadingOverlay` spinner overlay (from `@mantine/core`) when `loading` is `true` — it does NOT render skeleton rows.

### Error State

```tsx
if (error) {
  return (
    <Stack gap="md">
      <PageHeader title="Categories" subtitle="Manage product categories" actions={headerActions} />
      <Text c="red">Error loading categories: {error}</Text>
    </Stack>
  );
}
```

---

## 2. Admin — Category Form Page (`/categories/new` and `/categories/:id/edit`)

### Page Layout

Follows the identical pattern as `ProductFormPage.tsx`.

```
<Stack gap="md">
  <PageHeader ... />
  <Form title="Category Details" onSubmit={handleSubmit} actions={formActions} loading={loading} actionsPosition="right">
    <Grid>
      ...fields...
    </Grid>
  </Form>
</Stack>
```

### PageHeader Config

**Create mode** (`/categories/new`):
```tsx
<PageHeader
  title="Add New Category"
  subtitle="Create a new product category"
  actions={[]}
/>
```

**Edit mode** (`/categories/:id/edit`):
```tsx
<PageHeader
  title="Edit Category"
  subtitle="Update category information"
  actions={[]}
/>
```

No secondary header actions are needed (no "Save & Add Another" for categories).

### Form Fields

All fields are inside `<Form title="Category Details" ...>` and wrapped individually in `<FormField>`.

#### Field 1 — Name (required)

```tsx
<Grid.Col span={{ base: 12, md: 8 }}>
  <FormField>
    <TextInput
      label="Category Name"
      placeholder="e.g. Fresh Vegetables"
      required
      maxLength={100}
      value={formData.name}
      onChange={(event) => updateFormData('name', event.currentTarget.value)}
    />
  </FormField>
</Grid.Col>
```

- Label: `"Category Name"`
- Placeholder: `"e.g. Fresh Vegetables"`
- `required` attribute present (browser-level + server-side validation)
- `maxLength={100}` (matches entity constraint)
- Grid span: `{ base: 12, md: 8 }` — takes 8 of 12 columns on medium+ screens

#### Field 2 — Image (optional)

```tsx
<Grid.Col span={{ base: 12, md: 8 }}>
  <FormField>
    <FileInput
      label="Category Image"
      placeholder="Upload category image (optional)"
      leftSection={<IconUpload size={14} />}
      accept="image/jpeg,image/png,image/webp,image/gif"
      clearable
      value={formData.imageFile}
      onChange={(file) => updateFormData('imageFile', file)}
    />
  </FormField>
</Grid.Col>
```

- Label: `"Category Image"`
- Placeholder: `"Upload category image (optional)"`
- Left section: `<IconUpload size={14} />` from `@tabler/icons-react`
- `accept="image/jpeg,image/png,image/webp,image/gif"` (matches PRD accepted MIME types)
- `clearable` prop enabled so the user can remove a selected file
- Not `required`. No `*` asterisk displayed.
- Max size validation (5 MB) handled in the submit handler, not via HTML attribute:

```tsx
if (formData.imageFile && formData.imageFile.size > 5 * 1024 * 1024) {
  notifications.show({
    title: 'Error',
    message: 'Image must be smaller than 5 MB',
    color: 'red',
  });
  return;
}
```

#### Current Image Preview (Edit mode only)

When editing and `existingCategory.imageUrl` is set, show the current image above the `FileInput`:

```tsx
{isEditing && existingCategory?.imageUrl && !formData.imageFile && (
  <Box mb="xs">
    <Text size="xs" c="dimmed" mb={4}>Current image:</Text>
    <Image
      src={getImageUrl(existingCategory.imageUrl)}  {/* import { getImageUrl } from '@shreehari/utils' */}
      w={80}
      h={80}
      radius="sm"
      fit="contain"
    />
  </Box>
)}
```

### Form Actions

```tsx
const formActions: FormAction[] = [
  {
    label: 'Cancel',
    variant: 'outline',
    onClick: () => navigate('/categories'),
    disabled: loading,
  },
  {
    label: isEditing ? 'Update Category' : 'Save Category',
    variant: 'brand',
    type: 'submit',
    loading: loading,
    onClick: () => {},
  },
];
```

### Form State Interface

```typescript
interface CategoryFormData {
  name: string;
  imageFile: File | null;
}
```

### Submit Logic

- If `formData.imageFile` is present: submit as `multipart/form-data` — append `name` as a text field, `image` as the file field.
- If no file: submit as JSON `{ name: formData.name }`.
- On success: `navigate('/categories')` + `notifications.show({ title: 'Success', message: isEditing ? 'Category updated successfully' : 'Category created successfully', color: 'green' })`.
- On error: `notifications.show({ title: 'Error', message: isEditing ? 'Failed to update category' : 'Failed to create category', color: 'red' })`.

### Pre-population in Edit Mode

```tsx
useEffect(() => {
  if (isEditing && existingCategory) {
    setFormData({
      name: existingCategory.name,
      imageFile: null, // Cannot pre-populate File object
    });
  }
}, [isEditing, existingCategory]);
```

Data source: `GET /api/categories/:id` via a `useCategory(id)` hook (see Section 9).

---

## 3. Admin — Layout Nav + App Routes

### Navigation Entry (`apps/admin/src/components/Layout.tsx`)

Add one entry to the `navigation` array. Position: immediately after `{ icon: IconBox, label: 'Products', href: '/products' }`.

```tsx
import { IconTag } from '@tabler/icons-react';

// Inside the navigation array:
{ icon: IconTag, label: 'Categories', href: '/categories' },
```

Full updated `navigation` array (showing insertion point):

```tsx
const navigation = [
  { icon: IconDashboard,    label: 'Dashboard',       href: '/' },
  { icon: IconShoppingCart, label: 'Orders',          href: '/orders' },
  { icon: IconBox,          label: 'Products',        href: '/products' },
  { icon: IconTag,          label: 'Categories',      href: '/categories' },   // NEW
  { icon: IconUsers,        label: 'Customers',       href: '/customers' },
  { icon: IconReceipt,      label: 'Monthly Billing', href: '/monthly-billing' },
  { icon: IconHome,         label: 'Societies',       href: '/societies' },
  { icon: IconBuilding,     label: 'Buildings',       href: '/buildings' },
];
```

- Icon: `IconTag` (not `IconCategory` — `IconTag` exists in Tabler icons and communicates categorization well)
- Label: `"Categories"` (exact string)
- `href`: `'/categories'`
- Active state styling is automatic — the existing `isActive = location.pathname === item.href` check handles it

### Route Entries (`apps/admin/src/App.tsx`)

Add three `<Route>` entries inside `<Routes>`. Position: immediately after the existing product routes.

```tsx
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryFormPage } from './pages/CategoryFormPage';

// Inside <Routes>:
<Route path="/categories"           element={<CategoriesPage />} />
<Route path="/categories/new"       element={<CategoryFormPage />} />
<Route path="/categories/:id/edit"  element={<CategoryFormPage />} />
```

Exact paths:
- `/categories` — list page
- `/categories/new` — create form
- `/categories/:id/edit` — edit form (the `useParams<{ id: string }>()` hook reads the UUID)

---

## 4. Admin — Product Form: Category Selector

### File: `apps/admin/src/pages/ProductFormPage.tsx`

#### FormData Interface Update

Add `categoryId` to the existing `ProductFormData` interface:

```typescript
interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description: string;
  isAvailable: boolean;
  imageFile: File | null;
  categoryId: string | null;     // NEW
}
```

Default value: `categoryId: null`.

#### Category Select Field

Add as a new `<Grid.Col>` immediately before the description field. Span: `{ base: 12, md: 4 }` (same row as Quantity and Unit on medium+ screens).

```tsx
<Grid.Col span={{ base: 12, md: 4 }}>
  <FormField>
    <Select
      label="Category"
      placeholder="Select category (optional)"
      clearable
      data={categoriesData?.map((c) => ({ value: c.id, label: c.name })) ?? []}
      value={formData.categoryId}
      onChange={(value) => updateFormData('categoryId', value)}
      disabled={categoriesLoading}
    />
  </FormField>
</Grid.Col>
```

- Label: `"Category"`
- Placeholder: `"Select category (optional)"`
- `clearable` prop: allows the user to set `categoryId` back to `null`
- Not `required` — explicitly optional
- `data` prop: derived from `GET /api/categories` response; each item shaped as `{ value: category.id, label: category.name }`
- Data source hook: `useCategories()` (new hook — see Section 9)
- `disabled` when categories are loading to prevent interaction before data arrives

#### Pre-population in Edit Mode

```tsx
useEffect(() => {
  if (isEditing && existingProduct) {
    setFormData({
      name: existingProduct.name,
      price: existingProduct.price,
      quantity: existingProduct.quantity,
      unit: existingProduct.unit,
      description: existingProduct.description || '',
      isAvailable: existingProduct.isAvailable,
      imageFile: null,
      categoryId: existingProduct.categoryId ?? null,   // NEW
    });
  }
}, [isEditing, existingProduct]);
```

#### Submit Payload Update

Include `categoryId` in both create and update payloads:

```typescript
// Create
const createData: CreateProductDto = {
  name: formData.name,
  price: formData.price,
  quantity: formData.quantity,
  unit: formData.unit,
  description: formData.description || undefined,
  categoryId: formData.categoryId ?? undefined,        // NEW
};

// Update
const updateData: UpdateProductDto = {
  name: formData.name,
  price: formData.price,
  quantity: formData.quantity,
  unit: formData.unit,
  description: formData.description || undefined,
  isAvailable: formData.isAvailable,
  categoryId: formData.categoryId ?? undefined,        // NEW
};
```

---

## 5. Admin — Products Page: Category Filter

### File: `apps/admin/src/pages/ProductsPage.tsx`

#### filterOptions Array Update

Add one new entry to the existing `filterOptions` array after the `isAvailable` filter. The filter key must match the query parameter name sent to `GET /api/products`:

```tsx
const filterOptions: FilterOption[] = [
  {
    key: 'unit',
    label: 'Unit',
    type: 'select',
    placeholder: 'All units',
    options: [
      { value: 'gm', label: 'Grams (gm)' },
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'pc', label: 'Pieces (pc)' },
      { value: 'ltr', label: 'Litres (ltr)' },
      { value: 'ml', label: 'Millilitres (ml)' },
    ],
    value: filters.unit,
  },
  {
    key: 'isAvailable',
    label: 'Availability',
    type: 'select',
    placeholder: 'All products',
    options: [
      { value: 'true', label: 'Available' },
      { value: 'false', label: 'Out of Stock' },
    ],
    value: filters.isAvailable,
  },
  // NEW ENTRY:
  {
    key: 'categoryId',
    label: 'Category',
    type: 'select',
    placeholder: 'All categories',
    options: categoriesData?.map((c) => ({ value: c.id, label: c.name })) ?? [],
    value: filters.categoryId,
  },
];
```

#### filters State Update

```typescript
const [filters, setFilters] = useState({
  unit: '',
  isAvailable: '',
  categoryId: '',    // NEW
});
```

#### handleClearFilters Update

```typescript
const handleClearFilters = () => {
  setFilters({
    unit: '',
    isAvailable: '',
    categoryId: '',    // NEW
  });
  setSearchValue('');
  setPage(1);
};
```

#### useEffect Page Reset — Update Dependency Array

The existing `useEffect` that resets page to 1 on filter change must include `filters.categoryId`:

```typescript
useEffect(() => {
  setPage(1);
}, [searchValue, filters.unit, filters.isAvailable, filters.categoryId]);  // add categoryId
```

#### useProducts Call Update

Pass `categoryId` filter to the hook:

```typescript
const { data: productsData, loading, error, refetch } = useProducts(
  page,
  limit,
  searchValue || undefined,
  filters.unit || undefined,
  filters.isAvailable !== '' ? filters.isAvailable === 'true' : undefined,
  filters.categoryId || undefined,    // NEW
);
```

#### Category Column in DataTable

Add after the `isAvailable` status column:

```tsx
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

- `key`: `'categoryName'` — this matches the `categoryName` field added to `ProductDto`
- Renders `"—"` (em dash) when `value` is `null` or `undefined`
- Text color: `c="dimmed"` for the `"—"` case, default otherwise

---

## 6. Web — Home Page: Dynamic Categories

### File: `apps/web/src/app/components/root.tsx`

#### Remove Static Array

Delete the entire `const categories = [...]` array (lines 15–64 of the current file).

#### Add useCategories Hook

```tsx
import { useCategories } from '../../hooks/use-api';

// Inside HomeRoot component:
const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

const categories = (categoriesResponse?.data ?? []).map((cat) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));
```

- `categoriesResponse` shape: `{ success: boolean; data: CategoryDto[] }` — same `ApiResponse<CategoryDto[]>` envelope as other API calls
- `toApiAssetUrl` is already imported in the file; it correctly handles `null`/`undefined` imageUrl and returns the placeholder fallback URL

#### Loading Skeleton

Replace the `<CategoryGrid>` with a conditional block:

```tsx
{categoriesLoading ? (
  <Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
    <Text size="md" fw={typography.fontWeight.semibold} variant="primary" style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
      Grocery & Kitchen
    </Text>
    <SimpleGrid cols={{ base: 4, xs: 4, sm: 6, md: 8, lg: 10 }} spacing={spacing.xs}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={80} radius="sm" />
      ))}
    </SimpleGrid>
  </Box>
) : (
  <CategoryGrid
    title="Grocery & Kitchen"
    categories={categories}
    onCategoryClick={handleCategoryClick}
  />
)}
```

- Skeleton count: `8` (matches 8 categories in the old static array)
- Skeleton height: `80` (approximates `CategoryCard` height at its smallest viewport)
- `Skeleton` is imported from `@mantine/core`
- `SimpleGrid` cols matches the `CategoryGrid` default: `{ base: 4, xs: 4, sm: 6, md: 8, lg: 10 }`

#### Empty State

When `!categoriesLoading && categories.length === 0`:

```tsx
<Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
  <Text size="md" fw={typography.fontWeight.semibold} variant="primary" style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
    Grocery & Kitchen
  </Text>
  <Text variant="secondary" size="sm">No categories available yet.</Text>
</Box>
```

Text: `"No categories available yet."`

#### onCategoryClick Handler

No change required. The existing handler already navigates to `/category/${categoryId}`. After this change, `categoryId` will be the real UUID from the API instead of the old slug string.

```tsx
const handleCategoryClick = (categoryId: string) => {
  router.push(`/category/${categoryId}`);
};
```

#### CategoryGrid Props (final)

```tsx
<CategoryGrid
  title="Grocery & Kitchen"
  categories={categories}   // CategoryCardProps[] with { id, name, image }
  onCategoryClick={handleCategoryClick}
/>
```

No change to the `CategoryGrid` or `CategoryCard` components themselves.

---

## 7. Web — Category Detail Page: Dynamic Products

### File: `apps/web/src/components/category/CategoryDetail.tsx`

#### Remove Mock Data

Delete the entire `MOCK_CATEGORIES` array (lines 17–53 of the current file).

#### Add API Hooks

```tsx
import { useCategories, useCategory } from '../../hooks/use-api';

// Inside CategoryDetail component:
const { data: categoryResponse, isLoading: categoryLoading } = useCategory(categoryId);
const { data: allCategoriesResponse, isLoading: allCategoriesLoading } = useCategories();
```

#### Category Name

Replace the mock lookup:

```tsx
// BEFORE (remove):
const categoryName = MOCK_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Category';

// AFTER:
const categoryName = categoryResponse?.data?.name ?? 'Category';
```

During loading, the header shows `"Category"` as the fallback. When `categoryLoading` is true, optionally render a `Skeleton` in place of the category name text:

```tsx
<Text size="lg" fw={typography.fontWeight.bold} variant="primary">
  {categoryLoading ? <Skeleton height={20} width={120} /> : categoryName}
</Text>
```

#### Products Fetch with categoryId Filter

Replace the current `useProducts` call:

```tsx
// BEFORE (remove):
const { data: productsResponse, isLoading } = useProducts({
  page: 1,
  limit: 100,
  isAvailable: true,
});

// AFTER:
const { data: productsResponse, isLoading } = useProducts({
  page: 1,
  limit: 200,
  isAvailable: true,
  categoryId: selectedCategory,    // NEW — filters products to this category
});
```

- `limit: 200` per PRD (no pagination on category detail)
- `categoryId: selectedCategory` — passed as query param `?categoryId=<uuid>&isAvailable=true&limit=200`
- `selectedCategory` state is initialized from the `categoryId` prop

#### Sidebar Dynamic Categories

```tsx
const sidebarCategories = (allCategoriesResponse?.data ?? []).map((cat) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));

// Replace:
<CategorySidebar
  categories={sidebarCategories}           // was: MOCK_CATEGORIES
  selectedCategoryId={selectedCategory}
  onSelectCategory={handleSidebarCategorySelect}
/>
```

#### Sidebar Category Select Handler

When a different category is selected from the sidebar, replace the URL to avoid stale data:

```tsx
const handleSidebarCategorySelect = (newCategoryId: string) => {
  setSelectedCategory(newCategoryId);
  router.replace(`/category/${newCategoryId}`);
};
```

- Uses `router.replace` (not `router.push`) — avoids polluting the browser history stack with every sidebar tap

#### Loading State for Products

While `isLoading` is true, render `ProductGrid` with Skeleton placeholders in place of the product grid:

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

Skeleton count: `6`. Skeleton height: `200` (approximates `ProductCard` height).

#### Search Icon Button

The `IconSearch` `ActionIcon` in the header currently does nothing. Wire it to open the `ProductSearchDialog`:

```tsx
const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);

// In JSX:
<ActionIcon variant="transparent" color="dark" onClick={openSearch} aria-label="Search products">
  <IconSearch size={24} />
</ActionIcon>

{/* At bottom of component return: */}
{searchOpened && (
  <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
)}
```

Import `useDisclosure` from `@mantine/hooks` and `ProductSearchDialog` from `'../ProductSearchDialog'`.

---

## 8. Web — Full-Screen Product Search Dialog

### File: `apps/web/src/components/ProductSearchDialog.tsx` (new file)

### Component Props

```typescript
interface ProductSearchDialogProps {
  opened: boolean;
  onClose: () => void;
}
```

### Full Structure

```tsx
'use client';

import React, { useEffect } from 'react';
import { Modal, Box, Group, ActionIcon, ScrollArea, Loader, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconArrowLeft, IconX, IconPlus } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Text, SearchInput, Image } from './ui';
import { useProducts } from '../hooks/use-api';
import { useCartStore } from '../store/cart-store';
import { toApiAssetUrl } from '../config/api';
import { ProductDto } from '@shreehari/types';

export function ProductSearchDialog({ opened, onClose }: ProductSearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const addItem = useCartStore((state) => state.addItem);

  const { data: productsResponse, isLoading } = useProducts(
    { search: debouncedQuery, isAvailable: true, limit: 30 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const products = productsResponse?.data ?? [];

  // Reset search when dialog closes
  useEffect(() => {
    if (!opened) {
      setSearchQuery('');
    }
  }, [opened]);

  const handleAddToCart = (product: ProductDto) => {
    addItem({
      id: product.id,
      name: product.name,
      image: toApiAssetUrl(product.imageUrl),
      price: parseFloat(product.price.toString()),
      unit: product.unit,
      productQuantity: `${product.quantity}${product.unit}`,
      orderedQuantity: product.quantity,
      baseQuantity: product.quantity,
      basePrice: parseFloat(product.price.toString()),
      baseUnit: product.unit,
      isAvailable: true,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      withCloseButton={false}
      padding={0}
      styles={{
        body: { height: '100%', display: 'flex', flexDirection: 'column' },
        content: { height: '100dvh' },
      }}
    >
      {/* Header */}
      <Box
        style={{
          backgroundColor: colors.background,
          padding: `${spacing.sm} ${spacing.md}`,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: shadow.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Group gap={spacing.sm} align="center">
          <ActionIcon
            variant="transparent"
            color="dark"
            onClick={onClose}
            aria-label="Close search"
          >
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Box style={{ flex: 1 }}>
            <SearchInput
              placeholder='Search for "Tomatoes"'
              size="md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              data-autofocus
              autoFocus
              aria-label="Search products"
              aria-autocomplete="list"
              aria-controls="search-results-list"
            />
          </Box>
          {searchQuery.length > 0 && (
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <IconX size={20} />
            </ActionIcon>
          )}
        </Group>
      </Box>

      {/* Results Area */}
      <ScrollArea style={{ flex: 1 }} id="search-results-list">
        {/* Idle state: query too short */}
        {debouncedQuery.length < 2 && (
          <Box p={spacing.lg} style={{ textAlign: 'center', paddingTop: '64px' }}>
            <Text variant="secondary" size="md">
              Search for products…
            </Text>
            <Text variant="secondary" size="sm" style={{ marginTop: spacing.xs }}>
              Type at least 2 characters to see results
            </Text>
          </Box>
        )}

        {/* Loading state */}
        {debouncedQuery.length >= 2 && isLoading && (
          <Box p={spacing.lg} style={{ display: 'flex', justifyContent: 'center', paddingTop: '64px' }}>
            <Loader size="md" color={colors.primary} />
          </Box>
        )}

        {/* Empty results */}
        {debouncedQuery.length >= 2 && !isLoading && products.length === 0 && (
          <Box p={spacing.lg} style={{ textAlign: 'center', paddingTop: '64px' }}>
            <Text variant="secondary" size="md">
              No products found for &ldquo;{debouncedQuery}&rdquo;
            </Text>
          </Box>
        )}

        {/* Results list */}
        {debouncedQuery.length >= 2 && !isLoading && products.length > 0 && (
          <Stack gap={0} role="list" aria-label="Search results">
            {products.map((product: ProductDto) => (
              <Box
                key={product.id}
                role="listitem"
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  padding: `${spacing.sm} ${spacing.md}`,
                }}
              >
                <Group gap={spacing.sm} justify="space-between" align="center">
                  {/* Product image + info */}
                  <Group gap={spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: radius.sm,
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <Image
                        src={toApiAssetUrl(product.imageUrl)}
                        alt={product.name}
                        width="100%"
                        height="100%"
                        fit="contain"
                        withPlaceholder
                      />
                    </Box>
                    <Box style={{ minWidth: 0 }}>
                      <Text
                        size="sm"
                        fw={typography.fontWeight.semibold}
                        variant="primary"
                        style={{
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.name}
                      </Text>
                      <Text variant="secondary" size="xs" style={{ marginTop: 2 }}>
                        {product.quantity}{product.unit}
                      </Text>
                      <Text
                        size="sm"
                        fw={typography.fontWeight.bold}
                        style={{ color: colors.text.primary, marginTop: 4 }}
                      >
                        ₹{product.price}
                      </Text>
                    </Box>
                  </Group>

                  {/* Add button */}
                  <ActionIcon
                    size={36}
                    radius="md"
                    variant="outline"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    style={{
                      backgroundColor: 'white',
                      borderColor: colors.primary,
                      color: colors.primary,
                      borderWidth: '1px',
                      flexShrink: 0,
                    }}
                  >
                    <IconPlus size={18} strokeWidth={2.5} />
                  </ActionIcon>
                </Group>
              </Box>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Modal>
  );
}
```

### State

| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `searchQuery` | `string` | `''` | Controlled value for the search input |
| `debouncedQuery` | `string` | `''` | Debounced (300 ms) version used for the API call |

### Query Config

- Hook: `useProducts({ search: debouncedQuery, isAvailable: true, limit: 30 }, { enabled: debouncedQuery.length >= 2 })`
- Query is **disabled** when `debouncedQuery.length < 2` — no API call fires in the idle state
- Debounce: 300 ms via `useDebouncedValue` from `@mantine/hooks`
- API endpoint called: `GET /api/products?search=<debouncedQuery>&isAvailable=true&limit=30`

### Dialog States

| State | Condition | UI |
|-------|-----------|-----|
| Idle | `debouncedQuery.length < 2` | Centered text: `"Search for products…"` + `"Type at least 2 characters to see results"` |
| Loading | `debouncedQuery.length >= 2 && isLoading` | Centered `<Loader size="md" color={colors.primary} />` |
| Empty | `debouncedQuery.length >= 2 && !isLoading && products.length === 0` | Centered text: `'No products found for "<query>"'` |
| Results | `debouncedQuery.length >= 2 && !isLoading && products.length > 0` | Scrollable result rows |

### Result Row Fields

Each result row renders (left to right):
1. Product image: 56×56 px, `fit="contain"`, `radius.sm`, backgroundColor `colors.surface`
2. Product name: `size="sm"`, `fw={semibold}`, single-line truncated with ellipsis
3. Unit string: `"{product.quantity}{product.unit}"` — e.g. `"500gm"`, `size="xs"`, `variant="secondary"`
4. Price: `"₹{product.price}"`, `size="sm"`, `fw={bold}`
5. Add button: `ActionIcon` with `IconPlus`, same styling as `ProductCard`'s add button (`borderColor: colors.primary`, `color: colors.primary`)

### Add-to-Cart Mapping

When "Add" is tapped, call `useCartStore.addItem(...)` with this exact field mapping (matching `CategoryDetail.tsx`):

```typescript
addItem({
  id: product.id,
  name: product.name,
  image: toApiAssetUrl(product.imageUrl),
  price: parseFloat(product.price.toString()),
  unit: product.unit,
  productQuantity: `${product.quantity}${product.unit}`,
  orderedQuantity: product.quantity,
  baseQuantity: product.quantity,
  basePrice: parseFloat(product.price.toString()),
  baseUnit: product.unit,
  isAvailable: true,
});
```

No `selectedVariant`, `quantity`, or `discount` field — they get their default values from `CartStore.addItem`.

### MobileHeader Integration (`apps/web/src/components/MobileHeader.tsx`)

```tsx
import { useDisclosure } from '@mantine/hooks';
import { ProductSearchDialog } from './ProductSearchDialog';

export function MobileHeader() {
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);

  return (
    <Box component="header" style={{ ... }}>
      <Stack gap={0}>
        {/* Top Section — unchanged */}
        <Group justify="space-between" px={spacing.md} py={spacing.sm}>
          {/* Location Selector — unchanged */}
          {/* Profile Icon — unchanged */}
        </Group>

        {/* Search Section */}
        <Box px={spacing.md} py={spacing.sm}>
          <SearchInput
            placeholder='Search for "Grapes"'
            size="md"
            readOnly
            onClick={openSearch}
            onFocus={openSearch}
            style={{ cursor: 'pointer' }}
            aria-label="Open product search"
            aria-haspopup="dialog"
          />
        </Box>
      </Stack>

      {/* Search Dialog — conditionally mounted */}
      {searchOpened && (
        <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
      )}
    </Box>
  );
}
```

Key changes to `SearchInput` in `MobileHeader`:
- `readOnly` prop — prevents the mobile keyboard from appearing on the `MobileHeader` input; the real editable input is inside `ProductSearchDialog`
- `onClick={openSearch}` — tapping the read-only search bar opens the dialog
- `onFocus={openSearch}` — covers keyboard navigation (Tab to focus → dialog opens)
- `style={{ cursor: 'pointer' }}` — signals the element is interactive
- `aria-label="Open product search"` — announces purpose to screen readers
- `aria-haspopup="dialog"` — announces that a dialog will open

`ProductSearchDialog` is **conditionally mounted** (`{searchOpened && <ProductSearchDialog ... />}`) — this ensures `searchQuery` state resets to `''` on every open, preventing stale query results.

---

## 9. Component Inventory

### Admin (`apps/admin/`)

| Component | Source Path | Status | Notes |
|-----------|-------------|--------|-------|
| `PageHeader` | `@shreehari/ui` (`libs/ui/src/`) | Reused | Used in `CategoriesPage` and `CategoryFormPage` |
| `SearchFilter` | `@shreehari/ui` | Reused | Used in `CategoriesPage` with empty `filters=[]` |
| `DataTable` | `@shreehari/ui` | Reused | Used in `CategoriesPage` |
| `PaginationControls` | `@shreehari/ui` | Not used | Omitted — pagination not needed for categories |
| `Form` | `@shreehari/ui` | Reused | Used in `CategoryFormPage` |
| `FormField` | `@shreehari/ui` | Reused | Wraps each field in `CategoryFormPage` |
| `TextInput` | `@shreehari/ui` | Reused | Name field in `CategoryFormPage` |
| `Select` | `@shreehari/ui` | Reused | Category selector in `ProductFormPage` |
| `FileInput` | `@mantine/core` | Reused | Image upload in `CategoryFormPage` (same as `ProductFormPage`) |
| `Image` | `@mantine/core` | Reused | Thumbnail in `CategoriesPage`, preview in `CategoryFormPage` |
| `CategoriesPage` | `apps/admin/src/pages/CategoriesPage.tsx` | **New** | Admin categories list |
| `CategoryFormPage` | `apps/admin/src/pages/CategoryFormPage.tsx` | **New** | Admin create/edit form |
| `IconTag` | `@tabler/icons-react` | Reused | Nav item icon |
| `IconPlus` | `@tabler/icons-react` | Reused | "New Category" button |
| `IconEdit` | `@tabler/icons-react` | Reused | Edit action in DataTable |
| `IconTrash` | `@tabler/icons-react` | Reused | Delete action in DataTable |
| `IconUpload` | `@tabler/icons-react` | Reused | FileInput left section |

### Web (`apps/web/`)

| Component | Source Path | Status | Notes |
|-----------|-------------|--------|-------|
| `MobileHeader` | `apps/web/src/components/MobileHeader.tsx` | Modified | Adds `readOnly` + `onClick`/`onFocus` to `SearchInput`; mounts `ProductSearchDialog` |
| `CategoryGrid` | `apps/web/src/components/home/CategoryGrid.tsx` | Reused (no change) | Props remain identical; data source changes |
| `CategoryCard` | `apps/web/src/components/home/CategoryCard.tsx` | Reused (no change) | Props: `{ id, name, image, onClick }` |
| `CategoryDetail` | `apps/web/src/components/category/CategoryDetail.tsx` | Modified | Removes mock data; adds API hooks; wires `IconSearch` to dialog |
| `CategorySidebar` | `apps/web/src/components/category/CategorySidebar.tsx` | Reused (no change) | Props: `{ categories, selectedCategoryId, onSelectCategory }` — now receives live data |
| `ProductGrid` | `apps/web/src/components/products/ProductGrid.tsx` | Reused (no change) | Props unchanged |
| `ProductCard` | `apps/web/src/components/products/ProductCard.tsx` | Reused (no change) | Props: `{ id, name, image, price, discount, quantity, deliveryTime, onClick, onAddToCart }` |
| `ProductSearchDialog` | `apps/web/src/components/ProductSearchDialog.tsx` | **New** | Full-screen search dialog |
| `SearchInput` | `apps/web/src/components/ui/SearchInput.tsx` | Reused | Used inside `ProductSearchDialog` (editable) and `MobileHeader` (readOnly trigger) |
| `HomeRoot` | `apps/web/src/app/components/root.tsx` | Modified | Replaces static categories array with `useCategories()` hook |

### Hooks & Services

| Hook/Service | File | Status |
|--------------|------|--------|
| `useCategories` | `apps/web/src/hooks/use-api.ts` | **New** — calls `categoriesApi.getAll()` which returns `ApiResponse<CategoryDto[]>` (NOT paginated). Response shape: `{ success: true, data: CategoryDto[] }`. Access via `response.data`. Do NOT use `PaginatedResponse` wrapper. |
| `useCategory` | `apps/web/src/hooks/use-api.ts` | **New** — calls `categoriesApi.getById(id)` |
| `categoriesApi` | `apps/web/src/lib/api/services.ts` | **New** — `getAll()` returns `Promise<ApiResponse<CategoryDto[]>>`; `getById(id)` returns `Promise<ApiResponse<CategoryDto>>`. Flat list, no pagination. |
| `queryKeys.categories` | `apps/web/src/lib/query-client.ts` | **New** — `all`, `lists()`, `detail(id)` |
| `useProducts` | `apps/web/src/hooks/use-api.ts` | Modified — add `categoryId` and `search` to params type |

---

## 10. Interaction Flows

### Flow A — Customer: Search Open → Type → Result → Add to Cart

```
[Home Page]
     │
     ▼ Customer taps SearchInput in MobileHeader (readOnly)
     │   onClick={openSearch} fires
     │
     ▼ useDisclosure sets searchOpened=true
     │   ProductSearchDialog mounts (conditionally rendered)
     │
     ▼ [ProductSearchDialog — Idle state]
     │   searchQuery = ""
     │   debouncedQuery = "" (length < 2)
     │   SearchInput is autofocused (data-autofocus, autoFocus)
     │   UI shows: "Search for products…"
     │              "Type at least 2 characters to see results"
     │
     ▼ Customer types "tom"
     │   searchQuery = "tom" (updates on every keystroke)
     │   debouncedQuery still "" for 300ms
     │
     ▼ After 300ms debounce
     │   debouncedQuery = "tom" (length >= 2)
     │   useProducts query enabled
     │   isLoading = true
     │   UI shows: centered Loader spinner
     │
     ▼ API response arrives
     │   GET /api/products?search=tom&isAvailable=true&limit=30
     │   isLoading = false
     │   products = [{ id, name: "Tomatoes", ... }, { id, name: "Cherry Tomatoes", ... }]
     │
     ▼ [ProductSearchDialog — Results state]
     │   Scrollable result rows render
     │   Each row: [image] [name / quantity / price] [+ Add button]
     │
     ▼ Customer taps [+ Add] next to "Tomatoes"
     │   handleAddToCart(product) fires
     │   useCartStore.addItem({ id, name, image, price, unit, ... })
     │
     ▼ [Cart updated]
     │   CartBar at bottom updates item count (Zustand state → re-render)
     │
     ▼ Customer taps [← back arrow] or outside dialog (backdrop click) or presses Escape
     │   onClose() fires → closeSearch() → searchOpened=false
     │   ProductSearchDialog unmounts → searchQuery resets on next mount
     │
[Home Page — cart shows updated count]
```

### Flow B — Customer: Category Browse

```
[Home Page]
     │
     ▼ useCategories() fetches GET /api/categories
     │
     ▼ categoriesLoading=true → 8 Skeleton boxes render in CategoryGrid area
     │
     ▼ API response arrives
     │   categories = [{ id: "<uuid>", name: "Fresh Vegetables", imageUrl: "..." }, ...]
     │   categoriesLoading=false
     │
     ▼ CategoryGrid renders with real data
     │   CategoryCard(id=<uuid>, name="Fresh Vegetables", image=toApiAssetUrl(...))
     │
     ▼ Customer taps "Fresh Vegetables" CategoryCard
     │   handleCategoryClick("<uuid>") fires
     │   router.push("/category/<uuid>")
     │
     ▼ [Category Detail Page — /category/<uuid>]
     │   CategoryDetail mounts with categoryId="<uuid>"
     │   selectedCategory state = "<uuid>"
     │
     ├─► useCategory("<uuid>") → GET /api/categories/<uuid>
     │     categoryName = "Fresh Vegetables"
     │
     ├─► useCategories() → GET /api/categories (for sidebar)
     │     sidebarCategories = all categories mapped to { id, name, image }
     │
     └─► useProducts({ categoryId: "<uuid>", isAvailable: true, limit: 200 })
           → GET /api/products?categoryId=<uuid>&isAvailable=true&limit=200
     │
     ▼ isLoading=true → 6 Skeleton product cards render
     │
     ▼ API response arrives
     │   Only products with categoryId="<uuid>" returned
     │   isLoading=false
     │   ProductGrid renders with filtered products
     │
     ▼ Customer taps "Fresh Fruits" in CategorySidebar
     │   handleSidebarCategorySelect("<new-uuid>") fires
     │   setSelectedCategory("<new-uuid>")
     │   router.replace("/category/<new-uuid>")
     │
     ▼ useProducts re-fires with new categoryId
     │   Products refresh to "Fresh Fruits" only
     │
     ▼ Customer taps [+ Add] on a product
     │   handleAddToCart(productId) fires
     │   useCartStore.addItem(...)
     │
[CartBar updates — customer can proceed to checkout]
```

---

## 11. Accessibility

### Search Dialog

| Concern | Implementation |
|---------|----------------|
| Trigger button in `MobileHeader` | `SearchInput` gets `aria-label="Open product search"` and `aria-haspopup="dialog"` |
| Dialog role | Mantine `Modal` renders with `role="dialog"` and `aria-modal="true"` automatically |
| Dialog label | Mantine `Modal` can be given `aria-label="Product search"` via the `aria-label` prop on `<Modal>` |
| Initial focus | `SearchInput` inside the dialog receives `autoFocus` and `data-autofocus`; Mantine `Modal` also respects `data-autofocus` for focus management |
| Close on Escape | Mantine `Modal` handles `Escape` key by default — `onClose` fires |
| Close on backdrop | Mantine `Modal` fires `onClose` on backdrop click by default |
| Focus trap | Mantine `Modal` includes a built-in focus trap — Tab cycles only within the dialog |
| Focus restore | When the dialog closes, Mantine returns focus to the element that triggered the open (`SearchInput` in `MobileHeader`) |
| Search input label | `SearchInput` has `aria-label="Search products"` |
| Autocomplete hint | `SearchInput` has `aria-autocomplete="list"` and `aria-controls="search-results-list"` |
| Results list | `ScrollArea` wrapping results has `id="search-results-list"` (linked by `aria-controls` above) |
| Results list role | Outer `Stack` receives `role="list"` and `aria-label="Search results"` |
| Each result | `Box` receives `role="listitem"` |
| Add button | Each "Add" `ActionIcon` has `aria-label={"Add " + product.name + " to cart"}` |
| Clear button | `IconX` `ActionIcon` has `aria-label="Clear search"` |
| Back button | `IconArrowLeft` `ActionIcon` has `aria-label="Close search"` |
| Loading state | No additional `aria-live` region needed — results appear within the already-announced `role="list"` region |
| Empty state | Empty and idle messages are static text within the dialog; no special ARIA required |

### Admin Form (Category Form Page)

| Concern | Implementation |
|---------|----------------|
| Required field | `TextInput` for Name has `required` prop → renders `*` asterisk and `aria-required="true"` via Mantine |
| Error messages | Mantine `TextInput` with `error` prop renders `role="alert"` automatically |
| File input label | `FileInput` has explicit `label="Category Image"` — associated via `htmlFor` by Mantine |
| Form landmark | `<Form>` renders a `<form>` element — implicit landmark role |

### Admin DataTable (Categories List Page)

| Concern | Implementation |
|---------|----------------|
| Delete confirmation | `modals.openConfirmModal` renders a Mantine modal with `role="dialog"` and focus trap |
| Action buttons | `DataTable` action buttons include `title` or `aria-label` via the `label` property in the `actions` array |

### Web Category Browse

| Concern | Implementation |
|---------|----------------|
| CategoryCard buttons | `UnstyledButton` elements are keyboard accessible by default (Enter/Space activates) |
| Sidebar buttons | `UnstyledButton` elements in `CategorySidebar` are keyboard accessible |
| CategoryDetail header back button | `ActionIcon` with `aria-label` should be added: `aria-label="Go back to home"` |
| CategoryDetail search icon | `ActionIcon` with `aria-label="Search products"` |
| Skeleton loading | Skeletons are decorative; no additional ARIA attributes needed |

### Keyboard Navigation Summary — Search Dialog

```
Tab               → Move focus between: [← back] → [search input] → [× clear] → [first Add button] → ...
Shift+Tab         → Reverse focus direction (same elements)
Escape            → Close dialog, return focus to MobileHeader SearchInput
Enter (on Add)    → Adds product to cart (ActionIcon handles Enter natively)
Space (on Add)    → Adds product to cart (ActionIcon handles Space natively)
Arrow Up/Down     → Not implemented (no listbox; result rows are not `option` elements)
```

---

*End of UI Specification*
