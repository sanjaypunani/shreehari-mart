import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDeliveryPartnerModule1760100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create delivery_partners table
    const deliveryPartnersTable =
      await queryRunner.getTable('delivery_partners');

    if (!deliveryPartnersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'delivery_partners',
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
              length: '255',
              isNullable: false,
            },
            {
              name: 'mobileNumber',
              type: 'varchar',
              length: '15',
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
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
        true
      );
    }

    // 2. Add nullable deliveryPartnerId column to orders table
    const ordersTable = await queryRunner.getTable('orders');
    const hasDeliveryPartnerIdColumn =
      ordersTable?.findColumnByName('deliveryPartnerId');

    if (!hasDeliveryPartnerIdColumn) {
      await queryRunner.addColumn(
        'orders',
        new TableColumn({
          name: 'deliveryPartnerId',
          type: 'uuid',
          isNullable: true,
        })
      );
    }

    // 3. Create index on orders.deliveryPartnerId
    const refreshedOrdersTable = await queryRunner.getTable('orders');
    const hasIndex = refreshedOrdersTable?.indices.some(
      (idx) => idx.name === 'IDX_orders_deliveryPartnerId'
    );

    if (!hasIndex) {
      await queryRunner.createIndex(
        'orders',
        new TableIndex({
          name: 'IDX_orders_deliveryPartnerId',
          columnNames: ['deliveryPartnerId'],
        })
      );
    }

    // 4. Create FK constraint from orders.deliveryPartnerId → delivery_partners.id
    const ordersTableForFk = await queryRunner.getTable('orders');
    const hasDeliveryPartnerFk = ordersTableForFk?.foreignKeys.some(
      (fk) =>
        fk.columnNames.length === 1 &&
        fk.columnNames[0] === 'deliveryPartnerId' &&
        fk.referencedTableName === 'delivery_partners'
    );

    if (!hasDeliveryPartnerFk) {
      await queryRunner.createForeignKey(
        'orders',
        new TableForeignKey({
          columnNames: ['deliveryPartnerId'],
          referencedTableName: 'delivery_partners',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ordersTable = await queryRunner.getTable('orders');

    if (ordersTable) {
      // Drop FK constraint
      const deliveryPartnerFk = ordersTable.foreignKeys.find(
        (fk) =>
          fk.columnNames.length === 1 &&
          fk.columnNames[0] === 'deliveryPartnerId' &&
          fk.referencedTableName === 'delivery_partners'
      );

      if (deliveryPartnerFk) {
        await queryRunner.dropForeignKey('orders', deliveryPartnerFk);
      }

      // Drop index
      const deliveryPartnerIdx = ordersTable.indices.find(
        (idx) => idx.name === 'IDX_orders_deliveryPartnerId'
      );

      if (deliveryPartnerIdx) {
        await queryRunner.dropIndex('orders', deliveryPartnerIdx);
      }

      // Drop column
      const deliveryPartnerIdColumn =
        ordersTable.findColumnByName('deliveryPartnerId');

      if (deliveryPartnerIdColumn) {
        await queryRunner.dropColumn('orders', 'deliveryPartnerId');
      }
    }

    // Drop delivery_partners table
    const deliveryPartnersTable =
      await queryRunner.getTable('delivery_partners');

    if (deliveryPartnersTable) {
      await queryRunner.dropTable('delivery_partners');
    }
  }
}
