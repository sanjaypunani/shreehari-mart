# Task: Category Ordering — Data Foundation (Backend)

## Objective

Persist a `sortOrder` integer column to the `categories` table, backfill all existing rows with sequential values ordered alphabetically by name, and update all repository operations to read and write the new column. After this task the database and repository are the only changed components; the API layer and frontend are unaffected.

## Target Files

- `libs/data-access/src/entities/Category.ts` — modify — add `sortOrder` column with `@Index()` decorator
- `libs/data-access/src/database/migrations/<timestamp>-AddCategorySortOrder.ts` — create — add column, backfill via ROW_NUMBER, create index; idempotent `up()` and `down()`
- `libs/data-access/src/repositories/CategoryRepository.ts` — modify — update `findAll()` ordering; wrap `create()` in a shift transaction; add `ReorderValidationError` class; add `reorder()` method with parameterized CASE query

## Implementation Steps

1. **Add `sortOrder` column to the Category entity**

   In `libs/data-access/src/entities/Category.ts`, insert the following column after `imageUrl` and before `createdAt`. The `Index` decorator is already imported in this file.

   ```typescript
   @Index()
   @Column({ type: 'int', default: 0 })
   sortOrder!: number;
   ```

2. **Create the TypeORM migration file**

   Generate the timestamp at file-creation time using `Date.now()`. Place the file at:
   `libs/data-access/src/database/migrations/<timestamp>-AddCategorySortOrder.ts`

   The class name must be `AddCategorySortOrder<timestamp>` (matching the existing convention in that directory, e.g. `1760000000000-CreateUsersAndCustomerLink.ts`).

   **`up()` implementation** (idempotent — safe to re-run):

   ```typescript
   public async up(queryRunner: QueryRunner): Promise<void> {
     const categoriesTable = await queryRunner.getTable('categories');

     // Step 1: Add sortOrder column (idempotent guard)
     const hasSortOrderColumn = categoriesTable?.findColumnByName('sortOrder');
     if (!hasSortOrderColumn) {
       await queryRunner.addColumn(
         'categories',
         new TableColumn({
           name: 'sortOrder',
           type: 'int',
           isNullable: false,
           default: 0,
         })
       );
     }

     // Step 2: Backfill existing rows ordered by name ASC (unconditional — TypeORM's
     // migrations table prevents re-execution, so no data-based guard is needed)
     await queryRunner.query(`
       UPDATE categories
       SET "sortOrder" = sub.row_num
       FROM (
         SELECT id,
                ROW_NUMBER() OVER (ORDER BY name ASC) - 1 AS row_num
         FROM categories
       ) sub
       WHERE categories.id = sub.id
     `);

     // Step 3: Add index on sortOrder (idempotent guard)
     const refreshedTable = await queryRunner.getTable('categories');
     const hasSortOrderIndex = refreshedTable?.indices.some(
       (idx) =>
         idx.columnNames.length === 1 && idx.columnNames[0] === 'sortOrder'
     );

     if (!hasSortOrderIndex) {
       await queryRunner.createIndex(
         'categories',
         new TableIndex({
           name: 'IDX_categories_sortOrder',
           columnNames: ['sortOrder'],
         })
       );
     }
   }
   ```

   **`down()` implementation**:

   ```typescript
   public async down(queryRunner: QueryRunner): Promise<void> {
     // 1. Drop index
     const categoriesTable = await queryRunner.getTable('categories');
     const sortOrderIndex = categoriesTable?.indices.find(
       (idx) =>
         idx.columnNames.length === 1 && idx.columnNames[0] === 'sortOrder'
     );
     if (sortOrderIndex) {
       await queryRunner.dropIndex('categories', sortOrderIndex);
     }

     // 2. Drop column
     const hasSortOrderColumn = categoriesTable?.findColumnByName('sortOrder');
     if (hasSortOrderColumn) {
       await queryRunner.dropColumn('categories', 'sortOrder');
     }
   }
   ```

   Required imports at the top of the migration file: `QueryRunner`, `TableColumn`, `TableIndex` from `typeorm`.

3. **Update `findAll()` ordering in `CategoryRepository.ts`**

   Replace the single `.orderBy('category.name', 'ASC')` call with a two-level sort:

   ```typescript
   .orderBy('category.sortOrder', 'ASC')
   .addOrderBy('category.name', 'ASC')
   ```

   No other changes to `findAll()`.

