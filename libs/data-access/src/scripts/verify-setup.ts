#!/usr/bin/env node

import 'reflect-metadata';
import { DatabaseConnection, DatabaseService } from '@shreehari/data-access';

async function verifyDatabaseSetup() {
  console.log('🔍 Verifying PostgreSQL database setup...\n');

  try {
    // Step 1: Test database connection
    console.log('1. Testing database connection...');
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    console.log('✅ Database connection successful');

    // Step 2: Test database service
    console.log('\n2. Testing database service...');
    const dbService = DatabaseService.getInstance();
    const healthCheck = await dbService.healthCheck();

    if (healthCheck.status === 'healthy') {
      console.log('✅ Database service is healthy');
    } else {
      console.log(
        '❌ Database service health check failed:',
        healthCheck.details
      );
      return;
    }

    // Step 3: Test repositories
    console.log('\n3. Testing repositories...');

    // Test ProductRepository
    const productRepo = dbService.getProductRepository();
    const products = await productRepo.findAll({ page: 1, limit: 1 });
    console.log(
      `✅ ProductRepository working - found ${products.total} products`
    );

    // Test CustomerRepository
    const customerRepo = dbService.getCustomerRepository();
    const customers = await customerRepo.findAll({ page: 1, limit: 1 });
    console.log(
      `✅ CustomerRepository working - found ${customers.total} customers`
    );

    // Test OrderRepository
    const orderRepo = dbService.getOrderRepository();
    const orders = await orderRepo.findAll({ page: 1, limit: 1 });
    console.log(`✅ OrderRepository working - found ${orders.total} orders`);

    // Step 4: Summary
    console.log('\n🎉 Database setup verification completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Products: ${products.total}`);
    console.log(`   • Customers: ${customers.total}`);
    console.log(`   • Orders: ${orders.total}`);

    if (products.total === 0) {
      console.log(
        '\n💡 Tip: Run "npm run db:seed" to populate the database with sample data'
      );
    }

    await dbConnection.disconnect();
    console.log('\n✅ Database connection closed successfully');
  } catch (error) {
    console.error('\n❌ Database setup verification failed:');
    console.error(error);

    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env file has correct database credentials');
    console.log('3. Verify the database exists and is accessible');
    console.log('4. Check DATABASE_SETUP.md for detailed instructions');

    process.exit(1);
  }
}

verifyDatabaseSetup();
