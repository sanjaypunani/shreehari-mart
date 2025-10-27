const { MongoClient } = require('mongodb');
const { Client } = require('pg');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DATABASE = 'order_management';
const MONGODB_COLLECTION = 'customers';

// PostgreSQL connection configuration
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

class CustomerMigration {
  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI);
    this.pgClient = new Client(PG_CONFIG);

    // Cache for societies and buildings to avoid duplicates
    this.societyCache = new Map(); // name -> id
    this.buildingCache = new Map(); // society_id-building_name -> id
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
   * Extract building name from flat number and standardize flat number format
   */
  extractBuildingAndStandardizeFlatNumber(flatNumber) {
    const cleaned = flatNumber.trim().replace(/\s+/g, ' ');

    // Pattern 1: A-101, B-205, C-301 (with dash)
    let match = cleaned.match(/^([A-Za-z]+)[-](\d+)$/);
    if (match) {
      const building = match[1].toUpperCase();
      const number = match[2];
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Pattern 2: A101, B205, C301 (no separator)
    match = cleaned.match(/^([A-Za-z]+)(\d+)$/);
    if (match) {
      const building = match[1].toUpperCase();
      const number = match[2];
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Pattern 3: A 101, B 205, C 301 (with space)
    match = cleaned.match(/^([A-Za-z]+)\s+(\d+)$/);
    if (match) {
      const building = match[1].toUpperCase();
      const number = match[2];
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Pattern 4: Block A 101, Building B 205, etc.
    match = cleaned.match(/(?:block|building)\s*([A-Za-z]+)[-\s]*(\d+)/i);
    if (match) {
      const building = match[1].toUpperCase();
      const number = match[2];
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Pattern 5: 101A, 205B (number first)
    match = cleaned.match(/^(\d+)([A-Za-z]+)$/);
    if (match) {
      const number = match[1];
      const building = match[2].toUpperCase();
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Pattern 6: Just numbers (101, 205) - assign to building A
    match = cleaned.match(/^(\d+)$/);
    if (match) {
      const number = match[1];
      return {
        buildingName: 'A',
        standardizedFlatNumber: `A${number}`,
      };
    }

    // If no pattern matches, try to extract any letters and numbers
    const letters = cleaned.match(/[A-Za-z]+/);
    const numbers = cleaned.match(/\d+/);

    if (letters && numbers) {
      const building = letters[0].toUpperCase();
      const number = numbers[0];
      return {
        buildingName: building,
        standardizedFlatNumber: `${building}${number}`,
      };
    }

    // Default fallback
    console.warn(
      `⚠️  Could not parse flat number: "${flatNumber}", using default building A`
    );
    return {
      buildingName: 'A',
      standardizedFlatNumber: cleaned || 'A001',
    };
  }

  /**
   * Get or create society with case-insensitive matching
   */
  async getOrCreateSociety(societyName, address) {
    const normalizedName = societyName.trim();

    // Check cache first
    if (this.societyCache.has(normalizedName)) {
      return this.societyCache.get(normalizedName);
    }

    // Check if society exists in database (case-insensitive)
    const existingQuery = `
      SELECT id, name FROM societies 
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1
    `;
    const result = await this.pgClient.query(existingQuery, [normalizedName]);

    let societyId;

    if (result.rows.length > 0) {
      societyId = result.rows[0].id;
      console.log(
        `📍 Found existing society: ${result.rows[0].name} (matched: ${normalizedName})`
      );
    } else {
      // Create new society
      const insertQuery = `
        INSERT INTO societies (name, address, "createdAt", "updatedAt")
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id
      `;
      const insertResult = await this.pgClient.query(insertQuery, [
        normalizedName,
        address || 'Address not provided',
      ]);
      societyId = insertResult.rows[0].id;
      console.log(`📍 Created new society: ${normalizedName}`);
    }

    // Cache the society
    this.societyCache.set(normalizedName, societyId);
    return societyId;
  }

  /**
   * Get or create building
   */
  async getOrCreateBuilding(buildingName, societyId) {
    const buildingKey = `${societyId}-${buildingName}`;

    // Check cache first
    if (this.buildingCache.has(buildingKey)) {
      return this.buildingCache.get(buildingKey);
    }

    // Check if building exists in database
    const existingQuery = `
      SELECT id FROM buildings 
      WHERE name = $1 AND "societyId" = $2
      LIMIT 1
    `;
    const result = await this.pgClient.query(existingQuery, [
      buildingName,
      societyId,
    ]);

    let buildingId;

    if (result.rows.length > 0) {
      buildingId = result.rows[0].id;
    } else {
      // Create new building
      const insertQuery = `
        INSERT INTO buildings (name, "societyId", "createdAt", "updatedAt")
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id
      `;
      const insertResult = await this.pgClient.query(insertQuery, [
        buildingName,
        societyId,
      ]);
      buildingId = insertResult.rows[0].id;
      console.log(
        `🏢 Created new building: ${buildingName} in society ${societyId}`
      );
    }

    // Cache the building
    this.buildingCache.set(buildingKey, buildingId);
    return buildingId;
  }

  /**
   * Validate mobile number format
   */
  validateMobileNumber(mobileNumber) {
    const cleaned = mobileNumber.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return cleaned.substring(2);
    }

    return mobileNumber;
  }

  /**
   * Generate email from customer name and mobile number
   */
  generateEmail(customerName, mobileNumber) {
    const cleanName = customerName.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}.${mobileNumber}@customer.shreedharismart.com`;
  }

  /**
   * Dry run method
   */
  async dryRun() {
    try {
      await this.initialize();

      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      const totalCustomers = await collection.countDocuments();
      console.log(`🔍 DRY RUN: Found ${totalCustomers} customers`);

      // Sample first 10 customers for validation
      const sampleCustomers = await collection.find({}).limit(10).toArray();

      console.log('\n📋 SAMPLE DATA PREVIEW:');
      console.log('=======================');

      sampleCustomers.forEach((customer, index) => {
        const { buildingName, standardizedFlatNumber } =
          this.extractBuildingAndStandardizeFlatNumber(customer.flatNumber);
        console.log(`${index + 1}. ${customer.customerName}`);
        console.log(`   Mobile: ${customer.mobileNumber}`);
        console.log(`   Society: ${customer.societyName}`);
        console.log(`   Flat (original): ${customer.flatNumber}`);
        console.log(`   Flat (standardized): ${standardizedFlatNumber}`);
        console.log(`   Building (extracted): ${buildingName}`);
        console.log(`   Wallet Balance: ${customer.walletBalance}`);
        console.log(
          `   Email (generated): ${this.generateEmail(customer.customerName, customer.mobileNumber)}`
        );
        console.log('   ---');
      });

      // Check for duplicates
      const duplicateMobiles = await collection
        .aggregate([
          { $group: { _id: '$mobileNumber', count: { $sum: 1 } } },
          { $match: { count: { $gt: 1 } } },
        ])
        .toArray();

      if (duplicateMobiles.length > 0) {
        console.log('\n⚠️  DUPLICATE MOBILE NUMBERS FOUND:');
        duplicateMobiles.forEach((dup) => {
          console.log(`   ${dup._id}: ${dup.count} occurrences`);
        });
      }

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
      totalCustomers: 0,
      migratedCustomers: 0,
      createdSocieties: 0,
      createdBuildings: 0,
      createdWallets: 0,
      errors: [],
    };

    try {
      await this.initialize();

      // Get MongoDB database and collection
      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      // Get total count
      stats.totalCustomers = await collection.countDocuments();
      console.log(`📊 Found ${stats.totalCustomers} customers to migrate`);

      // Process customers in batches
      const batchSize = 100;
      let skip = 0;

      while (skip < stats.totalCustomers) {
        const customers = await collection
          .find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();

        console.log(
          `🔄 Processing batch ${Math.floor(skip / batchSize) + 1} (${customers.length} customers)...`
        );

        for (const mongoCustomer of customers) {
          try {
            await this.migrateCustomer(mongoCustomer, stats);
          } catch (error) {
            const errorMessage = `Failed to migrate customer ${mongoCustomer.customerName} (${mongoCustomer.mobileNumber}): ${error.message}`;
            console.error(`❌ ${errorMessage}`);
            stats.errors.push(errorMessage);
          }
        }

        skip += batchSize;
      }

      // Update counts
      stats.createdSocieties = this.societyCache.size;
      stats.createdBuildings = this.buildingCache.size;

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
   * Migrate a single customer
   */
  async migrateCustomer(mongoCustomer, stats) {
    const cleanMobileNumber = this.validateMobileNumber(
      mongoCustomer.mobileNumber
    );

    // Check if customer already exists
    const existingQuery = `SELECT id FROM customers WHERE "mobileNumber" = $1 LIMIT 1`;
    const existing = await this.pgClient.query(existingQuery, [
      cleanMobileNumber,
    ]);

    if (existing.rows.length > 0) {
      console.log(
        `⚠️  Customer with mobile ${cleanMobileNumber} already exists, skipping...`
      );
      return;
    }

    // Get or create society
    const societyId = await this.getOrCreateSociety(
      mongoCustomer.societyName,
      mongoCustomer.address
    );

    // Extract building and standardize flat number
    const { buildingName, standardizedFlatNumber } =
      this.extractBuildingAndStandardizeFlatNumber(mongoCustomer.flatNumber);
    const buildingId = await this.getOrCreateBuilding(buildingName, societyId);

    // Generate email
    const email = this.generateEmail(
      mongoCustomer.customerName,
      cleanMobileNumber
    );

    // Insert customer
    const customerQuery = `
      INSERT INTO customers (
        name, email, "mobileNumber", "flatNumber", "societyId", "buildingId",
        "isMonthlyPayment", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const customerResult = await this.pgClient.query(customerQuery, [
      mongoCustomer.customerName,
      email,
      cleanMobileNumber,
      standardizedFlatNumber,
      societyId,
      buildingId,
      false, // isMonthlyPayment
      mongoCustomer.createdAt || new Date(),
      mongoCustomer.updatedAt || new Date(),
    ]);

    const customerId = customerResult.rows[0].id;

    // Create wallet
    const walletQuery = `
      INSERT INTO wallets (
        "customerId", balance, "createdAt", "updatedAt"
      )
      VALUES ($1, $2, NOW(), NOW())
    `;

    await this.pgClient.query(walletQuery, [
      customerId,
      mongoCustomer.walletBalance || 0,
    ]);

    stats.migratedCustomers++;
    stats.createdWallets++;
    console.log(
      `✅ Migrated customer: ${mongoCustomer.customerName} (${cleanMobileNumber})`
    );
  }

  /**
   * Print migration statistics
   */
  printStats(stats) {
    console.log('\n📈 MIGRATION STATISTICS');
    console.log('========================');
    console.log(`Total customers found: ${stats.totalCustomers}`);
    console.log(`Successfully migrated: ${stats.migratedCustomers}`);
    console.log(`Societies created: ${stats.createdSocieties}`);
    console.log(`Buildings created: ${stats.createdBuildings}`);
    console.log(`Wallets created: ${stats.createdWallets}`);
    console.log(`Errors encountered: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      stats.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    console.log(
      `\n✅ Success rate: ${((stats.migratedCustomers / stats.totalCustomers) * 100).toFixed(2)}%`
    );
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const migration = new CustomerMigration();

  try {
    switch (command) {
      case 'dry-run':
        console.log('🔍 Starting dry run...');
        await migration.dryRun();
        break;

      case 'migrate':
        console.log('🚀 Starting customer migration...');
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
        console.log('📖 Customer Migration Tool');
        console.log('==========================');
        console.log('Usage:');
        console.log(
          '  node migrationcustomer.js dry-run   # Preview migration'
        );
        console.log(
          '  node migrationcustomer.js migrate   # Execute migration'
        );
        console.log('');
        console.log('Environment Variables Required:');
        console.log(
          '  DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME (PostgreSQL)'
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
