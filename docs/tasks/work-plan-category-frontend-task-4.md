# Frontend Task 4 — Admin Categories Pages

**Track:** Admin Frontend
**Depends on:** Task 2 (admin hooks), Task 3 (API routes live)
**Blocks:** Task 5

---

## Objective

Create the two new admin pages for managing product categories and wire them into the application shell:

1. `CategoriesPage` — paginated-less list with image thumbnail, name, product count, created date, Edit/Delete actions, and client-side search.
2. `CategoryFormPage` — shared create/edit form with a name text input and optional image upload; edit mode pre-populates from the API.
3. Register three routes in `App.tsx`.
4. Add a "Categories" navigation item to `Layout.tsx`.

---

## Files Changed

| File | Status |
|------|--------|
| `apps/admin/src/pages/CategoriesPage.tsx` | New |
| `apps/admin/src/pages/CategoryFormPage.tsx` | New |
| `apps/admin/src/App.tsx` | Modified |
| `apps/admin/src/components/Layout.tsx` | Modified |

---

## Implementation Steps

### Step 1 — `apps/admin/src/pages/CategoriesPage.tsx` (new file)

Mirror the structure of `ProductsPage.tsx`. Key specifics:

#### Imports
```typescript
import React, { useState } from 'react';
import { Group, Text, Stack, Image, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { CategoryDto } from '@shreehari/types';
import { useCategories, useDeleteCategory } from '@shreehari/data-access';
import {
  DataTable, PageHeader, SearchFilter,
  type Column, type DataTableAction, type PageHeaderAction,
} from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';
```

#### State
```typescript
const [searchValue, setSearchValue] = useState('');
const [filtersExpanded, setFiltersExpanded] = useState(false);
```

No `page`/`limit` state — all categories are rendered at once.

#### Hooks
```typescript
const { data: categoriesData, loading, error, refetch } = useCategories();
const { deleteCategory, loading: deleteLoading } = useDeleteCategory();
```

#### Client-side filtering
```typescript
const filteredCategories = (categoriesData ?? []).filter((cat) =>
  cat.name.toLowerCase().includes(searchValue.toLowerCase())
);
```

#### DataTable columns (`Column<CategoryDto>[]`)
| key | title | render |
|-----|-------|--------|
| `imageUrl` | `'Image'` | `<Image src={getImageUrl(value)} w={48} h={48} radius="sm" fallbackSrc="https://via.placeholder.com/48" />` |
| `name` | `'Name'` | `<Text size="sm" fw={500}>{value}</Text>` |
| `productCount` | `'Products'` | `<Badge variant="outline">{value ?? 0}</Badge>` |
| `createdAt` | `'Created At'` | `<Text size="sm" c="dimmed">{new Date(value).toLocaleDateString('en-IN')}</Text>` |

#### DataTable actions
- Edit: `navigate('/categories/${category.id}/edit')`
- Delete: call `handleDeleteCategory(category)`

#### Delete handler
Use `modals.openConfirmModal` (same pattern as `ProductsPage.tsx`):
- Title: `'Delete Category'`
- Body text: `'Are you sure you want to delete <strong>{category.name}</strong>? Products in this category will become uncategorized. This action cannot be undone.'`
- Confirm label: `'Delete'`, color: `'red'`
- On confirm: call `deleteCategory(category.id)` → `notifications.show` success → `refetch()`; catch → error notification.

#### PageHeader
- Title: `'Categories'`, subtitle: `'Manage product categories'`
- Action: `{ label: 'New Category', variant: 'brand', leftSection: <IconPlus size={16} />, onClick: () => navigate('/categories/new') }`

#### SearchFilter
- `searchPlaceholder="Search categories by name..."`
- `filters={[]}` — no dropdowns
- `onClearFilters={() => setSearchValue('')`

#### DataTable props
- `data={filteredCategories}`
- `loading={loading || deleteLoading}`
- `emptyMessage="No categories found"`

#### Error state
If `error`, render `PageHeader` + `<Text c="red">Error loading categories: {error}</Text>` inside a `<Stack>`.

---

### Step 2 — `apps/admin/src/pages/CategoryFormPage.tsx` (new file)

Mirror the structure of `ProductFormPage.tsx`. Key specifics:

#### Imports
```typescript
import React, { useState, useEffect } from 'react';
import { Stack, Grid, FileInput, Box, Image, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateCategoryDto, UpdateCategoryDto } from '@shreehari/types';
import { useCreateCategory, useUpdateCategory, useCategory } from '@shreehari/data-access';
import { Form, FormField, TextInput, PageHeader, type FormAction } from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';
```

#### Mode detection
```typescript
const { id } = useParams<{ id: string }>();
const isEditing = Boolean(id);
```

