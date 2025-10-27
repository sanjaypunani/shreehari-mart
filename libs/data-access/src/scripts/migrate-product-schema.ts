#!/usr/bin/env tsx

import { DataSource } from 'typeorm';
import { DatabaseConfig } from '../database/config';

async function migrateProductSchema() {
  console.log('🚀 Starting Product Schema Migration...');

  const dataSource = new DataSource(DatabaseConfig);

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    console.log('📝 Starting migration transaction...');
    await queryRunner.startTransaction();

    try {
      // Check if old pricePerUnit column exists
      const hasOldColumn = await queryRunner.hasColumn(
        'products',
        'pricePerUnit'
      );
      console.log(`🔍 Old pricePerUnit column exists: ${hasOldColumn}`);

      // Check if new columns exist
      const hasPriceColumn = await queryRunner.hasColumn('products', 'price');
      const hasQuantityColumn = await queryRunner.hasColumn(
        'products',
        'quantity'
      );
      console.log(`🔍 Price column exists: ${hasPriceColumn}`);
      console.log(`🔍 Quantity column exists: ${hasQuantityColumn}`);

      if (hasOldColumn && hasPriceColumn) {
        // Migrate data from pricePerUnit to price, set quantity to 1
        console.log('📊 Migrating data from pricePerUnit to price...');
        await queryRunner.query(`
          UPDATE products 
          SET price = "pricePerUnit", quantity = 1 
          WHERE price IS NULL AND "pricePerUnit" IS NOT NULL
        `);

        console.log('✅ Data migration completed');

        // Now drop the old column
        console.log('🗑️ Dropping old pricePerUnit column...');
        await queryRunner.dropColumn('products', 'pricePerUnit');
        console.log('✅ Old column dropped');
      } else if (!hasPriceColumn) {
        console.log(
          '❌ Price column does not exist. Schema sync needed first.'
        );
      } else if (!hasOldColumn) {
        console.log(
          'ℹ️ Old pricePerUnit column already removed. Migration may have run already.'
        );

        // Check for any NULL price values and set defaults
        const nullPriceCount = await queryRunner.query(`
          SELECT COUNT(*) as count FROM products WHERE price IS NULL
        `);

        if (nullPriceCount[0].count > 0) {
          console.log(
            `🔧 Found ${nullPriceCount[0].count} products with NULL price. Setting defaults...`
          );
          await queryRunner.query(`
            UPDATE products 
            SET price = 0, quantity = 1 
            WHERE price IS NULL
          `);
          console.log('✅ Default values set for NULL prices');
        }
      }

      // Make columns NOT NULL if they have values
      const nullPriceCount = await queryRunner.query(`
        SELECT COUNT(*) as count FROM products WHERE price IS NULL
      `);

      const nullQuantityCount = await queryRunner.query(`
        SELECT COUNT(*) as count FROM products WHERE quantity IS NULL
      `);

      if (nullPriceCount[0].count === 0 && nullQuantityCount[0].count === 0) {
        console.log('🔧 Making price and quantity columns NOT NULL...');

        // Change columns to NOT NULL
        await queryRunner.query(`
          ALTER TABLE products ALTER COLUMN price SET NOT NULL
        `);

        await queryRunner.query(`
          ALTER TABLE products ALTER COLUMN quantity SET NOT NULL
        `);

        console.log('✅ Columns set to NOT NULL');
      } else {
        console.log(
          `⚠️ Cannot set NOT NULL: ${nullPriceCount[0].count} NULL prices, ${nullQuantityCount[0].count} NULL quantities`
        );
      }

      await queryRunner.commitTransaction();
      console.log('✅ Migration transaction committed');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Migration failed, rolling back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    console.log('🎉 Product schema migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateProductSchema()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateProductSchema };
