import { DataSource } from 'typeorm';
import { DatabaseConfig } from '../database/config';

// This is a separate data source for CLI operations like migrations
export const MigrationDataSource = new DataSource({
  ...DatabaseConfig,
  migrations: ['libs/data-access/src/database/migrations/*.ts'],
});