#### Form state interface
```typescript
interface CategoryFormData {
  name: string;
  imageFile: File | null;
}
const [formData, setFormData] = useState<CategoryFormData>({ name: '', imageFile: null });
```

#### Hooks
```typescript
const { createCategory, loading: createLoading } = useCreateCategory();
const { updateCategory, loading: updateLoading } = useUpdateCategory();
const { data: existingCategory, loading: fetchLoading } = useCategory(id || '');
const loading = createLoading || updateLoading;
```

`useCategory` is guarded by `enabled: !!id` internally — it does not fire when `id` is empty.

#### Pre-population effect (edit mode)
```typescript
useEffect(() => {
  if (isEditing && existingCategory) {
    setFormData({ name: existingCategory.name, imageFile: null });
  }
}, [isEditing, existingCategory]);
```

#### Helper
```typescript
const updateFormData = (field: keyof CategoryFormData, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};
```

#### Submit handler
1. Client-side 5 MB image size check → error notification, early return.
2. If editing: `await updateCategory(id, { name: formData.name }, formData.imageFile)` → success notification.
3. If creating: `await createCategory({ name: formData.name }, formData.imageFile)` → success notification.
4. On success: `navigate('/categories')`.
5. On catch: error notification.

#### Form actions
```typescript
const formActions: FormAction[] = [
  { label: 'Cancel', variant: 'outline', onClick: () => navigate('/categories'), disabled: loading },
  { label: isEditing ? 'Update Category' : 'Save Category', variant: 'brand', type: 'submit', loading },
];
```

#### JSX field layout (inside `<Form>` → `<Grid>`)
- **Name field** — `<Grid.Col span={{ base: 12, md: 8 }}>` → `<TextInput label="Category Name" placeholder="e.g. Fresh Vegetables" required maxLength={100} ... />`
- **Image field** — `<Grid.Col span={{ base: 12, md: 8 }}>`:
  - Current image preview (edit mode only, when `existingCategory?.imageUrl` and no new file): `<Image src={getImageUrl(existingCategory.imageUrl)} w={80} h={80} radius="sm" fit="contain" />`
  - `<FileInput label="Category Image" placeholder="Upload category image (optional)" leftSection={<IconUpload size={14} />} accept="image/jpeg,image/png,image/webp,image/gif" clearable ... />`

#### PageHeader titles
- Create: `'Add New Category'` / `'Create a new product category'`
- Edit: `'Edit Category'` / `'Update category information'`

---

### Step 3 — `apps/admin/src/App.tsx`

**3a. Add imports** after the existing product page imports:
```typescript
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
```

**3b. Add routes** inside `<Routes>`, immediately after the product routes:
```tsx
<Route path="/categories"           element={<CategoriesPage />} />
<Route path="/categories/new"       element={<CategoryFormPage />} />
<Route path="/categories/:id/edit"  element={<CategoryFormPage />} />
```

React Router resolves `/categories/new` before `/categories/:id/edit` because more specific static paths take precedence when listed first.

---

### Step 4 — `apps/admin/src/components/Layout.tsx`

**4a. Add `IconTag`** to the `@tabler/icons-react` import.

**4b. Insert nav entry** in the `navigation` array, immediately after `{ icon: IconBox, label: 'Products', href: '/products' }`:
```typescript
{ icon: IconTag, label: 'Categories', href: '/categories' },
```

No changes to rendering logic — the existing `isActive = location.pathname === item.href` check correctly highlights "Categories" when on `/categories` (exact match only, not sub-paths; this is the same behavior as all other nav items).

---

## Acceptance Criteria

1. Navigating to `/categories` in the admin app renders the `CategoriesPage` with a DataTable.
2. `CategoriesPage` calls `GET /api/categories` and populates the table with real data.
3. Typing in the search input filters rows client-side by category name (case-insensitive).
4. Clicking "New Category" navigates to `/categories/new`.
5. Clicking Edit on a row navigates to `/categories/:id/edit`.
6. Clicking Delete on a row opens the confirmation modal; confirming calls `DELETE /api/categories/:id` and refreshes the list.
7. `CategoryFormPage` at `/categories/new` shows title "Add New Category" with empty fields.
8. `CategoryFormPage` at `/categories/:id/edit` shows title "Edit Category" and pre-populates `name`; shows current image preview when `imageUrl` is set.
9. Submitting the create form with a valid name creates the category and navigates to `/categories`.
10. Submitting the create form with an image > 5 MB shows an error notification and does not call the API.
11. The "Categories" link appears in the sidebar between "Products" and "Customers"; it highlights when on `/categories`.
12. `nx serve admin` starts without TypeScript errors.

---

## Dependencies

- **Task 2** must be complete: `useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` hooks are exported from `@shreehari/data-access`.
- **Task 3** must be complete: the API endpoints are live so the hooks return real data during development testing.
