import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'password',
  database: process.env['DB_NAME'] || 'shreehari_mart',
  entities: ['libs/data-access/src/entities/*.ts'],
  migrations: ['libs/data-access/src/database/migrations/*.ts'],
  synchronize: false, // Never use synchronize in production
  logging: process.env['NODE_ENV'] === 'development',
});
