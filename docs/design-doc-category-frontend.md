# Design Doc: Product Category Module + Search — Frontend

**Status:** Draft
**Date:** 2026-03-19
**Author:** technical-designer subagent
**PRD Reference:** `docs/prd-category-search.md`
**UI Spec Reference:** `docs/ui-spec/ui-spec-category-search.md`
**Scope:** `apps/admin` (React/Vite/Mantine) + `apps/web` (Next.js 16)

---

## 1. Overview

This document describes every frontend file that must be created or modified to ship the Product Category Module and Product Search feature. It is the authoritative reference for an engineer implementing this feature — every function name, hook call, state variable, import, and JSX pattern is specified against the actual existing code.

### Layers

**Admin layer (`apps/admin/`)** — React + Vite + Mantine. Uses custom hooks from `@shreehari/data-access` (the `libs/data-access/src/index.ts` hook barrel). State management is local `useState`/`useEffect` with manual `fetch`/`apiCall`. No React Query.

**Web layer (`apps/web/`)** — Next.js 16 App Router + Mantine. Uses TanStack Query (React Query v5) with hooks defined in `apps/web/src/hooks/use-api.ts`, services in `apps/web/src/lib/api/services.ts`, query keys in `apps/web/src/lib/query-client.ts`, and the axios `apiClient` from `apps/web/src/lib/api-client.ts`.

### Key Architectural Distinction

The admin app and the web app use **different data fetching patterns**:
- **Admin:** `useState` + `useEffect` custom hooks (imperative, `{ data, loading, error, refetch }` return shape) defined in `libs/data-access/src/index.ts`.
- **Web:** TanStack Query `useQuery`/`useMutation` hooks in `apps/web/src/hooks/use-api.ts` calling axios services in `apps/web/src/lib/api/services.ts`.

New category hooks must match the pattern of their respective layer.

---

## 2. Admin Layer — Files Changed

### 2.1 New: `apps/admin/src/pages/CategoriesPage.tsx`

**Purpose:** Renders the `/categories` admin list page. Mirrors `ProductsPage.tsx` structurally.

#### Imports

```typescript
import React, { useState, useEffect } from 'react';
import { Group, Text, Stack, Image, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { CategoryDto } from '@shreehari/types';
import {
  useCategories,
  useDeleteCategory,
  API_BASE_URL,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  SearchFilter,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';
```

`useCategories` and `useDeleteCategory` are new hooks to be added to `libs/data-access/src/index.ts` (see Section 4 for the hook signatures). `getImageUrl` is already exported from `@shreehari/utils` and used in `ProductsPage.tsx` for exactly the same thumbnail rendering purpose.

#### Component Signature

```typescript
export const CategoriesPage: React.FC = () => { ... }
```

#### State

```typescript
const [searchValue, setSearchValue] = useState('');
const [filtersExpanded, setFiltersExpanded] = useState(false);
```

No `page`/`limit` state. The PRD explicitly states pagination is not required for categories (expected to remain under 100). The `DataTable` renders all rows returned from `GET /api/categories`.

#### Data Hooks

```typescript
const {
  data: categoriesData,
  loading,
  error,
  refetch,
} = useCategories();
const { deleteCategory, loading: deleteLoading } = useDeleteCategory();
```

`categoriesData` is `CategoryDto[]` (flat array, not paginated — unlike `useProducts` which returns `{ products, total, totalPages }`).

#### Client-Side Search Filter

Search is client-side because `GET /api/categories` returns all categories in one response:

```typescript
const filteredCategories = (categoriesData ?? []).filter((cat) =>
  cat.name.toLowerCase().includes(searchValue.toLowerCase())
);
```

Pass `filteredCategories` to `DataTable`'s `data` prop.

#### DataTable Columns

Column type: `Column<CategoryDto>[]`

```typescript
const columns: Column<CategoryDto>[] = [
  {
    key: 'imageUrl',
    title: 'Image',
    render: (value) => (
      <Image
        src={getImageUrl(value)}
        w={48}
        h={48}
        radius="sm"
        fallbackSrc="https://via.placeholder.com/48"
      />
    ),
  },
  {
    key: 'name',
    title: 'Name',
    render: (value) => (
      <Text size="sm" fw={500}>{value}</Text>
    ),
  },
  {
    key: 'productCount',
    title: 'Products',
    render: (value) => (
      <Badge variant="outline">{value ?? 0}</Badge>
    ),
  },
  {
    key: 'createdAt',
    title: 'Created At',
    render: (value) => (
      <Text size="sm" c="dimmed">
        {new Date(value).toLocaleDateString('en-IN')}
      </Text>
    ),
  },
];
```

#### DataTable Actions

```typescript
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

No "View" action (no separate detail view for categories).

#### Delete Handler

Matches the exact `modals.openConfirmModal` pattern from `ProductsPage.tsx` line 70–98:

```typescript
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

#### PageHeader Config

```typescript
const headerActions: PageHeaderAction[] = [
  {
    label: 'New Category',
    variant: 'brand',
    leftSection: <IconPlus size={16} />,
    onClick: () => navigate('/categories/new'),
  },
];
```

#### SearchFilter Config

