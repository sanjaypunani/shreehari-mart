# PRD: Product Category Module + Product Search

**Status:** Draft
**Date:** 2026-03-19
**Scope:** Full-stack — `apps/api` (Express/TypeORM), `apps/admin` (React/Vite/Mantine), `apps/web` (Next.js 16)
**Effort:** Medium-Large

---

## Overview

This feature ships three tightly coupled sub-features:

1. **Admin Category CRUD** — Admins can create, update, and delete flat product categories with a name and an optional image, then assign those categories to products.
2. **Web Dynamic Categories** — The home page and category detail page replace their hardcoded category arrays with live API data; the category detail page filters products by the selected category.
3. **Web Full-Screen Product Search** — A full-screen search dialog (opened from the `MobileHeader` search bar) lets customers search products by name with debouncing and add results directly to the cart.

---

## Problem Statement

### Hardcoded Categories

Both `apps/web/src/app/components/root.tsx` and `apps/web/src/components/category/CategoryDetail.tsx` declare static arrays of category objects (name + external Swiggy CDN image URLs). Categories cannot be created or changed without a code deployment. The category detail page ignores the `categoryId` URL parameter entirely when fetching products — it shows all available products regardless of which category the customer navigated to — because no server-side category-to-product mapping exists.

### No Product Search

The `MobileHeader` renders a `SearchInput` component that fires `console.log('Location selector clicked')` when the location button is pressed and does nothing on the search input — there is no `onChange` handler wired to any search action. Customers cannot find a product by name from the home screen without scrolling through the full product grid.

### No Category Entity

The `Product` entity has no `categoryId` column. There is no `Category` entity, no `CategoryRepository`, and no `/api/categories` route. The `DatabaseService` singleton does not expose a category repository.

---

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Replace hardcoded data with live categories | 0 static category arrays remain in web app after launch | 100% |
| Products filtered correctly by category | Products shown on category detail page match the selected category only | 100% accuracy |
| Admin can manage categories without a deployment | Time from decision to live category | Under 5 minutes |
| Customers can find products by search | Search result latency from last keystroke | Under 500 ms (debounce 300 ms + API round-trip) |
| Products without a category are hidden on web | Uncategorized products do not appear in the web storefront | 100% |

---

## User Stories

### Admin

1. **As an admin**, I want to create a product category with a name and an optional image so that I can organize the product catalog.
2. **As an admin**, I want to upload a category image file so that customers see a real branded image (not an external CDN URL) for each category.
3. **As an admin**, I want to edit an existing category's name or image so that I can correct mistakes without deleting and recreating it.
4. **As an admin**, I want to delete a category so that discontinued groupings are removed from the storefront.
5. **As an admin**, I want to assign a category to a product when creating or editing a product so that the product appears under the correct category on the web app.
6. **As an admin**, I want to see a list of all categories with their product counts so that I can understand how the catalog is organized at a glance.

### Web Customer

7. **As a customer**, I want to see real categories fetched from the server on the home page so that the category grid always reflects what the store actually carries.
8. **As a customer**, I want to tap a category on the home page and see only the products that belong to that category so that browsing is relevant and fast.
9. **As a customer**, I want to tap the search bar in the header and see a full-screen search dialog so that I can quickly find a specific product by name.
10. **As a customer**, I want search results to update as I type (with a short delay) so that I do not have to press Enter or a search button.
11. **As a customer**, I want to add a product to my cart directly from the search results so that I do not have to navigate away to a separate product page.
12. **As a customer**, I want the search dialog to close when I press Escape or tap outside it so that I can return to browsing quickly.

---

## Functional Requirements

### A. Admin — Category CRUD

#### A1. Categories List Page (`/categories`)

- Display a Mantine `DataTable` (matching the pattern of `ProductsPage.tsx`) with columns: **Image** (thumbnail), **Name**, **Product Count**, **Created At**, **Actions**.
- Actions column contains Edit and Delete icon buttons.
- Delete triggers a Mantine `modals.openConfirmModal` confirmation before calling the API.
- A "New Category" button in the `PageHeader` navigates to `/categories/new`.
- The page fetches `GET /api/categories` on mount.

#### A2. Category Form Page (`/categories/new` and `/categories/:id/edit`)

- Fields:
  - **Name** — required, text, max 100 characters.
  - **Image** — optional file upload using Mantine `FileInput` (same pattern as `ProductFormPage.tsx`). Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Max size: 5 MB.
- On submit, the form uses `multipart/form-data` when an image is provided, plain JSON otherwise (matching existing product form behavior).
- Edit mode pre-populates fields from `GET /api/categories/:id` and displays the current image if one exists.
- After successful save, navigate to `/categories` and show a Mantine notification.

#### A3. Products Form — Category Field

- `ProductFormPage.tsx` gains a **Category** field: a `Select` component populated by `GET /api/categories` (returns `{ id, name }` pairs).
- The field is optional. When left blank the product is saved with `categoryId = null`.
- In edit mode, the dropdown pre-selects the product's current category.

#### A4. Products List — Category Column

- `ProductsPage.tsx` adds a **Category** column showing the category name (or "—" if none assigned).

### B. Backend

#### B1. Category Entity (`libs/data-access/src/entities/Category.ts`)

```
id          UUID (PK, auto-generated)
name        VARCHAR(100), NOT NULL, UNIQUE
imageUrl    VARCHAR(500), nullable
createdAt   TIMESTAMP, auto
updatedAt   TIMESTAMP, auto
```

Relations: `@OneToMany(() => Product, (p) => p.category)` (lazy, not required to load eagerly by default).

#### B2. Product Entity — categoryId column

- Add nullable `@Column({ type: 'uuid', nullable: true }) categoryId?: string` and a `@ManyToOne(() => Category, (c) => c.products, { nullable: true, onDelete: 'SET NULL' }) category?: Category` relation.
- A TypeORM migration must be created to add the `category_id` column with `ON DELETE SET NULL` and a corresponding index.

#### B3. CategoryRepository (`libs/data-access/src/repositories/CategoryRepository.ts`)

| Method | Description |
|--------|-------------|
| `findAll()` | Returns all categories ordered by name ASC, including a computed product count via a LEFT JOIN aggregate. |
| `findById(id)` | Returns one category or null. |
| `findByName(name)` | Returns one category or null (used for uniqueness check on create). |
| `create(data)` | Inserts and returns new category. |
| `update(id, data)` | Updates and returns category or null. |
| `delete(id)` | Hard deletes; products with this `categoryId` have `categoryId` set to NULL via `ON DELETE SET NULL`. Returns boolean. |

#### B4. ProductRepository — categoryId filter

- `findAll()` gains an optional `categoryId?: string` parameter. When provided, the query builder adds `.andWhere('product.categoryId = :categoryId', { categoryId })`.
- The web-facing product list endpoint must also support filtering by `isAvailable = true` AND `categoryId` simultaneously.

#### B5. `/api/categories` Routes (`apps/api/src/app/routes/categories.routes.ts`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all categories (id, name, imageUrl, productCount, createdAt) |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create category; `upload.single('image')` middleware; image saved to `uploads/categories/`; imageUrl stored as `/uploads/categories/<filename>` |
| PUT | `/api/categories/:id` | Update category; same upload middleware; name uniqueness validated against other categories |
| DELETE | `/api/categories/:id` | Delete category; products with this category get `categoryId = NULL` via DB cascade |

All responses follow the existing `{ success, data }` envelope pattern used throughout `products.routes.ts`.

#### B6. Upload Middleware

The existing `upload` middleware in `apps/api/src/app/middleware/upload.middleware.ts` currently hardcodes the destination to `uploads/products/`. Extend (or create a factory) so categories can specify `uploads/categories/` as their destination. The simplest approach: create a `categoryUpload` instance of `multer` with the same file filter and size limit but `destination = uploads/categories/`.

#### B7. `server.ts` Registration

Add `import categoriesRouter from './routes/categories.routes'` and `app.use('/api/categories', categoriesRouter)` immediately after the products route registration.

#### B8. DatabaseService

Add `private categoryRepository: CategoryRepository` and `public getCategoryRepository(): CategoryRepository` following the pattern of the existing `getProductRepository()` method.

#### B9. `libs/data-access/src/index.ts`

- Export `type { Category }` from the new entity.
- Export `{ CategoryRepository }` from the new repository.

#### B10. `libs/types/src/index.ts`

Add:

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

Update `ProductDto` to add `categoryId?: string | null` and `categoryName?: string | null`.

Update `CreateProductDto` and `UpdateProductDto` to include `categoryId?: string | null`.

