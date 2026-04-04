// Helper function to safely access environment variables
const getEnvVar = (key: string, defaultValue: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

const getEnvNumber = (key: string, defaultValue: string): number => {
  if (typeof process !== 'undefined' && process.env) {
    return parseInt(process.env[key] || defaultValue);
  }
  return parseInt(defaultValue);
};

// Only import and create database configuration in Node.js environment
let DatabaseConfig: any = null;
let AppDataSource: any = null;

// Check if we're in a Node.js environment (not browser)
if (
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
) {
  try {
    const { DataSource } = require('typeorm');
    const { Product } = require('../entities/Product');
    const { Customer } = require('../entities/Customer');
    const { Order } = require('../entities/Order');
    const { DeliveryPartner } = require('../entities/DeliveryPartner');
    const { OrderItem } = require('../entities/OrderItem');
    // const { OrderPayment } = require('../entities/OrderPayment');
    const { Address } = require('../entities/Address');
    const { Society } = require('../entities/Society');
    const { Building } = require('../entities/Building');
    const { Wallet } = require('../entities/Wallet');
    const { WalletTransaction } = require('../entities/WalletTransaction');
    const { MonthlyBill } = require('../entities/MonthlyBill');
    const { User } = require('../entities/User');
    const { Category } = require('../entities/Category');

    // Prefer a full connection URL (Supabase / production), fall back to individual vars (local dev)
    const databaseUrl =
      process.env['cropzo_database_POSTGRES_URL_NON_POOLING'] ||
      process.env['DATABASE_URL'] ||
      '';

    const isProduction = getEnvVar('NODE_ENV', 'development') !== 'development';

    DatabaseConfig = databaseUrl
      ? {
          type: 'postgres' as const,
          url: databaseUrl,
          ssl: { rejectUnauthorized: false },
          synchronize: false,
          logging: false,
        }
      : {
          type: 'postgres' as const,
          host: getEnvVar('DB_HOST', 'localhost'),
          port: getEnvNumber('DB_PORT', '5432'),
          username: getEnvVar('DB_USERNAME', 'postgres'),
          password: getEnvVar('DB_PASSWORD', 'password'),
          database: getEnvVar('DB_NAME', 'shreehari_mart'),
          synchronize: !isProduction,
          logging: false,
        };

    // Merge in entities regardless of which branch was taken
    DatabaseConfig = {
      ...DatabaseConfig,
      entities: [
        Product,
        Customer,
        Order,
        OrderItem,
        // OrderPayment,
        Address,
        Society,
        Building,
        Wallet,
        WalletTransaction,
        MonthlyBill,
        User,
        Category,
        DeliveryPartner,
      ],
      migrations: ['src/database/migrations/*.ts'],
      subscribers: ['src/database/subscribers/*.ts'],
    };

    AppDataSource = new DataSource(DatabaseConfig);
  } catch (error) {
    console.warn(
      'Database configuration not available in this environment:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export { DatabaseConfig, AppDataSource };
