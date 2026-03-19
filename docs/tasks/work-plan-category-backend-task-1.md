# Backend Task 1 — Foundation: Types + Entity + Migration

**Track:** Backend
**Depends on:** None (first task)
**Blocks:** Task 2

---

## Objective

Lay the data-layer foundation for the Category Module by:
1. Adding `CategoryDto`, `CreateCategoryDto`, and `UpdateCategoryDto` to the shared types library.
2. Extending `ProductDto`, `CreateProductDto`, and `UpdateProductDto` with `categoryId` and `categoryName` fields.
3. Creating the `Category` TypeORM entity.
4. Adding the `categoryId` nullable foreign-key column and `@ManyToOne` relation to the `Product` entity.
5. Writing the TypeORM migration that creates the `categories` table, adds `categoryId` to `products`, creates the index, and establishes the `ON DELETE SET NULL` foreign key.

After this task, running `npm run migration:run` from `shreehari-mart/` will apply the schema changes to the database.

---

## Files Changed

| File | Status |
|------|--------|
| `libs/types/src/index.ts` | Modified |
| `libs/data-access/src/entities/Category.ts` | New |
| `libs/data-access/src/entities/Product.ts` | Modified |
| `libs/data-access/src/database/migrations/1760000001000-CreateCategoryAndLinkProduct.ts` | New |

---

## Implementation Steps

### Step 1 — `libs/types/src/index.ts`

**1a. Add new Category DTOs** at the end of the file, before the `BillStatus` type (or at end of file):

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
  imageUrl?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
```

**1b. Extend `ProductDto`** — add two optional fields inside the existing interface:

```typescript
categoryId?: string | null;
categoryName?: string | null;
```

**1c. Extend `CreateProductDto`** — add one optional field:

```typescript
categoryId?: string | null;
```

**1d. Extend `UpdateProductDto`** — `categoryId` is inherited via `Partial<CreateProductDto>`, so no change needed if the interface uses `extends Partial<CreateProductDto>`. Verify this is the case; if not, add `categoryId?: string | null` explicitly.

---

### Step 2 — `libs/data-access/src/entities/Category.ts` (new file)

Create the file with this exact content:

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
  @Index({ unique: true })
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

Important: use only the column-level `@Index({ unique: true })` on `name`. Do NOT add a class-level `@Index(['name'])` — it would create a duplicate index and cause a migration failure.

---

### Step 3 — `libs/data-access/src/entities/Product.ts`

**3a. Add imports** to the existing import block from `'typeorm'`:

```typescript
import { ManyToOne, JoinColumn } from 'typeorm';
```

**3b. Add the new columns after the `isAvailable` column** and before `createdAt`:

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

Use the string-based `'Category'` reference (not a direct import) for the `@ManyToOne` decorator to avoid circular import issues between `Product.ts` and `Category.ts`. The inline `import()` type on the `category` property is type-only and erased at runtime.

---

### Step 4 — Migration file: `libs/data-access/src/database/migrations/1760000001000-CreateCategoryAndLinkProduct.ts` (new file)

The full migration is specified in `design-doc-category-backend.md` section 3. Key points:

- `ifNotExists = true` on `createTable` (safe to re-run).
- All `addColumn`, `createIndex`, and `createForeignKey` calls are guarded by existence checks (`hasCategoryIdColumn`, `hasCategoryIndex`, `hasFk`).
- `ON DELETE SET NULL` / `ON UPDATE CASCADE` for the FK from `products.categoryId` to `categories.id`.
- The `down()` function drops FK, index, column, and table in that order.

Refer to `design-doc-category-backend.md` section 3 for the complete migration source to copy verbatim.

---

## Acceptance Criteria

1. `tsc --noEmit` passes for `libs/types` — no TypeScript errors in `index.ts`.
2. `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` are importable from `@shreehari/types`.
3. `ProductDto` has `categoryId?: string | null` and `categoryName?: string | null`.
4. `libs/data-access/src/entities/Category.ts` compiles without errors and the `@Index({ unique: true })` decorator is on `name` only at the column level.
5. `libs/data-access/src/entities/Product.ts` compiles without circular-import errors.
6. Running `npm run migration:run` from `shreehari-mart/` applies the migration without errors.
7. After migration, `psql` (or DB client) shows:
   - `categories` table exists with columns: `id`, `name`, `imageUrl`, `createdAt`, `updatedAt`.
   - `products` table has a `categoryId uuid NULLABLE` column.
   - `IDX_products_categoryId` index exists on `products.categoryId`.
   - FK from `products.categoryId` → `categories.id` with `ON DELETE SET NULL` exists.
8. Running the migration a second time does not throw (all guards are present).
9. `npm run migration:run` followed by a manual `down()` call rolls back cleanly (drops FK, index, column, table in order).

---

## Dependencies

None. This is the first task in the chain.
