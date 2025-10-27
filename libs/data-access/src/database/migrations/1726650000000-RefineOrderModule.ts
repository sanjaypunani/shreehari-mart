import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class RefineOrderModule1726650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if orders table exists and update it
    const ordersTable = await queryRunner.getTable('orders');
    if (ordersTable) {
      // Add payment_mode column to orders table
      await queryRunner.addColumn(
        'orders',
        new TableColumn({
          name: 'payment_mode',
          type: 'varchar',
          length: '20',
          isNullable: false,
          default: "'cod'",
        })
      );

      // Update order status enum to match requirements
      await queryRunner.query(`
        ALTER TABLE orders DROP CONSTRAINT IF EXISTS "CHK_orders_status";
      `);

      await queryRunner.query(`
        ALTER TABLE orders ADD CONSTRAINT "CHK_orders_status" 
        CHECK (status IN ('pending','confirmed','delivered','cancelled'))
      `);

      // Add payment_mode constraint
      await queryRunner.query(`
        ALTER TABLE orders ADD CONSTRAINT "CHK_orders_payment_mode" 
        CHECK (payment_mode IN ('wallet','monthly','cod'))
      `);

      // Update existing records to have default payment_mode
      await queryRunner.query(`
        UPDATE orders SET payment_mode = 'cod' WHERE payment_mode IS NULL
      `);
    }

    // Check if order_items table exists and update it
    const orderItemsTable = await queryRunner.getTable('order_items');
    if (orderItemsTable) {
      // Add new columns to order_items table for refined pricing logic
      await queryRunner.addColumns('order_items', [
        new TableColumn({
          name: 'ordered_quantity',
          type: 'integer',
          isNullable: false,
          default: 1,
        }),
        new TableColumn({
          name: 'unit',
          type: 'varchar',
          length: '10',
          isNullable: false,
          default: "'pc'",
        }),
        new TableColumn({
          name: 'price_per_base_unit',
          type: 'decimal',
          precision: 10,
          scale: 2,
          isNullable: false,
          default: 0,
        }),
        new TableColumn({
          name: 'base_quantity',
          type: 'integer',
          isNullable: false,
          default: 1,
        }),
        new TableColumn({
          name: 'final_price',
          type: 'decimal',
          precision: 10,
          scale: 2,
          isNullable: false,
          default: 0,
        }),
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        }),
      ]);

      // Add unit constraint
      await queryRunner.query(`
        ALTER TABLE order_items ADD CONSTRAINT "CHK_order_items_unit" 
        CHECK (unit IN ('gm','kg','pc'))
      `);

      // Update existing order_items records
      await queryRunner.query(`
        UPDATE order_items 
        SET 
          ordered_quantity = quantity,
          unit = 'pc',
          price_per_base_unit = price,
          base_quantity = 1,
          final_price = total
        WHERE ordered_quantity IS NULL
      `);
    }

    // Create order_payments table (optional audit trail) - TEMPORARILY DISABLED
    // await queryRunner.createTable(
    //   new Table({
    //     name: 'order_payments',
    //     columns: [
    //       {
    //         name: 'id',
    //         type: 'uuid',
    //         isPrimary: true,
    //         generationStrategy: 'uuid',
    //         default: 'gen_random_uuid()',
    //       },
    //       {
    //         name: 'order_id',
    //         type: 'uuid',
    //       },
    //       {
    //         name: 'amount',
    //         type: 'decimal',
    //         precision: 10,
    //         scale: 2,
    //       },
    //       {
    //         name: 'method',
    //         type: 'varchar',
    //         length: '20',
    //       },
    //       {
    //         name: 'status',
    //         type: 'varchar',
    //         length: '20',
    //         default: "'pending'",
    //       },
    //       {
    //         name: 'created_at',
    //         type: 'timestamp',
    //         default: 'now()',
    //       },
    //     ],
    //   }),
    //   true
    // );

    // Add constraints for order_payments - TEMPORARILY DISABLED
    // await queryRunner.query(`
    //   ALTER TABLE order_payments ADD CONSTRAINT "CHK_order_payments_method"
    //   CHECK (method IN ('wallet','monthly','cod'))
    // `);

    // await queryRunner.query(`
    //   ALTER TABLE order_payments ADD CONSTRAINT "CHK_order_payments_status"
    //   CHECK (status IN ('pending','success','failed'))
    // `);

    // // Add foreign key for order_payments
    // await queryRunner.createForeignKey(
    //   'order_payments',
    //   new TableForeignKey({
    //     columnNames: ['order_id'],
    //     referencedTableName: 'orders',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE',
    //   })
    // );

    // Add indexes for better performance
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_ORDERS_PAYMENT_MODE',
        columnNames: ['payment_mode'],
      })
    );

    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        name: 'IDX_ORDER_ITEMS_UNIT',
        columnNames: ['unit'],
      })
    );

    // TEMPORARILY DISABLED - Order payments indexes
    // await queryRunner.createIndex(
    //   'order_payments',
    //   new TableIndex({
    //     name: 'IDX_ORDER_PAYMENTS_METHOD',
    //     columnNames: ['method'],
    //   })
    // );

    // await queryRunner.createIndex(
    //   'order_payments',
    //   new TableIndex({
    //     name: 'IDX_ORDER_PAYMENTS_STATUS',
    //     columnNames: ['status'],
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys and indexes
    const orderPaymentsTable = await queryRunner.getTable('order_payments');
    if (orderPaymentsTable) {
      const orderPaymentsFk = orderPaymentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('order_id') !== -1
      );
      if (orderPaymentsFk) {
        await queryRunner.dropForeignKey('order_payments', orderPaymentsFk);
      }
    }

    // Drop indexes
    await queryRunner.dropIndex('orders', 'IDX_ORDERS_PAYMENT_MODE');
    await queryRunner.dropIndex('order_items', 'IDX_ORDER_ITEMS_UNIT');
    await queryRunner.dropIndex('order_payments', 'IDX_ORDER_PAYMENTS_METHOD');
    await queryRunner.dropIndex('order_payments', 'IDX_ORDER_PAYMENTS_STATUS');

    // Drop order_payments table
    await queryRunner.dropTable('order_payments');

    // Remove columns from order_items table
    await queryRunner.dropColumns('order_items', [
      'ordered_quantity',
      'unit',
      'price_per_base_unit',
      'base_quantity',
      'final_price',
      'created_at',
    ]);

    // Remove payment_mode column from orders table
    await queryRunner.dropColumn('orders', 'payment_mode');

    // Restore original order status constraint
    await queryRunner.query(`
      ALTER TABLE orders DROP CONSTRAINT IF EXISTS "CHK_orders_status";
    `);

    await queryRunner.query(`
      ALTER TABLE orders ADD CONSTRAINT "CHK_orders_status" 
      CHECK (status IN ('pending','processing','shipped','delivered','cancelled'))
    `);
  }
}