```tsx
<SearchFilter
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  searchPlaceholder="Search categories by name..."
  filters={[]}
  onFilterChange={() => {}}
  onClearFilters={() => { setSearchValue(''); }}
  filtersExpanded={filtersExpanded}
  onToggleFilters={setFiltersExpanded}
/>
```

No filter dropdowns (`filters={[]}`).

#### DataTable Props

```tsx
<DataTable
  data={filteredCategories}
  columns={columns}
  actions={actions}
  loading={loading || deleteLoading}
  emptyMessage="No categories found"
/>
```

#### Error State

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

### 2.2 New: `apps/admin/src/pages/CategoryFormPage.tsx`

**Purpose:** Renders both `/categories/new` (create mode) and `/categories/:id/edit` (edit mode). Mirrors `ProductFormPage.tsx` structurally.

#### Imports

```typescript
import React, { useState, useEffect } from 'react';
import { Stack, Grid, FileInput, Box, Image } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateCategoryDto, UpdateCategoryDto } from '@shreehari/types';
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
  API_BASE_URL,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';
```

#### Component Signature

```typescript
export const CategoryFormPage: React.FC = () => { ... }
```

#### Mode Detection

```typescript
const { id } = useParams<{ id: string }>();
const isEditing = Boolean(id);
```

Identical pattern to `ProductFormPage.tsx` line 36–37.

#### Form State Interface

```typescript
interface CategoryFormData {
  name: string;
  imageFile: File | null;
}
```

Initial state:

```typescript
const [formData, setFormData] = useState<CategoryFormData>({
  name: '',
  imageFile: null,
});
```

#### Data Hooks

```typescript
const { createCategory, loading: createLoading } = useCreateCategory();
const { updateCategory, loading: updateLoading } = useUpdateCategory();
const { data: existingCategory, loading: fetchLoading } = useCategory(id || '');

const loading = createLoading || updateLoading;
```

`useCategory` is guarded by `enabled: !!id` inside the hook so it does not fire in create mode.

#### Pre-population Effect (Edit Mode)

```typescript
useEffect(() => {
  if (isEditing && existingCategory) {
    setFormData({
      name: existingCategory.name,
      imageFile: null, // Cannot pre-populate File object from URL
    });
  }
}, [isEditing, existingCategory]);
```

#### updateFormData Helper

```typescript
const updateFormData = (field: keyof CategoryFormData, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};
```

Identical pattern to `ProductFormPage.tsx` line 142–144.

#### Submit Handler

```typescript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // Client-side 5 MB size validation
  if (formData.imageFile && formData.imageFile.size > 5 * 1024 * 1024) {
    notifications.show({
      title: 'Error',
      message: 'Image must be smaller than 5 MB',
      color: 'red',
    });
    return;
  }

  try {
    if (isEditing && id) {
      const updateData: UpdateCategoryDto = { name: formData.name };
      await updateCategory(id, updateData, formData.imageFile);
      notifications.show({
        title: 'Success',
        message: 'Category updated successfully',
        color: 'green',
      });
    } else {
      const createData: CreateCategoryDto = { name: formData.name };
      await createCategory(createData, formData.imageFile);
      notifications.show({
        title: 'Success',
        message: 'Category created successfully',
        color: 'green',
      });
    }
    navigate('/categories');
  } catch {
    notifications.show({
      title: 'Error',
      message: isEditing ? 'Failed to update category' : 'Failed to create category',
      color: 'red',
    });
  }
};
```

`createCategory(data, imageFile)` and `updateCategory(id, data, imageFile)` mirror the exact signatures of `useCreateProduct` and `useUpdateProduct` from `libs/data-access/src/index.ts` (lines 428–547). When `imageFile` is present, the hook builds `FormData` and sends `multipart/form-data`; otherwise it sends plain JSON. The field name for the file in `FormData` must be `'image'` to match the `categoryUpload.single('image')` multer middleware.

#### Form Actions

