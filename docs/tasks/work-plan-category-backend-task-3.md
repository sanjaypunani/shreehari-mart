# Backend Task 3 — API Routes

**Track:** Backend
**Depends on:** Task 2 (repository + service layer)
**Blocks:** Task 4, Task 5, Task 6, Task 7

---

## Objective

Expose all category endpoints to HTTP consumers and extend the existing products endpoint with category filtering:

1. Add `categoryUpload` multer instance to the upload middleware.
2. Create the full `categories.routes.ts` router (5 endpoints).
3. Extend `products.routes.ts` GET handler to forward `categoryId` query param.
4. Update `ProductRepository.findAll` to filter by `categoryId` and eager-load the `category` relation.
5. Register `categoriesRouter` in `server.ts`.

---

## Files Changed

| File | Status |
|------|--------|
| `apps/api/src/app/middleware/upload.middleware.ts` | Modified |
| `apps/api/src/app/routes/categories.routes.ts` | New |
| `apps/api/src/app/routes/products.routes.ts` | Modified |
| `apps/api/src/app/server.ts` | Modified |
| `libs/data-access/src/repositories/ProductRepository.ts` | Modified |

---

## Implementation Steps

### Step 1 — `apps/api/src/app/middleware/upload.middleware.ts`

Add a second multer instance for category images **below** the existing `export const upload` declaration. Reuse the existing `fileFilter` function (already declared at module scope). Only the `destination` path changes.

```typescript
// Ensure category uploads directory exists
const categoryUploadsDir = path.join(process.cwd(), 'uploads', 'categories');
if (!fs.existsSync(categoryUploadsDir)) {
  fs.mkdirSync(categoryUploadsDir, { recursive: true });
}

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  },
});

export const categoryUpload = multer({
  storage: categoryStorage,
  fileFilter,       // shared with the existing upload instance
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
```

Do not modify the existing `upload` export or `fileFilter` function.

---

### Step 2 — `apps/api/src/app/routes/categories.routes.ts` (new file)

Create the full router. Full source is in `design-doc-category-backend.md` section 7. Endpoint summary:

| Method | Path | Handler summary |
|--------|------|-----------------|
| GET | `/` | `categoryRepo.findAll()` → `{ success, data }` |
| GET | `/:id` | `categoryRepo.findById(id)` → 404 if null |
| POST | `/` | `categoryUpload.single('image')`, validate `name`, uniqueness check via `findByName`, `categoryRepo.create(...)`, → 201 |
| PUT | `/:id` | `categoryUpload.single('image')`, existence check, validate/uniqueness check `name` if provided, `categoryRepo.update(...)` |
| DELETE | `/:id` | `categoryRepo.delete(id)` → 404 if `false` |

All responses use the `{ success: boolean, data?: T, message?: string }` envelope matching the existing product routes pattern.

Validation rules:
- `name` on POST: required, non-empty, max 100 chars.
- `name` on PUT: optional; if provided must be non-empty, max 100 chars, unique (excluding current record).
- Image upload on POST/PUT: optional; stored to `/uploads/categories/<filename>`; `imageUrl` stored as `/uploads/categories/<filename>`.

---

### Step 3 — `libs/data-access/src/repositories/ProductRepository.ts`

**3a. Add `categoryId` to the `options` parameter type of `findAll`:**

```typescript
async findAll(options?: {
  page?: number;
  limit?: number;
  search?: string;
  unit?: string;
  isAvailable?: boolean;
  categoryId?: string;   // NEW
}): Promise<{ products: Product[]; total: number }>
```

**3b. Destructure `categoryId` from options.**

**3c. Add `leftJoinAndSelect` to the query builder** (replaces the plain `createQueryBuilder` call, or add it to the existing one):

```typescript
const queryBuilder = this.repository
  .createQueryBuilder('product')
  .leftJoinAndSelect('product.category', 'category');  // NEW
```

**3d. Add `categoryId` filter after the `isAvailable` filter:**

```typescript
if (categoryId) {
  queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
}
```

The `leftJoinAndSelect` means every product response now includes the `category` object (`{ id, name }`) or `null`. This is a non-breaking change — existing callers receive `category: null` on uncategorized products.

---

### Step 4 — `apps/api/src/app/routes/products.routes.ts`

In the `GET /` handler, after extracting the other query params (`page`, `limit`, `search`, `unit`, `isAvailable`), add:

```typescript
const categoryId = req.query.categoryId as string | undefined;
```

Then add `categoryId` to the `findAll` call:

```typescript
const { products, total } = await productRepo.findAll({
  page,
  limit,
  search,
  unit,
  isAvailable,
  categoryId,   // NEW
});
```

No other handlers in `products.routes.ts` change.

---

### Step 5 — `apps/api/src/app/server.ts`

**5a. Add import** after the `productsRouter` import:

```typescript
import categoriesRouter from './routes/categories.routes';
```

**5b. Register the router** in the Routes block, immediately after `app.use('/api/products', productsRouter)`:

```typescript
app.use('/api/categories', categoriesRouter);
```

---

## API Contracts

### GET /api/categories
Response 200: `{ success: true, data: CategoryDto[] }` — array ordered by name ASC; each item includes `productCount`.

### GET /api/categories/:id
Response 200: `{ success: true, data: CategoryDto }` (no `productCount`).
Response 404: `{ success: false, message: 'Category not found' }`.

### POST /api/categories
Request: `multipart/form-data`, fields: `name` (required), `image` (optional file).
Response 201: `{ success: true, message: 'Category created successfully', data: CategoryDto }`.
Response 400: name missing/empty.
Response 409: name already exists.

### PUT /api/categories/:id
Request: `multipart/form-data`, fields: `name` (optional), `image` (optional file).
Response 200: `{ success: true, message: 'Category updated successfully', data: CategoryDto }`.
Response 404: not found.
Response 409: name conflicts with another category.

### DELETE /api/categories/:id
Response 200: `{ success: true, message: 'Category deleted successfully' }`.
Response 404: not found.
Side effect: all products with this `categoryId` have `categoryId` set to `NULL` via DB FK.

### GET /api/products?categoryId=:uuid (modified)
New optional `categoryId` query param. When provided, returns only matching products. Products now include a `category` object (or `null`) on every response.

---

## Acceptance Criteria

1. `GET /api/categories` returns status 200 with `{ success: true, data: [...] }`. Each item has `productCount`.
2. `POST /api/categories` with `name="Test"` returns 201 with the created category.
3. `POST /api/categories` with the same name returns 409.
4. `POST /api/categories` with no `name` returns 400.
5. `POST /api/categories` with a `image` file stores it in `uploads/categories/` and sets `imageUrl` to `/uploads/categories/<filename>`.
6. `PUT /api/categories/:id` updates the name and/or image.
7. `DELETE /api/categories/:id` returns 200; a subsequent `GET /api/categories/:id` returns 404; products that had this `categoryId` now have `categoryId = null` in the DB.
8. `GET /api/products?categoryId=<uuid>` returns only products with that `categoryId`. Each product object includes `category: { id, name }`.
9. `GET /api/products` (no `categoryId`) continues to return all products — backward compatible.
10. `nx serve api` starts without errors.
11. No existing product route or response shape is broken.

---

## Dependencies

- **Task 2** must be complete: `CategoryRepository` exists and `DatabaseService.getCategoryRepository()` is available.
- **Task 1** must be complete: `Category` entity and migration have been applied to the database.
