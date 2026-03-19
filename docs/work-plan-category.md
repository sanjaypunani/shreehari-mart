# Work Plan: Product Category Module + Search

**Date:** 2026-03-19
**Status:** Ready for implementation
**Design docs:**
- `docs/design-doc-category-backend.md`
- `docs/design-doc-category-frontend.md`
- `docs/ui-spec/ui-spec-category-search.md`

---

## Overview

This work plan delivers the Product Category Module and the full-screen Product Search feature across all three layers: shared libraries, the Express API, the React/Vite admin dashboard, and the Next.js 16 customer web app.

Work is sliced into 7 dependency-ordered tasks. Backend tasks must be completed before the frontend tasks that consume real data. The two frontend tracks (admin and web) can proceed in parallel once the backend is done.

---

## Dependency Graph

```
Task 1 (types + entity + migration)
  └─► Task 2 (repository + service layer)
        └─► Task 3 (API routes)
              ├─► Task 4 (admin categories pages)
              │     └─► Task 5 (admin product enhancements)
              └─► Task 6 (web dynamic categories)
                    └─► Task 7 (web full-screen search)
```

---

## Task Summary

| Task | File | Track | Depends On |
|------|------|-------|-----------|
| 1 | `work-plan-category-backend-task-1.md` | Backend | — |
| 2 | `work-plan-category-backend-task-2.md` | Backend | Task 1 |
| 3 | `work-plan-category-backend-task-3.md` | Backend | Task 2 |
| 4 | `work-plan-category-frontend-task-4.md` | Admin Frontend | Task 2+3 |
| 5 | `work-plan-category-frontend-task-5.md` | Admin Frontend | Task 4 |
| 6 | `work-plan-category-frontend-task-6.md` | Web Frontend | Task 3 |
| 7 | `work-plan-category-frontend-task-7.md` | Web Frontend | Task 6 |

---

## Task Detail

### Task 1 — Foundation: Types + Entity + Migration
**File:** `docs/tasks/work-plan-category-backend-task-1.md`

Introduces the `Category` TypeORM entity, adds `categoryId` to `Product`, creates the database migration, and extends shared TypeScript DTOs.

**Files changed:**
- `libs/types/src/index.ts` — add `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto`; extend `ProductDto`/`CreateProductDto`/`UpdateProductDto` with `categoryId`/`categoryName`
- `libs/data-access/src/entities/Category.ts` — new entity
- `libs/data-access/src/entities/Product.ts` — add `categoryId` column + `@ManyToOne` relation
- `libs/data-access/src/database/migrations/1760000001000-CreateCategoryAndLinkProduct.ts` — new migration

---

### Task 2 — Repository + Service Layer
**File:** `docs/tasks/work-plan-category-backend-task-2.md`

Adds `CategoryRepository` with all CRUD methods, registers it in `DatabaseService`, and exports it plus new admin-layer hooks from the `data-access` barrel.

**Files changed:**
- `libs/data-access/src/repositories/CategoryRepository.ts` — new repository
- `libs/data-access/src/services/DatabaseService.ts` — add `getCategoryRepository()`
- `libs/data-access/src/index.ts` — export `CategoryRepository`; add `useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` hooks; update `useProducts` to accept `categoryId`

---

### Task 3 — API Routes
**File:** `docs/tasks/work-plan-category-backend-task-3.md`

Exposes the 5 category endpoints, extends the products endpoint with `categoryId` filtering, adds the category upload middleware, and registers the new router in `server.ts`.

**Files changed:**
- `apps/api/src/app/middleware/upload.middleware.ts` — add `categoryUpload` instance
- `apps/api/src/app/routes/categories.routes.ts` — new router (GET all, GET by id, POST, PUT, DELETE)
- `apps/api/src/app/routes/products.routes.ts` — extract and forward `categoryId` query param
- `apps/api/src/app/server.ts` — register `categoriesRouter`
- `libs/data-access/src/repositories/ProductRepository.ts` — add `categoryId` filter + `leftJoinAndSelect`

---

