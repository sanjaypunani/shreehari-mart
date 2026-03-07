import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersAndCustomerLink1760000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable = await queryRunner.getTable('users');

    if (!usersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'mobileNumber',
              type: 'varchar',
              length: '15',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isNullable: true,
              isUnique: true,
            },
            {
              name: 'role',
              type: 'varchar',
              length: '30',
              default: "'customer'",
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'lastLoginAt',
              type: 'timestamp',
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
        true
      );
    }

    const customersTable = await queryRunner.getTable('customers');
    const hasUserIdColumn = customersTable?.findColumnByName('userId');

    if (!hasUserIdColumn) {
      await queryRunner.addColumn(
        'customers',
        new TableColumn({
          name: 'userId',
          type: 'uuid',
          isNullable: true,
          isUnique: true,
        })
      );
    }

    const refreshedCustomersTable = await queryRunner.getTable('customers');
    const hasUserFk = refreshedCustomersTable?.foreignKeys.some(
      (fk) =>
        fk.columnNames.length === 1 &&
        fk.columnNames[0] === 'userId' &&
        fk.referencedTableName === 'users'
    );

    if (!hasUserFk) {
      await queryRunner.createForeignKey(
        'customers',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        })
      );
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const customersTable = await queryRunner.getTable('customers');

    if (customersTable) {
      const customerUserFk = customersTable.foreignKeys.find(
        (fk) =>
          fk.columnNames.length === 1 &&
          fk.columnNames[0] === 'userId' &&
          fk.referencedTableName === 'users'
      );

      if (customerUserFk) {
        await queryRunner.dropForeignKey('customers', customerUserFk);
      }

      const userIdColumn = customersTable.findColumnByName('userId');
      if (userIdColumn) {
        await queryRunner.dropColumn('customers', 'userId');
      }
    }

    const usersTable = await queryRunner.getTable('users');
    if (usersTable) {
      await queryRunner.dropTable('users');
    }
  }
}