```typescript
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

No "Save & Add Another" action (not needed for categories, per UI spec).

#### JSX Structure

```tsx
return (
  <Stack gap="md">
    <PageHeader
      title={isEditing ? 'Edit Category' : 'Add New Category'}
      subtitle={isEditing ? 'Update category information' : 'Create a new product category'}
      actions={[]}
    />
    <Form
      title="Category Details"
      onSubmit={handleSubmit}
      actions={formActions}
      loading={loading}
      actionsPosition="right"
    >
      <Grid>
        {/* Name Field */}
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

        {/* Image Field */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <FormField>
            {/* Current image preview — edit mode only */}
            {isEditing && existingCategory?.imageUrl && !formData.imageFile && (
              <Box mb="xs">
                <Text size="xs" c="dimmed" mb={4}>Current image:</Text>
                <Image
                  src={getImageUrl(existingCategory.imageUrl)}
                  w={80}
                  h={80}
                  radius="sm"
                  fit="contain"
                />
              </Box>
            )}
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
      </Grid>
    </Form>
  </Stack>
);
```

Key differences from `ProductFormPage.tsx`: no `NumberInput`, no `Textarea`, no `Switch`, no `Select`. The form intentionally has just two fields.

---

### 2.3 Modified: `apps/admin/src/App.tsx`

**Change:** Add three `<Route>` entries and two new imports.

**Location:** Immediately after the existing product routes (after line 45: `<Route path="/products/:id/edit" element={<ProductFormPage />} />`).

**Imports to add** (after the existing product page imports on lines 14–15):

```typescript
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
```

**Routes to add** inside `<Routes>`:

```tsx
<Route path="/categories"          element={<CategoriesPage />} />
<Route path="/categories/new"      element={<CategoryFormPage />} />
<Route path="/categories/:id/edit" element={<CategoryFormPage />} />
```

The same `CategoryFormPage` component handles both create and edit; the `useParams<{ id: string }>()` call inside it determines the mode. React Router correctly resolves `/categories/new` before `/categories/:id/edit` since more specific static paths take precedence when listed first.

---

### 2.4 Modified: `apps/admin/src/components/Layout.tsx`

**Change:** Add `IconTag` to the import and insert a new navigation item.

**Import change** — add `IconTag` to the existing `@tabler/icons-react` import (line 6–14):

```typescript
import {
  IconDashboard,
  IconShoppingCart,
  IconBox,
  IconUsers,
  IconBuilding,
  IconHome,
  IconLogout,
  IconReceipt,
  IconTag,        // NEW
} from '@tabler/icons-react';
```

**Navigation array change** — insert after `{ icon: IconBox, label: 'Products', href: '/products' }` (currently line 23):

```typescript
const navigation = [
  { icon: IconDashboard,    label: 'Dashboard',       href: '/' },
  { icon: IconShoppingCart, label: 'Orders',          href: '/orders' },
  { icon: IconBox,          label: 'Products',        href: '/products' },
  { icon: IconTag,          label: 'Categories',      href: '/categories' },  // NEW
  { icon: IconUsers,        label: 'Customers',       href: '/customers' },
  { icon: IconReceipt,      label: 'Monthly Billing', href: '/monthly-billing' },
  { icon: IconHome,         label: 'Societies',       href: '/societies' },
  { icon: IconBuilding,     label: 'Buildings',       href: '/buildings' },
];
```

No changes to the rendering logic. The existing `isActive = location.pathname === item.href` check (line 66) correctly highlights the "Categories" nav item when on any `/categories` path — note this only matches exactly `/categories`, not `/categories/new` or `/categories/:id/edit`. This is acceptable: the existing nav items for Products, Customers, etc. behave identically (they do not highlight on sub-paths).

---

### 2.5 Modified: `apps/admin/src/pages/ProductFormPage.tsx`

**Purpose:** Add a Category `Select` field to the product create/edit form and include `categoryId` in both the create and update payloads.

#### FormData Interface Update

Add `categoryId: string | null` to the `ProductFormData` interface (line 24–32):

```typescript
interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description: string;
  isAvailable: boolean;
  imageFile: File | null;
  categoryId: string | null;  // NEW
}
```

Update the initial `useState` default (line 39–47) to add `categoryId: null`.

#### New Hook Import

Add `useCategories` to the `@shreehari/data-access` import block (line 8–11):

```typescript
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
  useCategories,   // NEW
} from '@shreehari/data-access';
```

#### Hook Call

Add immediately after the existing hook declarations (after line 60):

```typescript
const { data: categoriesData, loading: categoriesLoading } = useCategories();
```

#### Category Select Field in JSX

Add as a new `<Grid.Col>` immediately before the existing Description `<Grid.Col>` (currently at line 292 — the `span={12}` textarea column). Span `{ base: 12, md: 4 }`:

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

The `Select` component is already imported from `@shreehari/ui` at line 17.

#### Pre-population Effect Update

In the `useEffect` at line 65–77, add `categoryId`:

```typescript
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
      categoryId: existingProduct.categoryId ?? null,  // NEW
    });
  }
}, [isEditing, existingProduct]);
```

#### Submit Payload Updates

In `handleSubmit` (line 79–124), add `categoryId` to both payloads:

```typescript
// Create path (line 99–105):
const createData: CreateProductDto = {
  name: formData.name,
  price: formData.price,
  quantity: formData.quantity,
  unit: formData.unit,
  description: formData.description || undefined,
  categoryId: formData.categoryId ?? undefined,   // NEW
};

