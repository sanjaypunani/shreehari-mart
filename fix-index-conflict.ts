import { AppDataSource } from './libs/data-access/src/database/config';

async function fixIndexConflict() {
  try {
    console.log('🔗 Connecting to database...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log('✅ Connected to database');

    // Drop the conflicting index if it exists
    console.log('🗑️ Dropping conflicting index...');

    await AppDataSource.query(`
      DROP INDEX IF EXISTS "IDX_b09a5aefa2136f1f5444548ce3";
    `);

    console.log('✅ Conflicting index dropped');

    // Force synchronize the schema
    console.log('🔄 Synchronizing database schema...');

    await AppDataSource.synchronize(true);

    console.log('✅ Database schema synchronized successfully');
  } catch (error) {
    console.error('❌ Error fixing index conflict:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔚 Database connection closed');
    }
  }
}

// Run the fix
fixIndexConflict()
  .then(() => {
    console.log('🎉 Index conflict fixed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to fix index conflict:', error);
    process.exit(1);
  });
