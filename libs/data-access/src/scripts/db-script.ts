#!/usr/bin/env node

import 'reflect-metadata';
import { DatabaseConnection } from '../database/connection';
import { seedDatabase, clearDatabase } from '../database/seed';

async function runDatabaseScript() {
  const command = process.argv[2];

  try {
    // Connect to database
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      case 'clear':
        await clearDatabase();
        break;
      case 'reset':
        await clearDatabase();
        await seedDatabase();
        break;
      default:
        console.log('Available commands:');
        console.log('  seed  - Seed the database with sample data');
        console.log('  clear - Clear all data from the database');
        console.log('  reset - Clear and then seed the database');
        break;
    }

    await dbConnection.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

runDatabaseScript();
