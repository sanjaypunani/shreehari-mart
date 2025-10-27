const { DataSource } = require('typeorm');
const { config } = require('dotenv');

// Load environment variables
config();

// Create a new DataSource instance
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
  synchronize: false, // Don't auto sync, we'll do it manually
  logging: true,
  entities: [], // We don't need entities for this fix
});

async function fixIndexConflict() {
  try {
    console.log('🔗 Connecting to database...');

    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Drop the conflicting index if it exists
    console.log('🗑️ Dropping conflicting index...');

    await dataSource.query(
      `DROP INDEX IF EXISTS "IDX_b09a5aefa2136f1f5444548ce3";`
    );
    console.log('✅ Conflicting index dropped');

    // Also check for any other potential conflicting indexes on societies.name
    console.log('🔍 Checking for other indexes on societies.name...');

    const indexes = await dataSource.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'societies' 
      AND indexdef LIKE '%name%';
    `);

    console.log('Found indexes on societies table:', indexes);

    console.log('✅ Index conflict resolution complete');
  } catch (error) {
    console.error('❌ Error fixing index conflict:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
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
