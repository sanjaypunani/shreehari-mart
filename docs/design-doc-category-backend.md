# Design Doc: Product Category Module — Backend

**Status:** Draft
**Date:** 2026-03-19
**Scope:** Backend only — `libs/data-access`, `libs/types`, `apps/api`
**Source PRD:** `docs/prd-category-search.md` sections B1–B10

---

## 1. Overview

This document specifies every backend change required to ship the Product Category Module. The work introduces a new `Category` entity, a `CategoryRepository`, five new API routes, and targeted modifications to the `Product` entity, `ProductRepository`, `DatabaseService`, upload middleware, `server.ts`, `libs/types`, and `libs/data-access/src/index.ts`.

No auth middleware is added to category write routes — the existing API convention (no auth on product routes) is maintained. All responses follow the `{ success, data }` envelope already used in `products.routes.ts`.

**New files:**
- `libs/data-access/src/entities/Category.ts`
- `libs/data-access/src/repositories/CategoryRepository.ts`
- `libs/data-access/src/database/migrations/1760000001000-CreateCategoryAndLinkProduct.ts`
- `apps/api/src/app/routes/categories.routes.ts`

**Modified files:**
- `libs/data-access/src/entities/Product.ts`
- `libs/data-access/src/repositories/ProductRepository.ts`
- `libs/data-access/src/services/DatabaseService.ts`
- `libs/data-access/src/index.ts`
- `libs/types/src/index.ts`
- `apps/api/src/app/server.ts`
- `apps/api/src/app/middleware/upload.middleware.ts`

---

## 2. New Entity: Category

**File:** `libs/data-access/src/entities/Category.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Product } from './Product';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  @Index({ unique: true })  // single column-level unique index — do NOT add class-level @Index(['name']) as well (would create a duplicate index causing migration failure)
  name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
```

**Column summary:**

| Column | TypeORM Type | DB Type | Constraints |
|--------|-------------|---------|-------------|
| `id` | `'uuid'` PrimaryGeneratedColumn | `uuid` | PK, `gen_random_uuid()` |
| `name` | `varchar(100)` | `varchar(100)` | NOT NULL, UNIQUE |
| `imageUrl` | `varchar(500)` | `varchar(500)` | NULLABLE |
| `createdAt` | `CreateDateColumn` | `timestamp` | auto |
| `updatedAt` | `UpdateDateColumn` | `timestamp` | auto |

The `@OneToMany` relation is declared but not loaded eagerly — the `products` field will be `undefined` unless explicitly joined. This keeps `findAll()` and `findById()` fast.

---

## 3. Database Migration

**File:** `libs/data-access/src/database/migrations/1760000001000-CreateCategoryAndLinkProduct.ts`

The timestamp `1760000001000` is the latest existing migration timestamp (`1760000000000`) plus 1000.

```typescript
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCategoryAndLinkProduct1760000001000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the categories table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true // ifNotExists = true (safe to re-run)
    );

    // 2. Add categoryId column to products (nullable, no cascade break)
    const productsTable = await queryRunner.getTable('products');
    const hasCategoryIdColumn = productsTable?.findColumnByName('categoryId');

    if (!hasCategoryIdColumn) {
      await queryRunner.addColumn(
        'products',
        new TableColumn({
          name: 'categoryId',
          type: 'uuid',
          isNullable: true,
        })
      );
    }

    // 3. Add index on products.categoryId
    const refreshedProductsTable = await queryRunner.getTable('products');
    const hasCategoryIndex = refreshedProductsTable?.indices.some(
      (idx) =>
        idx.columnNames.length === 1 && idx.columnNames[0] === 'categoryId'
    );

    if (!hasCategoryIndex) {
      await queryRunner.createIndex(
        'products',
        new TableIndex({
          name: 'IDX_products_categoryId',
          columnNames: ['categoryId'],
        })
      );
    }

    // 4. Add FK: products.categoryId -> categories.id ON DELETE SET NULL
    const refreshedTable = await queryRunner.getTable('products');
    const hasFk = refreshedTable?.foreignKeys.some(
      (fk) =>
        fk.columnNames.length === 1 &&
        fk.columnNames[0] === 'categoryId' &&
        fk.referencedTableName === 'categories'
    );

    if (!hasFk) {
      await queryRunner.createForeignKey(
        'products',
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedTableName: 'categories',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK from products
    const productsTable = await queryRunner.getTable('products');
    if (productsTable) {
      const categoryFk = productsTable.foreignKeys.find(
        (fk) =>
          fk.columnNames.length === 1 &&
          fk.columnNames[0] === 'categoryId' &&
          fk.referencedTableName === 'categories'
      );
      if (categoryFk) {
        await queryRunner.dropForeignKey('products', categoryFk);
      }

      // 2. Drop index on products.categoryId
      const categoryIndex = productsTable.indices.find(
        (idx) =>
          idx.columnNames.length === 1 && idx.columnNames[0] === 'categoryId'
      );
      if (categoryIndex) {
        await queryRunner.dropIndex('products', categoryIndex);
      }

      // 3. Drop categoryId column from products
      const categoryIdColumn = productsTable.findColumnByName('categoryId');
      if (categoryIdColumn) {
        await queryRunner.dropColumn('products', 'categoryId');
      }
    }

    // 4. Drop categories table
    const categoriesTable = await queryRunner.getTable('categories');
    if (categoriesTable) {
      await queryRunner.dropTable('categories');
    }
  }
}
```

**Migration safety notes:**
- `ifNotExists = true` on `createTable` makes the migration re-runnable without errors.
- All `addColumn` / `createIndex` / `createForeignKey` calls are guarded by existence checks, matching the pattern in `1760000000000-CreateUsersAndCustomerLink.ts`.
- Existing products rows receive `categoryId = NULL` automatically — no data backfill needed.
- `ON DELETE SET NULL` means deleting a category orphans its products (sets `categoryId` to NULL) rather than cascading a delete.

---

## 4. New CategoryRepository

**File:** `libs/data-access/src/repositories/CategoryRepository.ts`

```typescript
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { AppDataSource } from '../database/config';

export class CategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = AppDataSource.getRepository(Category);
  }

  /**
   * Returns all categories ordered by name ASC.
   * Includes a computed productCount via LEFT JOIN aggregate on products.
   */
  async findAll(): Promise<(Category & { productCount: number })[]> {
    const rows = await this.repository
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.productCount',
        'category.products'
      )
      .orderBy('category.name', 'ASC')
      .getMany();

    // TypeORM loadRelationCountAndMap attaches the count directly on the entity
    return rows as (Category & { productCount: number })[];
  }

  /**
   * Returns a single category by primary key, or null if not found.
   */
  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Returns a category matching the given name (case-sensitive), or null.
   * Used for uniqueness validation on create.
   */
  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({ where: { name } });
  }

  /**
   * Inserts and returns the new category.
   */
  async create(data: Pick<Category, 'name'> & { imageUrl?: string }): Promise<Category> {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  /**
   * Updates an existing category and returns the updated record, or null if not found.
   */
  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'imageUrl'>>
  ): Promise<Category | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Hard-deletes a category. Products with this categoryId have their
   * categoryId set to NULL via ON DELETE SET NULL at the DB level.
   * Returns true if a row was deleted, false if not found.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }
}
```

**Query builder notes:**
- `loadRelationCountAndMap('category.productCount', 'category.products')` — this TypeORM helper issues a single correlated COUNT subquery rather than loading all product rows. It attaches the count as `category.productCount` on each result object.
- All other methods use the same `findOne({ where: { id } })` / `repository.update(id, data)` / `repository.delete(id)` patterns already present in `ProductRepository`.

---

## 5. Modified: Product Entity

**File:** `libs/data-access/src/entities/Product.ts`

Add the following imports and fields. The existing columns are unchanged.