// Update path (line 84–91):
const updateData: UpdateProductDto = {
  name: formData.name,
  price: formData.price,
  quantity: formData.quantity,
  unit: formData.unit,
  description: formData.description || undefined,
  isAvailable: formData.isAvailable,
  categoryId: formData.categoryId ?? undefined,   // NEW
};
```

Also update `handleSaveAndAddAnother` (line 147–172) to include `categoryId: formData.categoryId ?? undefined` in `productData`.

The `useCreateProduct` and `useUpdateProduct` hooks in `libs/data-access/src/index.ts` already use `FormData` when an image file is present. When `categoryId` is added to the payload object but no image file exists, it goes through the JSON path and is included automatically. When an image file is present, `categoryId` must also be appended to `FormData`:

```typescript
// In useCreateProduct hook (libs/data-access/src/index.ts), inside the FormData branch:
if (productData.categoryId) {
  formData.append('categoryId', productData.categoryId);
}
```

This change belongs in `libs/data-access/src/index.ts`, not `ProductFormPage.tsx` — but is noted here since it affects the form's behavior.

---

### 2.6 Modified: `apps/admin/src/pages/ProductsPage.tsx`

**Purpose:** Add a Category column to the data table and a Category filter dropdown.

#### filters State Update

Extend the existing `useState` call (line 38–41):

```typescript
const [filters, setFilters] = useState({
  unit: '',
  isAvailable: '',
  categoryId: '',    // NEW
});
```

#### New Hook Import

Add `useCategories` to the `@shreehari/data-access` import (line 14–19):

```typescript
import {
  useProducts,
  useDeleteProduct,
  useToggleProductAvailability,
  useCategories,   // NEW
  API_BASE_URL,
} from '@shreehari/data-access';
```

#### Hook Call

Add after the existing hook declarations:

```typescript
const { data: categoriesData } = useCategories();
```

No loading/error destructuring needed for the filter dropdown — showing an empty select while categories load is acceptable.

#### useProducts Call Update

The existing `useProducts` call (line 43–55) must pass `categoryId`:

```typescript
const {
  data: productsData,
  loading,
  error,
  refetch,
} = useProducts(
  page,
  limit,
  searchValue || undefined,
  filters.unit || undefined,
  filters.isAvailable !== '' ? filters.isAvailable === 'true' : undefined,
  filters.categoryId || undefined    // NEW 6th argument
);
```

The `useProducts` hook in `libs/data-access/src/index.ts` (line 343–396) currently has signature `(page, limit, search?, unit?, isAvailable?)`. Adding `categoryId` as a 6th optional parameter must be done in that hook file too — it appends `?categoryId=<uuid>` to the query string when provided.

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

#### useEffect Dependency Update

The `useEffect` that resets page on filter change (line 64–67) must include `filters.categoryId`:

```typescript
useEffect(() => {
  setPage(1);
}, [searchValue, filters.unit, filters.isAvailable, filters.categoryId]);  // add categoryId
```

#### filterOptions Array Update

Add after the existing `isAvailable` entry (line 253–263):

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

#### Category Column in DataTable

Add to the `columns` array after the `isAvailable` status column (line 307–319):

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

`key: 'categoryName'` matches the `categoryName` field that `ProductDto` gains after the types update in `libs/types/src/index.ts`. Renders an em dash (`—`) when no category is assigned.

---

## 3. Web Layer — Files Changed

### 3.1 New: `apps/web/src/components/ProductSearchDialog.tsx`

**Purpose:** Full-screen search dialog opened from `MobileHeader`. New file.

#### Props Interface

```typescript
interface ProductSearchDialogProps {
  opened: boolean;
  onClose: () => void;
}
```

#### State

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `searchQuery` | `string` | `''` | Controlled value for the visible search input |
| `debouncedQuery` | `string` | `''` | Debounced (300 ms) version — only this value triggers the API call |

```typescript
const [searchQuery, setSearchQuery] = React.useState('');
const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
```

`useDebouncedValue` is from `@mantine/hooks` (already a project dependency used in `apps/web`).

#### Hooks

```typescript
const addItem = useCartStore((state) => state.addItem);

const { data: productsResponse, isLoading } = useProducts(
  { search: debouncedQuery, isAvailable: true, limit: 30 },
  { enabled: debouncedQuery.length >= 2 }
);

const products = productsResponse?.data ?? [];
```

`useProducts` in `apps/web/src/hooks/use-api.ts` (line 45–53) already accepts a params object `PaginationParams & { unit?: string; isAvailable?: boolean }`. The `search` key already exists in `PaginationParams` (defined in `services.ts` line 22–26). `categoryId` is not needed here. The `enabled` option disables the query when the debounced query is fewer than 2 characters.

The `productsResponse` shape is `PaginatedResponse<any>` where `productsResponse.data` is the array of products. This matches the `productsApi.getAll()` response used elsewhere in `root.tsx` (line 81).

#### Reset on Close Effect

```typescript
useEffect(() => {
  if (!opened) {
    setSearchQuery('');
  }
}, [opened]);
```

The dialog is conditionally mounted (`{searchOpened && <ProductSearchDialog ... />}`), so this effect primarily handles the case where `opened` transitions from `true` to `false` without unmounting (not the current pattern, but defensive).

#### handleAddToCart

Exact field mapping from `CategoryDetail.tsx` lines 91–109:

```typescript
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
```

No `selectedVariant`, `quantity`, or `discount` field.

#### Dialog States

| Condition | UI Shown |
|---|---|
| `debouncedQuery.length < 2` | Centered: "Search for products…" + "Type at least 2 characters to see results" |
| `debouncedQuery.length >= 2 && isLoading` | Centered `<Loader size="md" color={colors.primary} />` |
| `debouncedQuery.length >= 2 && !isLoading && products.length === 0` | Centered: `No products found for "<debouncedQuery>"` |
| `debouncedQuery.length >= 2 && !isLoading && products.length > 0` | Scrollable result rows |

#### Result Row Layout

Each result row renders (left to right):
1. Product image: 56×56 px box, `borderRadius: radius.sm`, `backgroundColor: colors.surface`, `Image` component with `fit="contain"` and `withPlaceholder`
2. Product name: `size="sm"`, `fw={typography.fontWeight.semibold}`, single-line truncated (`overflow: 'hidden'`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'`)
3. Unit string: `"{product.quantity}{product.unit}"`, `size="xs"`, `variant="secondary"`
4. Price: `"₹{product.price}"`, `size="sm"`, `fw={typography.fontWeight.bold}`
5. Add button: `ActionIcon` size `36`, `variant="outline"`, `IconPlus size={18}`, `borderColor: colors.primary`, `color: colors.primary`