### C. Web — Dynamic Categories

#### C1. `root.tsx` — Home Page Category Grid

- Remove the static `categories` array.
- Add a `useCategories()` React Query hook (see C4) that calls `GET /api/categories`.
- Pass the API categories to `CategoryGrid`. Each category maps: `{ id: category.id, name: category.name, image: toApiAssetUrl(category.imageUrl) }`.
- While loading, show a skeleton placeholder row of 8 `CategoryCard`-sized boxes using Mantine `Skeleton`.
- The `onCategoryClick` handler continues to navigate to `/category/:id` (now using the real UUID as the path parameter).

#### C2. `CategoryDetail.tsx` — Category-Filtered Products

- Remove the static `MOCK_CATEGORIES` array.
- Fetch category details from `GET /api/categories/:id` using the `categoryId` prop.
- Display the real category `name` in the header.
- Fetch products with `GET /api/products?categoryId=<categoryId>&isAvailable=true` (no pagination limit needed for the category view — use `limit=200`).
- The `CategorySidebar` fetches the full category list (`GET /api/categories`) to render the sidebar navigation; selecting a different category replaces the current URL (`router.replace('/category/:newId')`) rather than keeping stale product data.
- While products are loading, show `ProductGrid` with Skeleton cards.

#### C3. `CategorySidebar.tsx`

No structural change required. The component already accepts `categories`, `selectedCategoryId`, and `onSelectCategory` as props. The parent (`CategoryDetail`) will provide real data instead of mock data.

#### C4. API hooks — `use-api.ts`

Add the following hooks following the existing `useProducts` pattern (React Query, `queryKeys`, `productsApi`-style service):

```typescript
export const useCategories = (options?) => { ... }
export const useCategory = (id: string, options?) => { ... }
```

Add corresponding service methods in `apps/web/src/lib/api/services.ts` (or wherever `productsApi` is defined):
- `categoriesApi.getAll()` — `GET /api/categories`
- `categoriesApi.getById(id)` — `GET /api/categories/:id`

Add `queryKeys.categories.all`, `queryKeys.categories.lists()`, `queryKeys.categories.detail(id)` in `apps/web/src/lib/query-client.ts`.

### D. Web — Full-Screen Product Search

#### D1. `ProductSearchDialog.tsx` (new component, `apps/web/src/components/`)

- A full-screen Mantine `Modal` (`size="full"`, `fullScreen` prop if available, or `size="100%"` with custom styles).
- Contains:
  - A sticky search input at the top (autofocused on open).
  - A scrollable results area below.
  - An empty state when query is shorter than 2 characters: display prompt "Search for products…".
  - An empty state when no results: display "No products found for '&lt;query&gt;'".
  - A loading spinner while the request is in-flight.
- Each result row renders: product image (via `toApiAssetUrl`), product name, unit, price, and an "Add" button.
- Tapping "Add" calls `useCartStore.addItem(...)` with the same field mapping used in `root.tsx` and `CategoryDetail.tsx`.
- Dismiss on Escape or clicking the backdrop.

#### D2. Search Debouncing

- Local state: `searchQuery` (string).
- Debounced value: 300 ms using a `useDebounce` hook (or `useDebouncedValue` from `@mantine/hooks` which is already a project dependency).
- The React Query call for products is enabled only when `debouncedQuery.length >= 2`.
- The query calls `GET /api/products?search=<debouncedQuery>&isAvailable=true&limit=30`.
- The existing `ProductRepository.findAll()` already supports `search` via `ILIKE` on name and description — no backend change is needed for search itself.

#### D3. `MobileHeader.tsx` Integration

- The `SearchInput` receives an `onClick` handler (or `onFocus` if more appropriate for the UX) that calls `openSearchDialog()`.
- The search input is rendered as a non-editable trigger button (readonly, `readOnly` prop) to prevent the mobile keyboard from appearing before the full-screen dialog opens. The actual editable input lives inside `ProductSearchDialog`.
- A `useDisclosure()` from `@mantine/hooks` manages the dialog open/close state.
- `ProductSearchDialog` is rendered at the bottom of `MobileHeader`'s JSX tree, conditionally mounted only when opened (to avoid stale query state).

---

## Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| Performance | Category list should load in under 200 ms for up to 50 categories (single table scan, no joins except the product count aggregate). |
| Image storage | Category images stored at `<cwd>/uploads/categories/` on the API server, served as static files via the existing `/uploads` static middleware. Same 5 MB limit and JPEG/PNG/WebP/GIF filter as products. |
| Type safety | All new DTOs defined in `libs/types/src/index.ts`. New entity fields carry correct TypeORM decorators. No `any` types introduced in new code. |
| Migration safety | The `category_id` column on `products` is `nullable` with `ON DELETE SET NULL`. Running the migration on a database with existing products will not break any existing product records; they simply get `category_id = NULL`. |
| Backward compatibility | The admin products list and form continue to work correctly if `categoryId` is null. The existing `/api/products` endpoint continues to work without `categoryId` param (uncategorized products still appear in admin queries). |
| No slug | Category URLs use the UUID primary key (e.g., `/category/3fa85f64-5717-4562-b3fc-2c963f66afa6`). No slug column is added. |
| Uncategorized products hidden on web | The web category detail page only fetches `?categoryId=<uuid>&isAvailable=true`. Products with `categoryId = NULL` are not returned by that query and therefore not shown in the web storefront. They remain visible in the admin dashboard. |

---

## User Flows

### Flow 1 — Admin creates a category and assigns it to products

```
1. Admin navigates to /categories in admin dashboard.
2. Admin clicks "New Category".
3. Admin fills in name ("Fresh Vegetables") and optionally uploads an image file.
4. Admin submits → POST /api/categories → category created with UUID.
5. Admin navigates to /products.
6. Admin opens an existing product for edit.
7. Admin selects "Fresh Vegetables" from the Category dropdown.
8. Admin saves → PUT /api/products/:id with { categoryId: "<uuid>" }.
9. Product now appears under "Fresh Vegetables" on the web app.
```

### Flow 2 — Customer browses by category on web

```
1. Customer opens the home page.
2. Web app calls GET /api/categories → real category list rendered in CategoryGrid.
3. Customer taps "Fresh Vegetables" category card.
4. Browser navigates to /category/<uuid>.
5. CategoryDetail mounts:
   a. GET /api/categories/<uuid> → fetches category name.
   b. GET /api/products?categoryId=<uuid>&isAvailable=true → fetches matching products.
6. CategorySidebar shows all categories (GET /api/categories); "Fresh Vegetables" is highlighted.
7. Customer taps a different category in the sidebar.
8. URL updates to /category/<new-uuid>; products refresh.
9. Customer taps "Add" on a product → added to cart store.
```

### Flow 3 — Customer searches for a product

```
1. Customer is on the home page, sees MobileHeader.
2. Customer taps the search bar (read-only input).
3. ProductSearchDialog opens full-screen, search input is autofocused.
4. Customer types "tom" → 300 ms debounce → GET /api/products?search=tom&isAvailable=true&limit=30.
5. Results list shows: "Tomatoes", "Cherry Tomatoes", etc.
6. Customer taps "Add" next to "Tomatoes" → item added to cart store.
7. Customer taps outside or presses Escape → dialog closes.
8. CartBar at the bottom shows updated item count.
```

---

## Out of Scope

- **Subcategories**: Flat category list only. No parent-child hierarchy.
- **Category reordering**: No drag-and-drop or display order field. Categories are ordered alphabetically by name.
- **Category-level promotions or discounts**: No discount or banner field on categories.
- **Search for categories in the search dialog**: The search dialog shows products only.
- **Server-side rendered (SSR) category pages**: `CategoryDetail` remains a client component (`'use client'`). No `generateStaticParams` or ISR for category pages in this scope.
- **Bulk category assignment**: Assigning a category to many products at once from the admin. Products must be edited individually.
- **Category analytics**: No category-level sales or view count reporting.
- **Image CDN / resizing**: Images are served as uploaded from the local `uploads/` directory. No CDN integration, thumbnail generation, or WebP conversion.
- **Authentication on `/api/categories` write routes**: The existing API has no auth middleware on product routes; categories follow the same convention. Auth hardening is a separate concern.

---

## Assumptions

