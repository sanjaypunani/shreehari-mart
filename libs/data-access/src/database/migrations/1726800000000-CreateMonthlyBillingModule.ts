import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateMonthlyBillingModule1726800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create monthly_bills table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_bills',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'bill_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'billing_month',
            type: 'varchar',
            length: '7',
            comment: 'Format: YYYY-MM',
            isNullable: false,
          },
          {
            name: 'billing_year',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'order_count',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'sent', 'paid', 'overdue'],
            default: "'draft'",
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      })
    );

    // Add foreign key constraint to customers table
    await queryRunner.createForeignKey(
      'monthly_bills',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    // Add indexes for better performance
    await queryRunner.createIndex(
      'monthly_bills',
      new TableIndex({
        name: 'IDX_monthly_bills_customer_id',
        columnNames: ['customer_id'],
      })
    );

    await queryRunner.createIndex(
      'monthly_bills',
      new TableIndex({
        name: 'IDX_monthly_bills_billing_month',
        columnNames: ['billing_month'],
      })
    );

    await queryRunner.createIndex(
      'monthly_bills',
      new TableIndex({
        name: 'IDX_monthly_bills_billing_year',
        columnNames: ['billing_year'],
      })
    );

    await queryRunner.createIndex(
      'monthly_bills',
      new TableIndex({
        name: 'IDX_monthly_bills_status',
        columnNames: ['status'],
      })
    );

    await queryRunner.createIndex(
      'monthly_bills',
      new TableIndex({
        name: 'IDX_monthly_bills_customer_month',
        columnNames: ['customer_id', 'billing_month'],
      })
    );

    // Add monthly_bill_id column to orders table
    await queryRunner.query(`
      ALTER TABLE orders ADD COLUMN monthly_bill_id uuid NULL
    `);

    // Add foreign key constraint from orders to monthly_bills
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['monthly_bill_id'],
        referencedTableName: 'monthly_bills',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    );

    // Add index for monthly_bill_id in orders table
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_orders_monthly_bill_id',
        columnNames: ['monthly_bill_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove index from orders table
    await queryRunner.dropIndex('orders', 'IDX_orders_monthly_bill_id');

    // Remove foreign key from orders table
    const ordersForeignKeys = await queryRunner.getTable('orders');
    if (ordersForeignKeys) {
      const foreignKey = ordersForeignKeys.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('monthly_bill_id') !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('orders', foreignKey);
      }
    }

    // Remove column from orders table
    await queryRunner.query(`ALTER TABLE orders DROP COLUMN monthly_bill_id`);

    // Remove indexes from monthly_bills table
    await queryRunner.dropIndex(
      'monthly_bills',
      'IDX_monthly_bills_customer_month'
    );
    await queryRunner.dropIndex('monthly_bills', 'IDX_monthly_bills_status');
    await queryRunner.dropIndex(
      'monthly_bills',
      'IDX_monthly_bills_billing_year'
    );
    await queryRunner.dropIndex(
      'monthly_bills',
      'IDX_monthly_bills_billing_month'
    );
    await queryRunner.dropIndex(
      'monthly_bills',
      'IDX_monthly_bills_customer_id'
    );

    // Remove foreign key constraint from monthly_bills table
    const monthlyBillsTable = await queryRunner.getTable('monthly_bills');
    if (monthlyBillsTable) {
      const foreignKey = monthlyBillsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('customer_id') !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('monthly_bills', foreignKey);
      }
    }

    // Drop monthly_bills table
    await queryRunner.dropTable('monthly_bills');
  }
}
