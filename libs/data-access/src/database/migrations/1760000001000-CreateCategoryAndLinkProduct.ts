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