**New imports to add:**
```typescript
import { ManyToOne, JoinColumn } from 'typeorm';
// (Category import — resolved at runtime to avoid circular ref issues)
```

**New columns/relation to add after the `isAvailable` column:**

```typescript
  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;

  @ManyToOne('Category', 'products', {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: import('./Category').Category | null;
```

**Full modified `Product.ts` for reference:**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
@Index(['name'])
@Index(['unit'])
@Index(['isAvailable'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'integer', default: 1 })
  quantity!: number;

  @Column({
    type: 'enum',
    enum: ['gm', 'kg', 'pc'],
    default: 'kg',
  })
  unit!: 'gm' | 'kg' | 'pc';

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;

  @ManyToOne('Category', 'products', {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: import('./Category').Category | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

**Why `'Category'` string reference instead of direct import:** TypeORM supports string-based entity name references in relation decorators to avoid circular import issues between `Product.ts` and `Category.ts` (each references the other). The inline `import()` type on the `category` property is type-only and erased at runtime.

---

## 6. Modified: ProductRepository

**File:** `libs/data-access/src/repositories/ProductRepository.ts`

Add `categoryId?: string` to the `options` parameter and an `andWhere` clause inside `findAll`. The `leftJoinAndSelect` brings in the `category.name` field so callers don't need a separate fetch.

```typescript
async findAll(options?: {
  page?: number;
  limit?: number;
  search?: string;
  unit?: string;
  isAvailable?: boolean;
  categoryId?: string;       // NEW
}): Promise<{ products: Product[]; total: number }> {
  const { page = 1, limit = 10, search, unit, isAvailable, categoryId } =
    options || {};

  const queryBuilder = this.repository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category'); // NEW — eager-loads category name

  if (search) {
    queryBuilder.andWhere(
      '(product.name ILIKE :search OR product.description ILIKE :search)',
      { search: `%${search}%` }
    );
  }

  if (unit) {
    queryBuilder.andWhere('product.unit = :unit', { unit });
  }

  if (isAvailable !== undefined) {
    queryBuilder.andWhere('product.isAvailable = :isAvailable', {
      isAvailable,
    });
  }

  if (categoryId) {                                      // NEW
    queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
  }

  queryBuilder
    .orderBy('product.createdAt', 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const [products, total] = await queryBuilder.getManyAndCount();

  return { products, total };
}
```

The `leftJoinAndSelect` replaces the plain `createQueryBuilder` call. This means every product response now includes a `category` object (with `id` and `name`) when assigned, or `null` when not — used by both the admin and the web product list.

All other `ProductRepository` methods (`findById`, `findByName`, `create`, `update`, `delete`, `toggleAvailability`, `getAvailableProducts`) are **unchanged**.

---

## 7. New Category Routes + Controller

**File:** `apps/api/src/app/routes/categories.routes.ts`

```typescript
import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';
import { categoryUpload } from '../middleware/upload.middleware';

const router = Router();

// ── GET /api/categories ─────────────────────────────────────────────────────
// List all categories with computed productCount, ordered by name ASC.
router.get('/', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const categories = await categoryRepo.findAll();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ── GET /api/categories/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const category = await categoryRepo.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ── POST /api/categories ────────────────────────────────────────────────────
// Body: multipart/form-data with optional image field named "image".
router.post('/', categoryUpload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'name is required',
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'name must be 100 characters or fewer',
      });
    }

    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    // Uniqueness check
    const existing = await categoryRepo.findByName(name.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A category named "${name.trim()}" already exists`,
      });
    }

    const categoryData: { name: string; imageUrl?: string } = {
      name: name.trim(),
    };

    if (req.file) {
      categoryData.imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const category = await categoryRepo.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ── PUT /api/categories/:id ─────────────────────────────────────────────────
router.put('/:id', categoryUpload.single('image'), async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const existing = await categoryRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updateData: Partial<{ name: string; imageUrl: string }> = {};

    if (req.body.name !== undefined) {
      const trimmed = (req.body.name as string).trim();

      if (trimmed.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'name cannot be empty',
        });
      }

      if (trimmed.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'name must be 100 characters or fewer',
        });
      }

      // Uniqueness check — exclude current record
      const nameConflict = await categoryRepo.findByName(trimmed);
      if (nameConflict && nameConflict.id !== req.params.id) {
        return res.status(409).json({
          success: false,
          message: `A category named "${trimmed}" already exists`,
        });
      }

      updateData.name = trimmed;
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const updated = await categoryRepo.update(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ── DELETE /api/categories/:id ──────────────────────────────────────────────
// Products with this categoryId have their categoryId set to NULL via DB cascade.
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const deleted = await categoryRepo.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
```

---

## 8. Modified: products.routes.ts

**File:** `apps/api/src/app/routes/products.routes.ts`

The only change is in the `GET /` handler: extract `categoryId` from query params and forward it to `productRepo.findAll()`.

```typescript
// Inside the GET '/' handler, after the existing query param extractions:

const categoryId = req.query.categoryId as string | undefined;

// Then update the findAll call:
const { products, total } = await productRepo.findAll({
  page,
  limit,
  search,
  unit,
  isAvailable,
  categoryId,   // NEW
});
```

**Exact diff — replace the existing `findAll` call block:**

```typescript
// Before:
const { products, total } = await productRepo.findAll({
  page,
  limit,
  search,
  unit,
  isAvailable,
});

// After:
const categoryId = req.query.categoryId as string | undefined;
const { products, total } = await productRepo.findAll({
  page,
  limit,
  search,
  unit,
  isAvailable,
  categoryId,
});
```

No other handlers in `products.routes.ts` change.

---

## 9. Modified: server.ts

**File:** `apps/api/src/app/server.ts`

Add the import and route registration immediately after the products router line.

```typescript
// Add to imports at top of file (after productsRouter import):
import categoriesRouter from './routes/categories.routes';

// Add to Routes block (after app.use('/api/products', productsRouter)):
app.use('/api/categories', categoriesRouter);
```

**Full modified Routes block for reference:**

```typescript
// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);   // NEW
app.use('/api/customers', customersRouter);
app.use('/api/societies', societiesRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/monthly-billing', monthlyBillingRouter);
app.use('/api/auth', authRouter);
```

---

## 10. Modified: DatabaseService

**File:** `libs/data-access/src/services/DatabaseService.ts`

Add `CategoryRepository` following the exact same pattern as `ProductRepository`.

**New import (add to existing imports at top):**
```typescript
import { CategoryRepository } from '../repositories/CategoryRepository';
```

**New private field (add to class body after `walletRepository`):**
```typescript
private categoryRepository: CategoryRepository;
```

**New constructor line (add after `this.walletRepository = new WalletRepository()`):**
```typescript
this.categoryRepository = new CategoryRepository();
```

**New public method (add after `getWalletRepository()`):**
```typescript
public getCategoryRepository(): CategoryRepository {
  this.ensureConnection();
  return this.categoryRepository;
}
```

---

## 11. Modified: libs/types/src/index.ts

**File:** `libs/types/src/index.ts`

### New interfaces to add (at end of file, before `BillStatus`):

```typescript
// Category DTOs
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
  imageUrl?: string;  // NOTE: PRD B10 omitted imageUrl, but the implementation assigns it from the uploaded file — this design doc version is authoritative
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
```

### Modified: `ProductDto`

Add two optional fields:

```typescript
export interface ProductDto {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId?: string | null;     // NEW
  categoryName?: string | null;   // NEW — populated from joined category.name
  createdAt: string;
  updatedAt: string;
}
```

### Modified: `CreateProductDto`

```typescript
export interface CreateProductDto {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description?: string;
  imageUrl?: string;
  categoryId?: string | null;   // NEW
}
```

### Modified: `UpdateProductDto`

```typescript
export interface UpdateProductDto extends Partial<CreateProductDto> {
  isAvailable?: boolean;
  // categoryId is inherited from Partial<CreateProductDto>
}
```

No other existing interfaces change.

---

## 12. Modified: libs/data-access/src/index.ts

**File:** `libs/data-access/src/index.ts`

### New entity type export (add after `MonthlyBill` export):

```typescript
export type { Category } from './entities/Category';
```

### New repository class export (add after `MonthlyBillRepository` export):

```typescript
export { CategoryRepository } from './repositories/CategoryRepository';
```

### New hooks to add at the end of the existing hooks section:

Following the exact same `useState` + `useEffect` pattern as `useProducts` and `useSocieties`:

```typescript
// Category API hooks
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
      setError(
        err instanceof Error ? err.message : 'Failed to fetch categories'
      );
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
        setError(
          err instanceof Error ? err.message : 'Failed to fetch category'
        );
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

Also add `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` to the import from `@shreehari/types` at the top of the file:

```typescript
import {
  // ...existing imports...
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@shreehari/types';
```

---

## 13. Upload Middleware for Categories

**File:** `apps/api/src/app/middleware/upload.middleware.ts`

Add a `categoryUpload` instance below the existing `upload` export. The `fileFilter` and `limits` are identical — only `destination` changes.

```typescript
// Ensure category uploads directory exists
const categoryUploadsDir = path.join(process.cwd(), 'uploads', 'categories');
if (!fs.existsSync(categoryUploadsDir)) {
  fs.mkdirSync(categoryUploadsDir, { recursive: true });
}

// Configure multer storage for categories
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
  fileFilter,           // reuse the same fileFilter already declared above
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB — same as products
  },
});
```

The existing `upload` export and all existing code in the file remain unchanged. The `fileFilter` function is already declared at module scope and is reused by reference.

**Resulting full file structure (for reference):**

```
upload.middleware.ts
├── uploadsDir          (uploads/products)
├── storage             (diskStorage for products)
├── fileFilter          (shared — JPEG/PNG/WebP/GIF, 5 MB)
├── export upload       (multer instance for products)
├── categoryUploadsDir  (uploads/categories)  ← NEW
├── categoryStorage     (diskStorage for categories) ← NEW
└── export categoryUpload (multer instance for categories) ← NEW
```

---

## 14. API Contracts

All responses use the `{ success: boolean, data: T }` envelope. Error responses include `{ success: false, message: string, error?: string }`.

### GET /api/categories

**Request:** No body, no required params.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Fresh Vegetables",
      "imageUrl": "/uploads/categories/Fresh-Vegetables-1760000001000-123456789.jpg",
      "productCount": 12,
      "createdAt": "2026-03-19T10:00:00.000Z",
      "updatedAt": "2026-03-19T10:00:00.000Z"
    },
    {
      "id": "8a1b2c3d-4e5f-6789-abcd-ef0123456789",
      "name": "Fruits",
      "imageUrl": null,
      "productCount": 0,
      "createdAt": "2026-03-19T11:00:00.000Z",
      "updatedAt": "2026-03-19T11:00:00.000Z"
    }
  ]
}
```

---

### GET /api/categories/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Fresh Vegetables",
    "imageUrl": "/uploads/categories/Fresh-Vegetables-1760000001000-123456789.jpg",
    "createdAt": "2026-03-19T10:00:00.000Z",
    "updatedAt": "2026-03-19T10:00:00.000Z"
  }
}
```