1. The existing `multer` middleware can be duplicated or refactored into a factory without breaking the existing `upload` instance used by products routes.
2. The PostgreSQL database supports `uuid` columns with `gen_random_uuid()` or TypeORM's `uuid` strategy — consistent with all existing entities that use `@PrimaryGeneratedColumn('uuid')`.
3. `@mantine/hooks` `useDebouncedValue` is available in `apps/web` — it is already a dependency (used by `useDisclosure` in `Layout.tsx`).
4. The `toApiAssetUrl` helper in `apps/web/src/config/api.ts` correctly constructs full image URLs from relative paths like `/uploads/categories/<filename>`, consistent with how it handles `/uploads/products/<filename>` today.
5. The NX monorepo TypeScript path aliases (`@shreehari/types`, `@shreehari/data-access`) are already configured in `tsconfig.base.json` for all apps; no new path alias configuration is needed.
6. Category deletion with `ON DELETE SET NULL` is acceptable business behavior — removing a category does not delete its products; they simply become uncategorized and hidden from the web storefront until reassigned.
7. The admin does not require pagination on the categories list — the total number of categories is expected to remain under 100 for this business.

---

## Implementation Notes

### New Files

| File | Purpose |
|------|---------|
| `libs/data-access/src/entities/Category.ts` | TypeORM entity |
| `libs/data-access/src/repositories/CategoryRepository.ts` | Repository class |
| `apps/api/src/app/routes/categories.routes.ts` | Express router |
| `apps/admin/src/pages/CategoriesPage.tsx` | Admin list page |
| `apps/admin/src/pages/CategoryFormPage.tsx` | Admin create/edit form |
| `apps/web/src/components/ProductSearchDialog.tsx` | Full-screen search dialog |
| `migrations/<timestamp>-AddCategoryEntity.ts` | TypeORM migration at monorepo root |

### Modified Files

| File | Change |
|------|--------|
| `libs/data-access/src/entities/Product.ts` | Add `categoryId` column and `category` relation |
| `libs/data-access/src/repositories/ProductRepository.ts` | Add `categoryId` filter to `findAll()` |
| `libs/data-access/src/services/DatabaseService.ts` | Add `categoryRepository` field and `getCategoryRepository()` |
| `libs/data-access/src/index.ts` | Export `Category` type and `CategoryRepository` class |
| `libs/types/src/index.ts` | Add `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto`; extend `ProductDto`, `CreateProductDto`, `UpdateProductDto` |
| `apps/api/src/app/server.ts` | Register `/api/categories` route |
| `apps/api/src/app/middleware/upload.middleware.ts` | Add `categoryUpload` multer instance for `uploads/categories/` |
| `apps/admin/src/App.tsx` | Add routes for `/categories`, `/categories/new`, `/categories/:id/edit` |
| `apps/admin/src/components/Layout.tsx` | Add "Categories" nav item (icon: `IconTag`) |
| `apps/admin/src/pages/ProductFormPage.tsx` | Add Category `Select` field |
| `apps/admin/src/pages/ProductsPage.tsx` | Add Category column to table |
| `apps/web/src/app/components/root.tsx` | Replace static categories array with `useCategories()` hook |
| `apps/web/src/components/category/CategoryDetail.tsx` | Replace mock categories with API data; add `categoryId` filter to product query |
| `apps/web/src/components/MobileHeader.tsx` | Wire search input to open `ProductSearchDialog` |
| `apps/web/src/hooks/use-api.ts` | Add `useCategories`, `useCategory` hooks |
| `apps/web/src/lib/api/services.ts` | Add `categoriesApi` service object |
| `apps/web/src/lib/query-client.ts` | Add `queryKeys.categories` |

### Migration Strategy

Run `npm run migration:run` from `shreehari-mart/` after generating the migration file. The migration adds:

1. `categories` table with columns `id`, `name`, `image_url`, `created_at`, `updated_at`.
2. `UNIQUE` constraint on `categories.name`.
3. `category_id UUID NULL REFERENCES categories(id) ON DELETE SET NULL` column on `products`.
4. Index on `products.category_id`.

No data backfill is required — existing products start with `category_id = NULL`.

### API Response Shapes

**GET /api/categories** response:
```json
{
  "success": true,
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Fresh Vegetables",
      "imageUrl": "/uploads/categories/Fresh-Vegetables-1700000000000-123456789.jpg",
      "productCount": 12,
      "createdAt": "2026-03-19T10:00:00.000Z",
      "updatedAt": "2026-03-19T10:00:00.000Z"
    }
  ]
}
```

**GET /api/products?categoryId=&lt;uuid&gt;&isAvailable=true** — same envelope as the existing products list, with `categoryId` and `categoryName` added to each product object.