#### Modal Config

```tsx
<Modal
  opened={opened}
  onClose={onClose}
  fullScreen
  withCloseButton={false}
  padding={0}
  aria-label="Product search"
  styles={{
    body: { height: '100%', display: 'flex', flexDirection: 'column' },
    content: { height: '100dvh' },
  }}
>
```

`fullScreen` is a Mantine `Modal` prop that makes the modal fill the viewport. `withCloseButton={false}` removes the built-in X button — the back arrow `ActionIcon` inside the dialog header serves as the close trigger. Mantine `Modal` handles Escape key and backdrop click via its default behavior, calling `onClose` in both cases.

#### Full Imports

```typescript
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
```

`Text`, `SearchInput`, and `Image` are imported from `'./ui'` (the local design system components), not from `@mantine/core` — this matches the pattern used in `CategoryDetail.tsx` and `MobileHeader.tsx`.

#### Accessibility Attributes

All ARIA attributes per the UI spec:
- `Modal`: `aria-label="Product search"`
- Back button `ActionIcon`: `aria-label="Close search"`
- Search `SearchInput`: `aria-label="Search products"`, `aria-autocomplete="list"`, `aria-controls="search-results-list"`
- Clear `ActionIcon`: `aria-label="Clear search"`
- `ScrollArea`: `id="search-results-list"`
- Results `Stack`: `role="list"`, `aria-label="Search results"`
- Each result `Box`: `role="listitem"`
- Add `ActionIcon`: `aria-label={\`Add \${product.name} to cart\`}`

---

### 3.2 Modified: `apps/web/src/hooks/use-api.ts`

**Purpose:** Add `useCategories` and `useCategory` hooks following the existing pattern. Also update `useProducts` params type to include `categoryId` and `search`.

#### useProducts Signature Update

The existing `useProducts` signature (line 45–53) currently accepts `PaginationParams & { unit?: string; isAvailable?: boolean }`. The `PaginationParams` type (defined in `services.ts`) already includes `search?: string`. Add `categoryId` to the intersection type:

```typescript
export const useProducts = (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean; categoryId?: string },
  options?: QueryHookOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getAll(params),
    ...options,
  });
};
```

`productsApi.getAll(params)` already passes the params object to axios as query params (line 85–88 in `services.ts`). Adding `categoryId` to the params object automatically includes it in the URL query string.

#### New: categoriesApi Import

Add to the existing import block at line 17–22:

```typescript
import {
  productsApi,
  ordersApi,
  customersApi,
  buildingsApi,
  authApi,
  categoriesApi,   // NEW
} from '../lib/api/services';
```

#### New: useCategories Hook

Add after the `useToggleProductAvailability` hook (after line 136), before the Orders section:

```typescript
/**
 * Categories Hooks
 */

export const useCategories = (
  options?: QueryHookOptions<ApiResponse<any[]>>
) => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoriesApi.getAll(),
    ...options,
  });
};

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

**Return type of `useCategories`:** `useQuery` returns the TanStack Query result object. The `data` field will be `ApiResponse<CategoryDto[]>` — i.e., `{ success: boolean; data: CategoryDto[] }`. Callers access the array via `categoriesResponse?.data ?? []`.

This differs from `useProducts` which returns `PaginatedResponse<any>` (with `.data`, `.total`, `.page`, etc.). `useCategories` uses the flat `ApiResponse<T[]>` envelope — the same shape as `societiesApi.getAll()` in `services.ts` (line 281).

**Return type of `useCategory`:** `ApiResponse<CategoryDto>`. Callers access the object via `categoryResponse?.data`.

---

### 3.3 Modified: `apps/web/src/lib/api/services.ts`

**Purpose:** Add `categoriesApi` service object.

Add after the `productsApi` block (after line 137), before the `ordersApi` block:

```typescript
/**
 * Categories API Service
 */