4. **Wrap `create()` in a shift transaction**

   Replace the current simple `this.repository.create(data)` + `this.repository.save(category)` sequence with a transaction that:
   1. Increments every existing row's `sortOrder` by 1 (no WHERE clause — all rows).
   2. Inserts the new category with `sortOrder: 0`.

   ```typescript
   async create(
     data: Pick<Category, 'name'> & { imageUrl?: string }
   ): Promise<Category> {
     return AppDataSource.transaction(async (manager) => {
       // Shift all existing rows up by 1
       await manager
         .createQueryBuilder()
         .update(Category)
         .set({ sortOrder: () => '"sortOrder" + 1' })
         .execute();

       // Insert new category at position 0
       const category = manager.create(Category, { ...data, sortOrder: 0 });
       return manager.save(Category, category);
     });
   }
   ```

   The `sortOrder: () => '"sortOrder" + 1'` expression issues a single `UPDATE categories SET "sortOrder" = "sortOrder" + 1` statement (no per-row round-trips).

5. **Add `ReorderValidationError` class to `CategoryRepository.ts`**

   Add this exported class near the top of the file (before the repository class):

   ```typescript
   export class ReorderValidationError extends Error {
     constructor(message: string) {
       super(message);
       this.name = 'ReorderValidationError';
     }
   }
   ```

6. **Add `reorder()` method to `CategoryRepository`**

   Add `async reorder(orderedIds: string[]): Promise<void>` using a fully parameterized CASE query (no string interpolation of user-supplied values):

   ```typescript
   async reorder(orderedIds: string[]): Promise<void> {
     await AppDataSource.transaction(async (manager) => {
       // Guard: no duplicate IDs
       if (new Set(orderedIds).size !== orderedIds.length) {
         throw new ReorderValidationError('The provided ID list contains duplicate entries.');
       }

       // Fetch all current category IDs for validation
       const existing = await manager
         .createQueryBuilder(Category, 'category')
         .select('category.id')
         .getMany();

       const existingIdSet = new Set(existing.map((c) => c.id));

       // Validate: submitted list must contain exactly the same IDs
       if (
         orderedIds.length !== existingIdSet.size ||
         !orderedIds.every((id) => existingIdSet.has(id))
       ) {
         throw new ReorderValidationError(
           'The provided ID list does not match the complete set of categories.'
         );
       }

       // Bulk-assign sortOrder = array index using a single parameterized CASE statement.
       // Parameters: alternating id / index pairs.
       const caseParts: string[] = [];
       const params: (string | number)[] = [];

       orderedIds.forEach((id, index) => {
         const p1 = params.length + 1; // parameter index for id
         const p2 = params.length + 2; // parameter index for sortOrder value
         caseParts.push(`WHEN id = $${p1} THEN $${p2}`);
         params.push(id, index);
       });

       // Reuse id parameters ($1, $3, $5, ...) for the WHERE IN clause
       const inParams = orderedIds.map((_, i) => `$${i * 2 + 1}`).join(', ');

       await manager.query(
         `UPDATE categories SET "sortOrder" = CASE ${caseParts.join(' ')} ELSE "sortOrder" END WHERE id IN (${inParams})`,
         params
       );
     });
   }
   ```

   Every `$N` placeholder is a bound parameter — no user-supplied content is ever concatenated as raw SQL text.

7. **Run the migration**

   From `shreehari-mart/`:
   ```bash
   npm run migration:run
   ```

## Reference Documents

- Design Doc: `shreehari-mart/docs/design/category-ordering-backend-design.md` (Sections 2, 3, 7)

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-BE-1 | Migration runs without error; `sortOrder` column exists in `categories` table after `npm run migration:run` |
| AC-BE-2 | After migration, existing categories have sequential `sortOrder` values (0-indexed, alphabetical by name) |
| AC-BE-3 | `GET /categories` returns categories ordered by `sortOrder ASC, name ASC` |
| AC-BE-4 | Creating a new category sets its `sortOrder = 0` and increments all other categories' `sortOrder` by 1 |
| NFR-R-1 | `reorder()` is atomic — any failure rolls back the entire transaction |
| NFR-P-2 | Reorder update uses a single bulk `UPDATE` statement — no per-row round-trips |
| NFR-P-3 | `IDX_categories_sortOrder` index is created by the migration |
| NFR-D-2 | Migration `up()` is idempotent — safe to run against a DB where the column already exists |
| NFR-BC-1 | Migration is non-destructive — existing category data is unchanged except for the addition of `sortOrder` |

## Dependencies

None — this is the first phase. No prior tasks must be complete.
