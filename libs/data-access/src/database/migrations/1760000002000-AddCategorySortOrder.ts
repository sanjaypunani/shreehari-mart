import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddCategorySortOrder1760000002000 implements MigrationInterface {
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
}