export const categoriesApi = {
  /**
   * Get all categories (flat list, no pagination)
   */
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/categories');
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/categories/${id}`);
    return response.data;
  },
};
```

**Critical:** `categoriesApi.getAll()` uses `ApiResponse<any[]>` (NOT `PaginatedResponse<any>`). The `GET /api/categories` endpoint returns `{ success: true, data: CategoryDto[] }` — a flat array, not a paginated envelope. This mirrors `societiesApi.getAll()` which also uses `ApiResponse<any[]>` for a flat list endpoint.

Also update `productsApi.getAll` to include `categoryId` in the params type:

```typescript
getAll: async (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean; categoryId?: string }
) => {
  const response = await apiClient.get<PaginatedResponse<any>>('/products', {
    params,
  });
  return response.data;
},
```

---

### 3.4 Modified: `apps/web/src/lib/query-client.ts`

**Purpose:** Add `queryKeys.categories` following the existing pattern.

Add inside the `queryKeys` object (after the `buildings` block, before the closing comment on line 90):

```typescript
// Categories
categories: {
  all: ['categories'] as const,
  lists: () => [...queryKeys.categories.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...queryKeys.categories.lists(), filters] as const,
  details: () => [...queryKeys.categories.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.categories.details(), id] as const,
},
```

The `useCategories` hook uses `queryKeys.categories.lists()` (not `list(params)`) because there are no filter params for the category list — it always fetches all categories. The `useCategory(id)` hook uses `queryKeys.categories.detail(id)`.

---

### 3.5 Modified: `apps/web/src/app/components/root.tsx`

**Purpose:** Replace the static `categories` array (lines 14–64) with a live API fetch using `useCategories`.

#### Remove

Delete the entire `const categories = [...]` block (lines 15–64). This removes 8 hardcoded category objects with Swiggy CDN image URLs.

#### New Import

Add to the existing imports:

```typescript
import { useCategories } from '../../hooks/use-api';
import { Skeleton, SimpleGrid, Box } from '@mantine/core';
import { colors, spacing, typography } from '../../theme';
```

`Skeleton`, `Box` are from `@mantine/core`. `colors`, `spacing`, `typography` are already imported via `../../theme` in `CategoryDetail.tsx` and can be added to `root.tsx`'s existing theme import if needed.

#### Inside HomeRoot Component

Add after the `const addItem = useCartStore(...)` line:

```typescript
const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

const categories = (categoriesResponse?.data ?? []).map((cat: any) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));
```

`toApiAssetUrl` is already imported (line 12). `toApiAssetUrl(null)` and `toApiAssetUrl(undefined)` return the placeholder fallback URL — no null check needed.

#### Replace CategoryGrid with Conditional Block

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

Skeleton count `8` matches the previous hardcoded array length. `SimpleGrid` cols match the `CategoryGrid` default grid layout.

#### handleCategoryClick — No Change

```typescript
const handleCategoryClick = (categoryId: string) => {
  router.push(`/category/${categoryId}`);
};
```

This handler is unchanged. After the migration, `categoryId` will be the real UUID from the API.

---

### 3.6 Modified: `apps/web/src/components/category/CategoryDetail.tsx`

**Purpose:** Remove `MOCK_CATEGORIES`, connect to real API via `useCategory` + `useCategories`, add `categoryId` filter to `useProducts`, and wire the `IconSearch` button to open `ProductSearchDialog`.

#### Remove

Delete the entire `MOCK_CATEGORIES` array (lines 17–53). Remove the `categoryName` derivation using `MOCK_CATEGORIES.find(...)` (line 89).

#### New Imports

```typescript
import { useDisclosure } from '@mantine/hooks';
import { Skeleton, SimpleGrid } from '@mantine/core';
import { useCategories, useCategory } from '../../hooks/use-api';
import { ProductSearchDialog } from '../ProductSearchDialog';
```

`useDisclosure` is already imported in `apps/admin/src/components/Layout.tsx`. `@mantine/hooks` is already a dependency.

#### New Hooks Inside Component

Add after the existing `addItem` and `hasCartItems` declarations:

```typescript
// Fetch the currently selected category's details
const { data: categoryResponse, isLoading: categoryLoading } = useCategory(selectedCategory);

// Fetch all categories for the sidebar
const { data: allCategoriesResponse } = useCategories();

// Disclosure for ProductSearchDialog
const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
```

#### categoryName Derivation

Replace the old `MOCK_CATEGORIES.find(...)` line:

```typescript
const categoryName = categoryResponse?.data?.name ?? 'Category';
```

#### useProducts Call — Add categoryId and Increase limit

Replace the existing `useProducts` call (lines 68–72):

```typescript
// BEFORE:
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
  categoryId: selectedCategory,  // NEW — filters products to this category only
});
```

`selectedCategory` is already `useState`-managed (`const [selectedCategory, setSelectedCategory] = useState(categoryId || '1')`). With real data, the initial value `'1'` must be replaced with the prop: `useState(categoryId)`.

Update the initial state declaration (line 61):
```typescript
// BEFORE:
const [selectedCategory, setSelectedCategory] = useState(categoryId || '1');
// AFTER:
const [selectedCategory, setSelectedCategory] = useState(categoryId);
```

#### sidebarCategories Derivation

Add before the `handleAddToCart` function:

```typescript
const sidebarCategories = (allCategoriesResponse?.data ?? []).map((cat: any) => ({
  id: cat.id,
  name: cat.name,
  image: toApiAssetUrl(cat.imageUrl),
}));
```

#### handleSidebarCategorySelect Handler

The existing `CategorySidebar` passes `onSelectCategory={setSelectedCategory}` (line 165). Replace with a proper handler:

```typescript
const handleSidebarCategorySelect = (newCategoryId: string) => {
  setSelectedCategory(newCategoryId);
  router.replace(`/category/${newCategoryId}`);
};
```

Use `router.replace` (not `router.push`) to avoid polluting the history stack.

Update the `CategorySidebar` JSX (line 162–166):

```tsx
<CategorySidebar
  categories={sidebarCategories}           // was: MOCK_CATEGORIES
  selectedCategoryId={selectedCategory}
  onSelectCategory={handleSidebarCategorySelect}  // was: setSelectedCategory
/>
```

#### Category Name Loading Skeleton

In the header JSX (line 148–150), replace the plain text with a conditional skeleton:

```tsx
<Text size="lg" fw={typography.fontWeight.bold} variant="primary">
  {categoryLoading ? <Skeleton height={20} width={120} /> : categoryName}
</Text>
```

#### Products Loading Skeleton

Replace the `ProductGrid` render with a conditional block:

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

#### Wire IconSearch to ProductSearchDialog

Replace the existing inert `<ActionIcon>` (line 153–155):

```tsx
// BEFORE:
<ActionIcon variant="transparent" color="dark">
  <IconSearch size={24} />
</ActionIcon>

// AFTER:
<ActionIcon
  variant="transparent"
  color="dark"
  onClick={openSearch}
  aria-label="Search products"
>
  <IconSearch size={24} />
</ActionIcon>
```

Add at the bottom of the component's return statement, just before the closing `</Box>`:

```tsx
{searchOpened && (
  <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
)}
```

---

### 3.7 Modified: `apps/web/src/components/MobileHeader.tsx`

**Purpose:** Wire the read-only `SearchInput` to open `ProductSearchDialog` via `useDisclosure`.

#### New Imports

```typescript
import { useDisclosure } from '@mantine/hooks';
import { ProductSearchDialog } from './ProductSearchDialog';
```

#### Inside MobileHeader Function

Add at the top of the function body:

```typescript
const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
```

#### SearchInput Update

Replace the existing inert `<SearchInput>` (line 99):

```tsx
// BEFORE:
<SearchInput placeholder='Search for "Grapes"' size="md" />

// AFTER:
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
```

`readOnly` prevents the mobile keyboard from appearing before the full-screen dialog opens. The actual editable input is inside `ProductSearchDialog`. `SearchInput` extends `TextInputProps` (from `@mantine/core`) which includes all standard HTML input attributes including `readOnly`, `onClick`, and `onFocus`.

#### Conditionally Mount ProductSearchDialog

Add at the bottom of the `MobileHeader` return, inside the outer `<Box>`:

```tsx
{/* Search Dialog — conditionally mounted to reset state on each open */}
{searchOpened && (
  <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
)}
```

Conditional mounting (`{searchOpened && ...}`) ensures `searchQuery` state in `ProductSearchDialog` resets to `''` every time the dialog opens, since the component unmounts when closed.

---

## 4. Shared TypeScript Types

**File:** `libs/types/src/index.ts`

This change is a backend/shared-library concern but directly affects all frontend imports. The following types must be added/extended before any frontend work can be type-checked.

### New Types to Add

```typescript
export interface CategoryDto {
  id: string;
  name: string;
  imageUrl?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
```

### ProductDto Extensions

Add to the existing `ProductDto` interface:

```typescript
categoryId?: string | null;
categoryName?: string | null;
```

### CreateProductDto / UpdateProductDto Extensions

Add to both:

```typescript
categoryId?: string | null;
```

### How Admin and Web Access These

- **Admin (`apps/admin`):** Imports `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` from `@shreehari/types` (TypeScript path alias configured in `tsconfig.base.json`). The new category hooks in `libs/data-access/src/index.ts` use these types for their return values and parameters.
- **Web (`apps/web`):** Imports `CategoryDto` from `@shreehari/types` for type annotations in `use-api.ts` and `ProductSearchDialog.tsx`. The axios response generics in `services.ts` use `any` currently (matching existing patterns), so `CategoryDto` is used for explicit casts where needed.

---

## 5. Implementation Order

Dependencies flow from shared libraries to apps. The following order ensures each file can be compiled cleanly when implemented.

### Phase 1 — Shared Types and Data Layer (Backend team delivers, frontend unblocked after)

1. `libs/types/src/index.ts` — Add `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto`; extend `ProductDto`, `CreateProductDto`, `UpdateProductDto` with `categoryId`/`categoryName` fields.
2. `libs/data-access/src/index.ts` — Add `useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` hooks (admin-layer hooks using the same `useState`/`useEffect`/`apiCall` pattern as existing hooks). Also update `useProducts` to accept `categoryId` as a 6th argument and include it in the `URLSearchParams`.

### Phase 2 — Web Services and Query Keys (unblocks web hooks)

3. `apps/web/src/lib/query-client.ts` — Add `queryKeys.categories`.
4. `apps/web/src/lib/api/services.ts` — Add `categoriesApi`; extend `productsApi.getAll` type.

### Phase 3 — Web Hooks (unblocks all web components)

5. `apps/web/src/hooks/use-api.ts` — Add `useCategories`, `useCategory`; update `useProducts` params type.

### Phase 4 — New Components

6. `apps/web/src/components/ProductSearchDialog.tsx` — New file. No upstream dependencies beyond Phase 3.
7. `apps/admin/src/pages/CategoriesPage.tsx` — New file. Depends on Phase 2 admin hooks.
8. `apps/admin/src/pages/CategoryFormPage.tsx` — New file. Depends on Phase 2 admin hooks.

### Phase 5 — Modified Existing Files

9. `apps/web/src/components/MobileHeader.tsx` — Depends on `ProductSearchDialog` (Phase 4).
10. `apps/web/src/components/category/CategoryDetail.tsx` — Depends on web hooks (Phase 3) and `ProductSearchDialog` (Phase 4).
11. `apps/web/src/app/components/root.tsx` — Depends on web hooks (Phase 3).
12. `apps/admin/src/pages/ProductFormPage.tsx` — Depends on Phase 2 admin hooks.
13. `apps/admin/src/pages/ProductsPage.tsx` — Depends on Phase 2 admin hooks.
14. `apps/admin/src/components/Layout.tsx` — No upstream dependencies; can be done anytime.
15. `apps/admin/src/App.tsx` — Depends on `CategoriesPage` and `CategoryFormPage` (Phase 4).

---

## 6. Testing Considerations

### Admin — CategoriesPage

- Render with empty `categoriesData` → verify `DataTable` shows "No categories found" empty state.
- Render with `loading=true` → verify `DataTable` renders loading overlay (not skeleton rows).
- Render with `error` set → verify error text is shown inside the `Stack` layout.
- Type into `SearchFilter` search input → verify `filteredCategories` narrows correctly (client-side filter on `name`).
- Click Edit action on a category row → verify `navigate('/categories/<id>/edit')` is called.
- Click Delete action → verify `modals.openConfirmModal` fires; confirm in modal → verify `deleteCategory(id)` called, then `refetch()`.

### Admin — CategoryFormPage

- Mount with no `id` param → verify `PageHeader` title is "Add New Category", submit button label is "Save Category".
- Mount with `id` param → verify `PageHeader` title is "Edit Category", form pre-populates from `useCategory(id)`.
- Submit with `imageFile` set → verify `FormData` is constructed with fields `name` and `image`; verify `multipart/form-data` header is absent (browser sets it).
- Submit with no `imageFile` → verify plain JSON `{ name }` is sent.
- Submit with `imageFile.size > 5 * 1024 * 1024` → verify `notifications.show` fires with error message and `createCategory`/`updateCategory` is NOT called.
- Successful submit → verify `navigate('/categories')` is called and success notification fires.

### Admin — ProductFormPage (Category addition)

- Mount in edit mode with a product that has `categoryId` set → verify `Select` shows the correct category pre-selected.
- Mount in edit mode with `categoryId: null` → verify `Select` shows placeholder "Select category (optional)".
- Clear the `Select` → verify `formData.categoryId` becomes `null`.
- Submit → verify `categoryId` is included in the payload (as `undefined` if null, or as the UUID string if selected).

### Web — ProductSearchDialog

- Open dialog → verify `SearchInput` receives `autoFocus`; initial state shows idle message.
- Type 1 character → verify no API call fires (debounce guard + `enabled: debouncedQuery.length >= 2`).
- Type 2+ characters → wait 300 ms → verify `useProducts` query fires with `{ search: debouncedQuery, isAvailable: true, limit: 30 }`.
- Tap "Add" on a result → verify `useCartStore.addItem` is called with the correct field mapping (no `selectedVariant`, no `discount`).
- Press Escape → verify `onClose` fires.
- Click backdrop → verify `onClose` fires.
- Close and re-open → verify `searchQuery` is reset to `''` (component unmounts/remounts due to conditional mounting).

### Web — root.tsx (Dynamic Categories)

- Mount while `categoriesLoading=true` → verify 8 `Skeleton` boxes render inside the `SimpleGrid`.
- Mount with empty `categoriesResponse.data` → verify empty state text "No categories available yet." renders.
- Mount with categories data → verify `CategoryGrid` renders with correct `{ id, name, image }` objects; `image` uses `toApiAssetUrl(imageUrl)` not a raw CDN URL.
- Click a category card → verify `router.push('/category/<uuid>')` is called with the real UUID (not an old slug like `'fresh-vegetables'`).

### Web — CategoryDetail.tsx (Dynamic Products)

- Mount with `categoryId='<uuid>'` → verify `useCategory('<uuid>')` fires, `useCategories()` fires, and `useProducts({ categoryId: '<uuid>', isAvailable: true, limit: 200 })` fires.
- While `isLoading=true` → verify 6 `Skeleton` cards render in a `SimpleGrid`.
- Tap a category in `CategorySidebar` → verify `setSelectedCategory(newId)` and `router.replace('/category/<newId>')` both fire.
- Click `IconSearch` button → verify `ProductSearchDialog` mounts with `opened=true`.
- Close `ProductSearchDialog` → verify it unmounts.

### Web — MobileHeader.tsx

- Click `SearchInput` → verify `openSearch()` fires → `searchOpened=true` → `ProductSearchDialog` mounts.
- Tab to focus `SearchInput` (keyboard navigation) → verify `onFocus={openSearch}` fires.
- `ProductSearchDialog` close → verify `searchOpened=false` → dialog unmounts.
- Verify `SearchInput` has `readOnly` prop (no mobile keyboard on click).

### Type Safety

- Run `nx lint` — zero `any` type violations in new files (where practical; the existing `any` pattern in hooks is pre-existing).
- Run TypeScript compilation (`tsc --noEmit`) for both `apps/admin` and `apps/web` after all changes.
- Verify `CategoryDto` from `@shreehari/types` is used for all explicit type annotations in new code.
