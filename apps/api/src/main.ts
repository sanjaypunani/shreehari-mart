import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from './app/server';
import {
  DatabaseConnection,
  ProductDataMigrationService,
} from '@shreehari/data-access';

dotenv.config();

async function bootstrap() {
  try {
    // Initialize database connection
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    // Run product data migration
    const dataSource = dbConnection.getDataSource();
    if (dataSource) {
      const migrationService = new ProductDataMigrationService(dataSource);
      await migrationService.migrateProductData();
    }

    const app = createServer();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
      console.log(`🗄️  Database connected successfully`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🔄 Shutting down gracefully...');
      await dbConnection.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🔄 Shutting down gracefully...');
      await dbConnection.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
