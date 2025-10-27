import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class CreateCustomerModule1726500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create societies table
    await queryRunner.createTable(
      new Table({
        name: 'societies',
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
          },
          {
            name: 'address',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Create buildings table
    await queryRunner.createTable(
      new Table({
        name: 'buildings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'societyId',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Create wallets table
    await queryRunner.createTable(
      new Table({
        name: 'wallets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'customerId',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'balance',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Create wallet_transactions table
    await queryRunner.createTable(
      new Table({
        name: 'wallet_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'walletId',
            type: 'uuid',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['credit', 'debit'],
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Add new columns to customers table
    await queryRunner.addColumns('customers', [
      new TableColumn({
        name: 'societyId',
        type: 'uuid',
        isNullable: true, // Temporarily nullable for existing data
      }),
      new TableColumn({
        name: 'buildingId',
        type: 'uuid',
        isNullable: true, // Temporarily nullable for existing data
      }),
      new TableColumn({
        name: 'mobileNumber',
        type: 'varchar',
        length: '15',
        isUnique: true,
        isNullable: true, // Temporarily nullable for existing data
      }),
      new TableColumn({
        name: 'flatNumber',
        type: 'varchar',
        length: '50',
        isNullable: true, // Temporarily nullable for existing data
      }),
      new TableColumn({
        name: 'isMonthlyPayment',
        type: 'boolean',
        default: false,
      }),
    ]);

    // Create indexes
    await queryRunner.createIndex(
      'societies',
      new TableIndex({
        name: 'IDX_SOCIETIES_NAME',
        columnNames: ['name'],
      })
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_NAME_SOCIETY',
        columnNames: ['name', 'societyId'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'wallets',
      new TableIndex({
        name: 'IDX_WALLETS_CUSTOMER',
        columnNames: ['customerId'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'wallet_transactions',
      new TableIndex({
        name: 'IDX_WALLET_TRANSACTIONS_WALLET',
        columnNames: ['walletId'],
      })
    );

    await queryRunner.createIndex(
      'wallet_transactions',
      new TableIndex({
        name: 'IDX_WALLET_TRANSACTIONS_TYPE',
        columnNames: ['type'],
      })
    );

    await queryRunner.createIndex(
      'wallet_transactions',
      new TableIndex({
        name: 'IDX_WALLET_TRANSACTIONS_CREATED',
        columnNames: ['createdAt'],
      })
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_CUSTOMERS_MOBILE',
        columnNames: ['mobileNumber'],
        isUnique: true,
      })
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'buildings',
      new TableForeignKey({
        columnNames: ['societyId'],
        referencedTableName: 'societies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'wallets',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'wallet_transactions',
      new TableForeignKey({
        columnNames: ['walletId'],
        referencedTableName: 'wallets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['societyId'],
        referencedTableName: 'societies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['buildingId'],
        referencedTableName: 'buildings',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const customerTable = await queryRunner.getTable('customers');
    const societyFk = customerTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('societyId') !== -1
    );
    const buildingFk = customerTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('buildingId') !== -1
    );

    if (societyFk) {
      await queryRunner.dropForeignKey('customers', societyFk);
    }
    if (buildingFk) {
      await queryRunner.dropForeignKey('customers', buildingFk);
    }

    const walletTransactionTable = await queryRunner.getTable(
      'wallet_transactions'
    );
    const walletTransactionFk = walletTransactionTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('walletId') !== -1
    );
    if (walletTransactionFk) {
      await queryRunner.dropForeignKey(
        'wallet_transactions',
        walletTransactionFk
      );
    }

    const walletTable = await queryRunner.getTable('wallets');
    const walletFk = walletTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('customerId') !== -1
    );
    if (walletFk) {
      await queryRunner.dropForeignKey('wallets', walletFk);
    }

    const buildingTable = await queryRunner.getTable('buildings');
    const buildingSocietyFk = buildingTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('societyId') !== -1
    );
    if (buildingSocietyFk) {
      await queryRunner.dropForeignKey('buildings', buildingSocietyFk);
    }

    // Drop columns from customers table
    await queryRunner.dropColumns('customers', [
      'societyId',
      'buildingId',
      'mobileNumber',
      'flatNumber',
      'isMonthlyPayment',
    ]);

    // Drop tables
    await queryRunner.dropTable('wallet_transactions');
    await queryRunner.dropTable('wallets');
    await queryRunner.dropTable('buildings');
    await queryRunner.dropTable('societies');
  }
}