### Task 4 — Admin Categories Pages
**File:** `docs/tasks/work-plan-category-frontend-task-4.md`

Creates the Admin categories list page and create/edit form page, registers routes in `App.tsx`, and adds the nav link to `Layout.tsx`.

**Files changed:**
- `apps/admin/src/pages/CategoriesPage.tsx` — new page (list with DataTable, client-side search, delete confirm)
- `apps/admin/src/pages/CategoryFormPage.tsx` — new page (create/edit form with name + image upload)
- `apps/admin/src/App.tsx` — add 3 routes for categories
- `apps/admin/src/components/Layout.tsx` — add `IconTag` / "Categories" nav entry

---

### Task 5 — Admin Product Enhancements
**File:** `docs/tasks/work-plan-category-frontend-task-5.md`

Adds the Category selector to the product form (pre-populated in edit mode) and adds a Category column + filter to the products list page.

**Files changed:**
- `apps/admin/src/pages/ProductFormPage.tsx` — add `categoryId` to form state, add `Select` field, update payloads
- `apps/admin/src/pages/ProductsPage.tsx` — add `categoryId` filter state, update `useProducts` call, add category column to DataTable

---

### Task 6 — Web Dynamic Categories
**File:** `docs/tasks/work-plan-category-frontend-task-6.md`

Replaces the hardcoded `categories` array in `root.tsx` with live API data, removes mock data from `CategoryDetail.tsx`, wires category-filtered product fetching, and connects the sidebar category selector to URL navigation.

**Files changed:**
- `apps/web/src/lib/query-client.ts` — add `queryKeys.categories`
- `apps/web/src/lib/api/services.ts` — add `categoriesApi`; extend `productsApi.getAll` type
- `apps/web/src/hooks/use-api.ts` — add `useCategories`, `useCategory`; update `useProducts` params type
- `apps/web/src/app/components/root.tsx` — remove static array, use `useCategories`, add loading skeleton
- `apps/web/src/components/category/CategoryDetail.tsx` — remove `MOCK_CATEGORIES`, add `useCategory` + `useCategories`, add `categoryId` filter to `useProducts`, wire `IconSearch` to open search dialog

---

### Task 7 — Web Full-Screen Search
**File:** `docs/tasks/work-plan-category-frontend-task-7.md`

Creates the `ProductSearchDialog` component and wires it as a trigger from `MobileHeader`.

**Files changed:**
- `apps/web/src/components/ProductSearchDialog.tsx` — new full-screen search dialog (debounced query, result rows, add to cart)
- `apps/web/src/components/MobileHeader.tsx` — add `readOnly` + `onClick`/`onFocus` to `SearchInput`, conditionally mount `ProductSearchDialog`

---

## Acceptance Criteria Summary

All 7 tasks complete when:

1. `GET /api/categories` returns all categories with `productCount`, ordered by name ASC.
2. `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` work with image upload via multipart.
3. `GET /api/products?categoryId=<uuid>` returns only products for that category; response includes `category.name` on each product.
4. Admin `/categories` list page shows Image, Name, Products count, Created At columns with Edit/Delete actions.
5. Admin `/categories/new` and `/categories/:id/edit` forms create and update categories with optional image upload.
6. Admin `/products` list has a Category column and a Category filter dropdown.
7. Admin `/products/new` and `/products/:id/edit` forms have a Category selector that pre-populates in edit mode.
8. Web home page renders live category cards from the API with skeleton loading state.
9. Web category detail page fetches products filtered by the selected category UUID; sidebar taps update the URL.
10. Web full-screen search dialog opens from `MobileHeader`, debounces input, shows results, and supports add-to-cart.

---

## Implementation Order

Follow tasks in numbered order. Tasks 4–5 (admin) and tasks 6–7 (web) can be executed in parallel after Task 3 is complete.

```
Day 1:   Task 1 → Task 2
Day 2:   Task 3
Day 3:   Task 4 (admin) + Task 6 (web) [parallel]
Day 4:   Task 5 (admin) + Task 7 (web) [parallel]
Day 5:   Integration testing + migration run
```
