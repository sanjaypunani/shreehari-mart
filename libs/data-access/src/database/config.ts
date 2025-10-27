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
    const { OrderItem } = require('../entities/OrderItem');
    // const { OrderPayment } = require('../entities/OrderPayment');
    const { Address } = require('../entities/Address');
    const { Society } = require('../entities/Society');
    const { Building } = require('../entities/Building');
    const { Wallet } = require('../entities/Wallet');
    const { WalletTransaction } = require('../entities/WalletTransaction');
    const { MonthlyBill } = require('../entities/MonthlyBill');

    DatabaseConfig = {
      type: 'postgres' as const,
      host: getEnvVar('DB_HOST', 'localhost'),
      port: getEnvNumber('DB_PORT', '5432'),
      username: getEnvVar('DB_USERNAME', 'postgres'),
      password: getEnvVar('DB_PASSWORD', 'password'),
      database: getEnvVar('DB_NAME', 'shreehari_mart'),
      ssl: { require: true, rejectUnauthorized: false },
      synchronize: getEnvVar('NODE_ENV', 'development') === 'development',
      // logging: getEnvVar('NODE_ENV', 'development') === 'development',
      logging: false,
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
