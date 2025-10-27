const { MongoClient } = require('mongodb');
const { Client } = require('pg');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DATABASE = 'order_management';
const MONGODB_COLLECTION = 'products';

// PostgreSQL connection configuration
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

class ProductMigration {
  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI);
    this.pgClient = new Client(PG_CONFIG);
  }

  async initialize() {
    console.log('🔌 Connecting to MongoDB...');
    await this.mongoClient.connect();
    console.log('✅ MongoDB connected successfully');

    console.log('🔌 Connecting to PostgreSQL...');
    await this.pgClient.connect();
    console.log('✅ PostgreSQL connected successfully');
  }

  async cleanup() {
    console.log('🧹 Cleaning up connections...');
    await this.mongoClient.close();
    await this.pgClient.end();
    console.log('✅ Cleanup completed');
  }

  /**
   * Standardize unit values to match PostgreSQL enum
   */
  standardizeUnit(unit) {
    const unitMap = {
      KG: 'kg',
      GM: 'gm',
      PCS: 'pc',
      kg: 'kg',
      gm: 'gm',
      pc: 'pc',
      PIECE: 'pc',
      PIECES: 'pc',
      GRAM: 'gm',
      GRAMS: 'gm',
      KILOGRAM: 'kg',
      KILOGRAMS: 'kg',
    };

    const standardized = unitMap[unit?.toUpperCase()] || 'pc';
    return standardized;
  }

  /**
   * Map MongoDB boolean values to PostgreSQL
   */
  mapBoolean(value) {
    if (value === true || value === 'true' || value === 1) return true;
    if (value === false || value === 'false' || value === 0) return false;
    return true; // default to true if undefined
  }

  /**
   * Clean and validate product name
   */
  cleanProductName(name) {
    if (!name || typeof name !== 'string') {
      return 'Unknown Product';
    }
    return name.trim().slice(0, 255); // Limit to PostgreSQL varchar(255)
  }

  /**
   * Generate product name using only product.name field
   */
  generateProductName(product) {
    // Use only product.name field directly
    if (product.name && product.name.trim()) {
      return this.cleanProductName(product.name);
    }
    return 'Unknown Product';
  }

  /**
   * Validate and clean price
   */
  validatePrice(price) {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return 0.0;
    }
    return numPrice;
  }

  /**
   * Validate and clean quantity
   */
  validateQuantity(quantity) {
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return 1;
    }
    return numQuantity;
  }

  /**
   * Clean image URL
   */
  cleanImageUrl(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return null;
    }
    const cleaned = imageUrl.trim();
    if (cleaned.length > 500) {
      return cleaned.slice(0, 500); // Limit to PostgreSQL varchar(500)
    }
    return cleaned;
  }

  /**
   * Dry run method
   */
  async dryRun() {
    try {
      await this.initialize();

      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      const totalProducts = await collection.countDocuments();
      console.log(`🔍 DRY RUN: Found ${totalProducts} products`);

      // Sample first 10 products for validation
      const sampleProducts = await collection.find({}).limit(10).toArray();

      console.log('\n📋 SAMPLE DATA PREVIEW:');
      console.log('=======================');

      sampleProducts.forEach((product, index) => {
        const standardizedUnit = this.standardizeUnit(product.unit);
        const cleanName = this.generateProductName(product);
        const cleanPrice = this.validatePrice(product.price);
        const cleanQuantity = this.validateQuantity(product.quantity);
        const isAvailable = this.mapBoolean(
          product.isAvailable && product.isActive
        );

        console.log(`${index + 1}. ${cleanName}`);
        console.log(`   Name (used): ${product.name}`);
        console.log(`   Price (original): ${product.price} → ${cleanPrice}`);
        console.log(
          `   Quantity (original): ${product.quantity} → ${cleanQuantity}`
        );
        console.log(
          `   Unit (original): ${product.unit} → ${standardizedUnit}`
        );
        console.log(`   Category: ${product.category || 'N/A'} (ignored)`);
        console.log(
          `   Available: ${product.isAvailable} & Active: ${product.isActive} → ${isAvailable}`
        );
        console.log(
          `   Stock Quantity: ${product.stockQuantity || 'N/A'} (ignored)`
        );
        console.log(`   Sort Order: ${product.sortOrder || 'N/A'} (ignored)`);
        console.log(`   Image URL: ${product.imageUrl ? 'Yes' : 'No'}`);
        console.log('   ---');
      });

      // Check for duplicates by name
      const duplicateNames = await collection
        .aggregate([
          { $group: { _id: '$name', count: { $sum: 1 } } },
          { $match: { count: { $gt: 1 } } },
        ])
        .toArray();

      if (duplicateNames.length > 0) {
        console.log('\n⚠️  DUPLICATE PRODUCT NAMES FOUND:');
        duplicateNames.forEach((dup) => {
          console.log(`   ${dup._id}: ${dup.count} occurrences`);
        });
      }

      // Check unit distribution
      const unitStats = await collection
        .aggregate([
          { $group: { _id: '$unit', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray();

      console.log('\n📊 UNIT DISTRIBUTION:');
      unitStats.forEach((stat) => {
        const standardized = this.standardizeUnit(stat._id);
        console.log(`   ${stat._id} → ${standardized}: ${stat.count} products`);
      });

      console.log('\n✅ Dry run completed successfully');
    } catch (error) {
      console.error('💥 Dry run failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Main migration method
   */
  async migrate() {
    const stats = {
      totalProducts: 0,
      migratedProducts: 0,
      skippedProducts: 0,
      errors: [],
    };

    try {
      await this.initialize();

      // Get MongoDB database and collection
      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      // Get total count
      stats.totalProducts = await collection.countDocuments();
      console.log(`📊 Found ${stats.totalProducts} products to migrate`);

      // Process products in batches
      const batchSize = 100;
      let skip = 0;

      while (skip < stats.totalProducts) {
        const products = await collection
          .find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();

        console.log(
          `🔄 Processing batch ${Math.floor(skip / batchSize) + 1} (${products.length} products)...`
        );

        for (const mongoProduct of products) {
          try {
            await this.migrateProduct(mongoProduct, stats);
          } catch (error) {
            const errorMessage = `Failed to migrate product ${mongoProduct.name}: ${error.message}`;
            console.error(`❌ ${errorMessage}`);
            stats.errors.push(errorMessage);
          }
        }

        skip += batchSize;
      }

      console.log('🎉 Migration completed!');
      this.printStats(stats);
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }

    return stats;
  }

  /**
   * Migrate a single product
   */
  async migrateProduct(mongoProduct, stats) {
    const cleanName = this.generateProductName(mongoProduct);

    // Check if product already exists (by name)
    const existingQuery = `SELECT id FROM products WHERE LOWER(name) = LOWER($1) LIMIT 1`;
    const existing = await this.pgClient.query(existingQuery, [cleanName]);

    if (existing.rows.length > 0) {
      console.log(
        `⚠️  Product with name "${cleanName}" already exists, skipping...`
      );
      stats.skippedProducts++;
      return;
    }

    // Map MongoDB fields to PostgreSQL schema
    const productData = {
      name: cleanName,
      price: this.validatePrice(mongoProduct.price),
      quantity: this.validateQuantity(mongoProduct.quantity),
      unit: this.standardizeUnit(mongoProduct.unit),
      description: mongoProduct.description || null,
      imageUrl: this.cleanImageUrl(mongoProduct.imageUrl),
      isAvailable: this.mapBoolean(
        mongoProduct.isAvailable && mongoProduct.isActive
      ),
      createdAt: mongoProduct.createdAt || new Date(),
      updatedAt: mongoProduct.updatedAt || new Date(),
    };

    // Insert product
    const productQuery = `
      INSERT INTO products (
        name, price, quantity, unit, description, "imageUrl", "isAvailable",
        "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const productResult = await this.pgClient.query(productQuery, [
      productData.name,
      productData.price,
      productData.quantity,
      productData.unit,
      productData.description,
      productData.imageUrl,
      productData.isAvailable,
      productData.createdAt,
      productData.updatedAt,
    ]);

    const productId = productResult.rows[0].id;

    stats.migratedProducts++;
    console.log(
      `✅ Migrated product: ${productData.name} (₹${productData.price}/${productData.quantity}${productData.unit})`
    );
  }

  /**
   * Print migration statistics
   */
  printStats(stats) {
    console.log('\n📈 MIGRATION STATISTICS');
    console.log('========================');
    console.log(`Total products found: ${stats.totalProducts}`);
    console.log(`Successfully migrated: ${stats.migratedProducts}`);
    console.log(`Skipped (duplicates): ${stats.skippedProducts}`);
    console.log(`Errors encountered: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      stats.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    console.log(
      `\n✅ Success rate: ${((stats.migratedProducts / stats.totalProducts) * 100).toFixed(2)}%`
    );
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const migration = new ProductMigration();

  try {
    switch (command) {
      case 'dry-run':
        console.log('🔍 Starting dry run...');
        await migration.dryRun();
        break;

      case 'migrate':
        console.log('🚀 Starting product migration...');
        const stats = await migration.migrate();

        if (stats.errors.length > 0) {
          console.log(
            '\n⚠️  Migration completed with errors. Please review the error log above.'
          );
          process.exit(1);
        } else {
          console.log('\n🎉 Migration completed successfully!');
          process.exit(0);
        }
        break;

      default:
        console.log('📖 Product Migration Tool');
        console.log('==========================');
        console.log('Usage:');
        console.log('  node migrationproduct.js dry-run   # Preview migration');
        console.log('  node migrationproduct.js migrate   # Execute migration');
        console.log('');
        console.log('Environment Variables Required:');
        console.log(
          '  DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME (PostgreSQL)'
        );
        console.log('');
        console.log('MongoDB → PostgreSQL Field Mapping:');
        console.log('  name → name');
        console.log('  price → price');
        console.log('  quantity → quantity');
        console.log('  unit (KG/GM/PCS) → unit (kg/gm/pc)');
        console.log('  imageUrl → imageUrl');
        console.log('  isAvailable & isActive → isAvailable');
        console.log('  createdAt → createdAt');
        console.log('  updatedAt → updatedAt');
        console.log('');
        console.log('Ignored Fields:');
        console.log(
          '  nameEnglish, nameGujarati, category, stockQuantity, sortOrder'
        );
        break;
    }
  } catch (error) {
    console.error('💥 Command failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