**Response 404:**
```json
{ "success": false, "message": "Category not found" }
```

---

### POST /api/categories

**Request:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `name` | string (max 100) | Yes |
| `image` | file (JPEG/PNG/WebP/GIF, max 5 MB) | No |

**Response 201:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Fresh Vegetables",
    "imageUrl": "/uploads/categories/Fresh-Vegetables-1760000001000-123456789.jpg",
    "createdAt": "2026-03-19T10:00:00.000Z",
    "updatedAt": "2026-03-19T10:00:00.000Z"
  }
}
```

**Response 400:** name missing or empty.
**Response 409:** category name already exists.

---

### PUT /api/categories/:id

**Request:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `name` | string (max 100) | No (omit to keep current) |
| `image` | file (JPEG/PNG/WebP/GIF, max 5 MB) | No |

**Response 200:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { /* updated category object */ }
}
```

**Response 404:** category not found.
**Response 409:** name conflicts with another category.

---

### DELETE /api/categories/:id

**Request:** No body.

**Response 200:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Response 404:** category not found.

**Side effect:** All products with `categoryId = <deleted id>` have their `categoryId` set to `NULL` at the database level via the `ON DELETE SET NULL` foreign key constraint. No application-level code is needed.

---

### GET /api/products?categoryId=:uuid (modified)

**New optional query param:** `categoryId` (UUID string)

When provided, only products whose `categoryId` matches are returned. Can be combined with `isAvailable=true`, `search`, `unit`, `page`, `limit`.

**Example request:**
```
GET /api/products?categoryId=3fa85f64-5717-4562-b3fc-2c963f66afa6&isAvailable=true&limit=200
```

**Response 200** — same envelope as existing, with `category` relation now included on each product:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Tomatoes",
      "price": "45.00",
      "quantity": 500,
      "unit": "gm",
      "isAvailable": true,
      "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "category": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Fresh Vegetables"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { "page": 1, "limit": 200, "total": 1, "totalPages": 1 }
}
```

When `categoryId` is omitted, behaviour is identical to the current endpoint — all products are returned regardless of category (backward compatible).

---

## 15. Integration Points (Consumed by Frontend)

### Admin app (`apps/admin`)

| What admin needs | API call | Notes |
|-----------------|----------|-------|
| Categories list page | `GET /api/categories` | Returns `productCount` for the table column |
| Category form (edit mode pre-fill) | `GET /api/categories/:id` | Populates name and current imageUrl. **Note:** `productCount` is NOT returned by this endpoint (uses plain `findOne`, no `loadRelationCountAndMap`). Do not attempt to display product count on the edit form. |
| Create category | `POST /api/categories` (multipart) | Returns created category with generated UUID |
| Update category | `PUT /api/categories/:id` (multipart) | Validates name uniqueness against other records |
| Delete category | `DELETE /api/categories/:id` | Cascades to products via DB FK |
| Product form — category dropdown | `GET /api/categories` | Uses `{ id, name }` pairs only |
| Products list — category column | `GET /api/products` | `category.name` now present on each product via `leftJoinAndSelect` |
| Save product with category | `POST /api/products` or `PUT /api/products/:id` | Pass `categoryId` in form data; `null` for no category |

**Contracts the admin must respect:**
- Product create/update: send `categoryId` as a UUID string or omit the field entirely (do not send empty string — send `null` or omit).
- Image upload for categories: use field name `"image"` in the multipart form, identical to the product image field.

### Web app (`apps/web`)

| What web needs | API call | Notes |
|---------------|----------|-------|
| Home page category grid | `GET /api/categories` | Maps `imageUrl` through `toApiAssetUrl()` |
| Category detail header (name) | `GET /api/categories/:id` | Single category by UUID from URL param |
| Category sidebar (all categories) | `GET /api/categories` | Same endpoint, no extra params |
| Category detail products | `GET /api/products?categoryId=<uuid>&isAvailable=true&limit=200` | Only available, categorized products |
| Product search dialog | `GET /api/products?search=<query>&isAvailable=true&limit=30` | No backend change needed; existing `ILIKE` search works |

**Contracts the web must respect:**
- Category UUIDs come directly from the API; never construct or hardcode them.
- `imageUrl` values from the category API are relative paths (e.g. `/uploads/categories/...`) and must be passed through `toApiAssetUrl()` before rendering.
- Products with `categoryId = null` will never appear in `?categoryId=<uuid>` queries — they are only visible in admin.

---

*End of Backend Design Doc.*
