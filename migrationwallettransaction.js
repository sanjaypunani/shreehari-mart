const { MongoClient } = require('mongodb');
const { Client } = require('pg');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DATABASE = 'order_management';
const MONGODB_COLLECTION = 'walletTransactions';

// PostgreSQL connection configuration
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

class WalletTransactionMigration {
  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI);
    this.pgClient = new Client(PG_CONFIG);

    // Cache for customer mobile number to wallet ID mapping
    this.customerWalletCache = new Map(); // mobileNumber -> walletId
  }

  async initialize() {
    console.log('🔌 Connecting to MongoDB...');
    await this.mongoClient.connect();
    console.log('✅ MongoDB connected successfully');

    console.log('🔌 Connecting to PostgreSQL...');
    await this.pgClient.connect();
    console.log('✅ PostgreSQL connected successfully');

    // Build customer wallet cache
    await this.buildCustomerWalletCache();
  }

  async cleanup() {
    console.log('🧹 Cleaning up connections...');
    await this.mongoClient.close();
    await this.pgClient.end();
    console.log('✅ Cleanup completed');
  }

  /**
   * Build cache of customer mobile numbers to wallet IDs
   */
  async buildCustomerWalletCache() {
    console.log('🗂️  Building customer-wallet cache...');

    const query = `
      SELECT c."mobileNumber", w.id as wallet_id 
      FROM customers c 
      INNER JOIN wallets w ON c.id = w."customerId"
    `;

    const result = await this.pgClient.query(query);

    result.rows.forEach((row) => {
      this.customerWalletCache.set(row.mobileNumber, row.wallet_id);
    });

    console.log(
      `📋 Cached ${this.customerWalletCache.size} customer-wallet mappings`
    );
  }

  /**
   * Get wallet ID from customer ObjectId by looking up mobile number
   */
  async getWalletIdFromCustomerId(customerObjectId) {
    // First, we need to get the customer's mobile number from MongoDB
    const customersDb = this.mongoClient.db(MONGODB_DATABASE);
    const customersCollection = customersDb.collection('customers');

    const customer = await customersCollection.findOne({
      _id: customerObjectId,
    });

    if (!customer) {
      throw new Error(`Customer not found for ObjectId: ${customerObjectId}`);
    }

    const cleanMobileNumber = this.validateMobileNumber(customer.mobileNumber);
    const walletId = this.customerWalletCache.get(cleanMobileNumber);

    if (!walletId) {
      throw new Error(
        `Wallet not found for customer mobile: ${cleanMobileNumber}`
      );
    }

    return walletId;
  }

  /**
   * Validate mobile number format (same as customer migration)
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
   * Generate description from MongoDB transaction data
   */
  generateDescription(mongoTransaction) {
    let description = mongoTransaction.note || '';

    // Add metadata information to description
    if (mongoTransaction.metadata) {
      const meta = mongoTransaction.metadata;

      if (meta.adjustmentReason) {
        description += ` (Adjustment: ${meta.adjustmentReason})`;
      }

      if (meta.reversalReason) {
        description += ` (Reversal: ${meta.reversalReason})`;
      }

      if (meta.isReversal) {
        description += ' [REVERSAL]';
      }

      if (meta.editHistory) {
        description += ' [EDITED]';
      }

      if (meta.itemDetails && meta.itemDetails.length > 0) {
        const itemSummary = meta.itemDetails
          .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
          .join(', ');
        description += ` - Items: ${itemSummary}`;
      }

      if (
        meta.originalAmount &&
        meta.originalAmount !== mongoTransaction.amount
      ) {
        description += ` (Original: ₹${meta.originalAmount})`;
      }
    }

    // Add order reference if available
    if (mongoTransaction.orderId) {
      description += ` [Order: ${mongoTransaction.orderId}]`;
    }

    return description || `${mongoTransaction.type} transaction`;
  }

  /**
   * Dry run method
   */
  async dryRun() {
    try {
      await this.initialize();

      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      const totalTransactions = await collection.countDocuments();
      console.log(`🔍 DRY RUN: Found ${totalTransactions} wallet transactions`);

      // Sample first 10 transactions for validation
      const sampleTransactions = await collection.find({}).limit(10).toArray();

      console.log('\n📋 SAMPLE TRANSACTION PREVIEW:');
      console.log('================================');

      for (let i = 0; i < sampleTransactions.length; i++) {
        const transaction = sampleTransactions[i];

        try {
          const walletId = await this.getWalletIdFromCustomerId(
            transaction.customerId
          );
          const description = this.generateDescription(transaction);

          console.log(`${i + 1}. Transaction ID: ${transaction._id}`);
          console.log(`   Customer ID: ${transaction.customerId}`);
          console.log(`   Wallet ID: ${walletId}`);
          console.log(`   Type: ${transaction.type}`);
          console.log(`   Amount: ₹${transaction.amount}`);
          console.log(`   Balance After: ₹${transaction.balanceAfter}`);
          console.log(`   Note: ${transaction.note || 'N/A'}`);
          console.log(`   Description (generated): ${description}`);
          console.log(`   Created: ${transaction.createdAt}`);

          if (transaction.orderId) {
            console.log(`   Order ID: ${transaction.orderId}`);
          }

          if (transaction.metadata) {
            console.log(`   Has Metadata: Yes`);
            if (transaction.metadata.itemDetails) {
              console.log(
                `   Items: ${transaction.metadata.itemDetails.length}`
              );
            }
          }

          console.log('   ---');
        } catch (error) {
          console.log(
            `${i + 1}. ❌ Error processing transaction ${transaction._id}: ${error.message}`
          );
          console.log('   ---');
        }
      }

      // Check for potential issues
      const orphanedTransactions = await collection
        .aggregate([
          {
            $lookup: {
              from: 'customers',
              localField: 'customerId',
              foreignField: '_id',
              as: 'customer',
            },
          },
          {
            $match: {
              'customer.0': { $exists: false },
            },
          },
          {
            $count: 'orphaned',
          },
        ])
        .toArray();

      if (orphanedTransactions.length > 0) {
        console.log(
          `\n⚠️  ORPHANED TRANSACTIONS: ${orphanedTransactions[0].orphaned} transactions have no matching customer`
        );
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
      totalTransactions: 0,
      migratedTransactions: 0,
      skippedTransactions: 0,
      errors: [],
    };

    try {
      await this.initialize();

      // Get MongoDB database and collection
      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection(MONGODB_COLLECTION);

      // Get total count
      stats.totalTransactions = await collection.countDocuments();
      console.log(
        `📊 Found ${stats.totalTransactions} wallet transactions to migrate`
      );

      // Process transactions in batches
      const batchSize = 500;
      let skip = 0;

      while (skip < stats.totalTransactions) {
        const transactions = await collection
          .find({})
          .sort({ createdAt: 1 }) // Process in chronological order
          .skip(skip)
          .limit(batchSize)
          .toArray();

        console.log(
          `🔄 Processing batch ${Math.floor(skip / batchSize) + 1} (${transactions.length} transactions)...`
        );

        for (const mongoTransaction of transactions) {
          try {
            await this.migrateTransaction(mongoTransaction, stats);
          } catch (error) {
            const errorMessage = `Failed to migrate transaction ${mongoTransaction._id}: ${error.message}`;
            console.error(`❌ ${errorMessage}`);
            stats.errors.push(errorMessage);
            stats.skippedTransactions++;
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
   * Migrate a single wallet transaction
   */
  async migrateTransaction(mongoTransaction, stats) {
    // Get the corresponding wallet ID from PostgreSQL
    const walletId = await this.getWalletIdFromCustomerId(
      mongoTransaction.customerId
    );

    // Check if transaction already exists (by checking combination of walletId, amount, type, and createdAt)
    const existingQuery = `
      SELECT id FROM wallet_transactions 
      WHERE "walletId" = $1 
        AND amount = $2 
        AND type = $3 
        AND "createdAt" = $4 
      LIMIT 1
    `;

    const existing = await this.pgClient.query(existingQuery, [
      walletId,
      mongoTransaction.amount,
      mongoTransaction.type,
      mongoTransaction.createdAt,
    ]);

    if (existing.rows.length > 0) {
      console.log(
        `⚠️  Transaction already exists, skipping... (${mongoTransaction._id})`
      );
      stats.skippedTransactions++;
      return;
    }

    // Generate description from MongoDB data
    const description = this.generateDescription(mongoTransaction);

    // Insert wallet transaction
    const transactionQuery = `
      INSERT INTO wallet_transactions (
        "walletId", amount, type, description, "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const result = await this.pgClient.query(transactionQuery, [
      walletId,
      mongoTransaction.amount,
      mongoTransaction.type,
      description,
      mongoTransaction.createdAt || new Date(),
    ]);

    stats.migratedTransactions++;

    // Log progress every 100 transactions
    if (stats.migratedTransactions % 100 === 0) {
      console.log(`✅ Migrated ${stats.migratedTransactions} transactions...`);
    }
  }

  /**
   * Print migration statistics
   */
  printStats(stats) {
    console.log('\n📈 WALLET TRANSACTION MIGRATION STATISTICS');
    console.log('==========================================');
    console.log(`Total transactions found: ${stats.totalTransactions}`);
    console.log(`Successfully migrated: ${stats.migratedTransactions}`);
    console.log(`Skipped (duplicates): ${stats.skippedTransactions}`);
    console.log(`Errors encountered: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      stats.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    const successRate = (
      (stats.migratedTransactions / stats.totalTransactions) *
      100
    ).toFixed(2);
    console.log(`\n✅ Success rate: ${successRate}%`);
  }

  /**
   * Verify migration by comparing totals
   */
  async verifyMigration() {
    try {
      await this.initialize();

      console.log('🔍 Verifying migration...');

      // Count transactions in MongoDB
      const mongoDb = this.mongoClient.db(MONGODB_DATABASE);
      const mongoCollection = mongoDb.collection(MONGODB_COLLECTION);
      const mongoCount = await mongoCollection.countDocuments();

      // Count transactions in PostgreSQL
      const pgResult = await this.pgClient.query(
        'SELECT COUNT(*) FROM wallet_transactions'
      );
      const pgCount = parseInt(pgResult.rows[0].count);

      console.log(`📊 MongoDB transactions: ${mongoCount}`);
      console.log(`📊 PostgreSQL transactions: ${pgCount}`);

      if (mongoCount === pgCount) {
        console.log('✅ Transaction counts match perfectly!');
      } else {
        console.log(
          `⚠️  Count mismatch. Difference: ${Math.abs(mongoCount - pgCount)}`
        );
      }

      // Sample comparison of recent transactions
      const recentMongo = await mongoCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      const recentPg = await this.pgClient.query(`
        SELECT wt.*, w."customerId", c."mobileNumber"
        FROM wallet_transactions wt
        JOIN wallets w ON wt."walletId" = w.id
        JOIN customers c ON w."customerId" = c.id
        ORDER BY wt."createdAt" DESC
        LIMIT 5
      `);

      console.log('\n📋 Recent Transactions Comparison:');
      console.log('MongoDB vs PostgreSQL');
      console.log('=====================');

      for (
        let i = 0;
        i < Math.min(recentMongo.length, recentPg.rows.length);
        i++
      ) {
        const mongo = recentMongo[i];
        const pg = recentPg.rows[i];

        console.log(`${i + 1}. Amount: ₹${mongo.amount} vs ₹${pg.amount}`);
        console.log(`   Type: ${mongo.type} vs ${pg.type}`);
        console.log(`   Date: ${mongo.createdAt} vs ${pg.createdAt}`);
        console.log('   ---');
      }
    } catch (error) {
      console.error('💥 Verification failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const migration = new WalletTransactionMigration();

  try {
    switch (command) {
      case 'dry-run':
        console.log('🔍 Starting wallet transaction dry run...');
        await migration.dryRun();
        break;

      case 'migrate':
        console.log('🚀 Starting wallet transaction migration...');
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

      case 'verify':
        console.log('🔍 Verifying wallet transaction migration...');
        await migration.verifyMigration();
        break;

      default:
        console.log('📖 Wallet Transaction Migration Tool');
        console.log('====================================');
        console.log('Usage:');
        console.log(
          '  node migrationwallettransaction.js dry-run   # Preview migration'
        );
        console.log(
          '  node migrationwallettransaction.js migrate   # Execute migration'
        );
        console.log(
          '  node migrationwallettransaction.js verify    # Verify migration results'
        );
        console.log('');
        console.log('Prerequisites:');
        console.log('  - Customer migration must be completed first');
        console.log('  - PostgreSQL environment variables must be set');
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
