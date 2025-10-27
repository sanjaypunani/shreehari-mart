import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateProductSchema1726239600000 implements MigrationInterface {
  name = 'UpdateProductSchema1726239600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
        default: 0,
      })
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'quantity',
        type: 'integer',
        isNullable: false,
        default: 1,
      })
    );

    // Migrate existing data: copy pricePerUnit to price
    await queryRunner.query(`
      UPDATE products SET price = "pricePerUnit", quantity = 1 WHERE price = 0
    `);

    // Change unit column to enum type
    await queryRunner.query(`
      ALTER TABLE products ALTER COLUMN unit TYPE varchar(10)
    `);

    // Add constraint for unit enum
    await queryRunner.query(`
      ALTER TABLE products ADD CONSTRAINT products_unit_check 
      CHECK (unit IN ('gm', 'kg', 'pc'))
    `);

    // Drop the old pricePerUnit column
    await queryRunner.dropColumn('products', 'pricePerUnit');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back pricePerUnit column
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'pricePerUnit',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
        default: 0,
      })
    );

    // Migrate data back: calculate pricePerUnit from price/quantity
    await queryRunner.query(`
      UPDATE products SET "pricePerUnit" = CASE 
        WHEN quantity > 0 THEN price / quantity 
        ELSE price 
      END
    `);

    // Remove constraint
    await queryRunner.query(`
      ALTER TABLE products DROP CONSTRAINT IF EXISTS products_unit_check
    `);

    // Change unit back to original type
    await queryRunner.query(`
      ALTER TABLE products ALTER COLUMN unit TYPE varchar(10)
    `);

    // Drop new columns
    await queryRunner.dropColumn('products', 'price');
    await queryRunner.dropColumn('products', 'quantity');
  }
}
