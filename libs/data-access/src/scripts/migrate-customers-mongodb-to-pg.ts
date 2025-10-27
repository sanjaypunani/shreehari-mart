import 'reflect-metadata';
import { MongoClient } from 'mongodb';
import { AppDataSource } from '../database/config';
import { Customer } from '../entities/Customer';
import { Society } from '../entities/Society';
import { Building } from '../entities/Building';
import { Wallet } from '../entities/Wallet';
import { Repository } from 'typeorm';

// MongoDB connection configuration
const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DATABASE = 'order_management';
const MONGODB_COLLECTION = 'customers';

// MongoDB Customer interface (matching your MongoDB schema)
interface MongoCustomer {
  _id: any;
  countryCode: string;
  mobileNumber: string;
  flatNumber: string;
  societyName: string;
  customerName: string;
  address: string;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Migration statistics
interface MigrationStats {
  totalCustomers: number;
  migratedCustomers: number;
  createdSocieties: number;
  createdBuildings: number;
  createdWallets: number;
  errors: string[];
}

class CustomerMigration {
  private mongoClient: MongoClient;
  private customerRepo!: Repository<Customer>;
  private societyRepo!: Repository<Society>;
  private buildingRepo!: Repository<Building>;
  private walletRepo!: Repository<Wallet>;

  // Cache for societies and buildings to avoid duplicates
  private societyCache = new Map<string, Society>();
  private buildingCache = new Map<string, Building>();

  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI);
  }

  async initialize(): Promise<void> {
    console.log('🔌 Connecting to MongoDB...');
    await this.mongoClient.connect();
    console.log('✅ MongoDB connected successfully');

    console.log('🔌 Connecting to PostgreSQL...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('✅ PostgreSQL connected successfully');

    // Initialize repositories
    this.customerRepo = AppDataSource.getRepository(Customer);
    this.societyRepo = AppDataSource.getRepository(Society);
    this.buildingRepo = AppDataSource.getRepository(Building);
    this.walletRepo = AppDataSource.getRepository(Wallet);
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up connections...');
    await this.mongoClient.close();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    console.log('✅ Cleanup completed');
  }

  /**
   * Extract building name from flat number and standardize flat number format
   * Handles formats: A-101, A101, A 101, etc.
   * Returns: { buildingName: 'A', standardizedFlatNumber: 'A101' }
   */
  private extractBuildingAndStandardizeFlatNumber(flatNumber: string): {
    buildingName: string;
    standardizedFlatNumber: string;
  } {
    // Remove extra spaces and normalize
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

    // Default fallback - use original flat number with building A
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
  private async getOrCreateSociety(
    societyName: string,
    address: string
  ): Promise<Society> {
    const normalizedName = societyName.trim();

    // Check cache first (using original case for cache key)
    if (this.societyCache.has(normalizedName)) {
      return this.societyCache.get(normalizedName)!;
    }

    // Check if society exists in database (case-insensitive search)
    let society = await this.societyRepo
      .createQueryBuilder('society')
      .where('LOWER(society.name) = LOWER(:name)', { name: normalizedName })
      .getOne();

    if (!society) {
      // Create new society with original case
      society = this.societyRepo.create({
        name: normalizedName,
        address: address || 'Address not provided',
      });
      society = await this.societyRepo.save(society);
      console.log(`📍 Created new society: ${normalizedName}`);
    } else {
      console.log(
        `📍 Found existing society: ${society.name} (matched: ${normalizedName})`
      );
    }

    // Cache the society using original input name for faster lookups
    this.societyCache.set(normalizedName, society);
    this.societyCache.set(society.name, society); // Also cache with DB name
    return society;
  }

  /**
   * Get or create building
   */
  private async getOrCreateBuilding(
    buildingName: string,
    society: Society
  ): Promise<Building> {
    const buildingKey = `${society.id}-${buildingName}`;

    // Check cache first
    if (this.buildingCache.has(buildingKey)) {
      return this.buildingCache.get(buildingKey)!;
    }

    // Check if building exists in database
    let building = await this.buildingRepo.findOne({
      where: {
        name: buildingName,
        societyId: society.id,
      },
    });

    if (!building) {
      // Create new building
      building = this.buildingRepo.create({
        name: buildingName,
        societyId: society.id,
        society: society,
      });
      building = await this.buildingRepo.save(building);
      console.log(
        `🏢 Created new building: ${buildingName} in ${society.name}`
      );
    }

    // Cache the building
    this.buildingCache.set(buildingKey, building);
    return building;
  }

  /**
   * Create wallet for customer
   */
  private async createWallet(
    customer: Customer,
    balance: number
  ): Promise<Wallet> {
    const wallet = this.walletRepo.create({
      customerId: customer.id,
      balance: balance,
      customer: customer,
    });

    return await this.walletRepo.save(wallet);
  }

  /**
   * Validate mobile number format
   */
  private validateMobileNumber(mobileNumber: string): string {
    // Remove any non-digit characters
    const cleaned = mobileNumber.replace(/\D/g, '');

    // Ensure it's a valid length (assuming Indian mobile numbers)
    if (cleaned.length === 10) {
      return cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return cleaned.substring(2); // Remove country code
    }

    // Return as is if can't be cleaned
    return mobileNumber;
  }

  /**
   * Generate email from customer name and mobile number
   */
  private generateEmail(customerName: string, mobileNumber: string): string {
    const cleanName = customerName.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}.${mobileNumber}@customer.shreedharismart.com`;
  }

  /**
   * Main migration method
   */
  async migrate(): Promise<MigrationStats> {
    const stats: MigrationStats = {
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
      const collection = db.collection<MongoCustomer>(MONGODB_COLLECTION);

      // Get total count
      stats.totalCustomers = await collection.countDocuments();
      console.log(`📊 Found ${stats.totalCustomers} customers to migrate`);

      // Process customers in batches to avoid memory issues
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
            const errorMessage = `Failed to migrate customer ${mongoCustomer.customerName} (${mongoCustomer.mobileNumber}): ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.error(`❌ ${errorMessage}`);
            stats.errors.push(errorMessage);
          }
        }

        skip += batchSize;
      }

      // Update cache counts
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
  private async migrateCustomer(
    mongoCustomer: MongoCustomer,
    stats: MigrationStats
  ): Promise<void> {
    // Check if customer already exists (by mobile number)
    const cleanMobileNumber = this.validateMobileNumber(
      mongoCustomer.mobileNumber
    );

    const existingCustomer = await this.customerRepo.findOne({
      where: { mobileNumber: cleanMobileNumber },
    });

    if (existingCustomer) {
      console.log(
        `⚠️  Customer with mobile ${cleanMobileNumber} already exists, skipping...`
      );
      return;
    }

    // Get or create society
    const society = await this.getOrCreateSociety(
      mongoCustomer.societyName,
      mongoCustomer.address
    );

    // Extract building name and standardize flat number
    const { buildingName, standardizedFlatNumber } =
      this.extractBuildingAndStandardizeFlatNumber(mongoCustomer.flatNumber);
    const building = await this.getOrCreateBuilding(buildingName, society);

    // Generate email
    const email = this.generateEmail(
      mongoCustomer.customerName,
      cleanMobileNumber
    );

    // Create customer with standardized flat number
    const customer = this.customerRepo.create({
      name: mongoCustomer.customerName,
      email: email,
      mobileNumber: cleanMobileNumber,
      flatNumber: standardizedFlatNumber, // Use standardized format
      societyId: society.id,
      buildingId: building.id,
      society: society,
      building: building,
      isMonthlyPayment: false, // Default value
      createdAt: mongoCustomer.createdAt || new Date(),
      updatedAt: mongoCustomer.updatedAt || new Date(),
    });

    const savedCustomer = await this.customerRepo.save(customer);

    // Create wallet with the balance from MongoDB
    const wallet = await this.createWallet(
      savedCustomer,
      mongoCustomer.walletBalance || 0
    );
    stats.createdWallets++;

    stats.migratedCustomers++;
    console.log(
      `✅ Migrated customer: ${mongoCustomer.customerName} (${cleanMobileNumber})`
    );
  }

  /**
   * Print migration statistics
   */
  private printStats(stats: MigrationStats): void {
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

  /**
   * Dry run method - validates data without making changes
   */
  async dryRun(): Promise<void> {
    try {
      await this.initialize();

      const db = this.mongoClient.db(MONGODB_DATABASE);
      const collection = db.collection<MongoCustomer>(MONGODB_COLLECTION);

      const totalCustomers = await collection.countDocuments();
      console.log(`🔍 DRY RUN: Found ${totalCustomers} customers`);

      // Sample first 10 customers for validation
      const sampleCustomers = await collection.find({}).limit(10).toArray();

      console.log('\n📋 SAMPLE DATA PREVIEW:');
      console.log('=======================');

      sampleCustomers.forEach((customer: any, index: number) => {
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

      // Check for potential duplicates
      const duplicateMobiles = await collection
        .aggregate([
          { $group: { _id: '$mobileNumber', count: { $sum: 1 } } },
          { $match: { count: { $gt: 1 } } },
        ])
        .toArray();

      if (duplicateMobiles.length > 0) {
        console.log('\n⚠️  DUPLICATE MOBILE NUMBERS FOUND:');
        duplicateMobiles.forEach((dup: any) => {
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
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

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
          '  npm run tsx libs/data-access/src/scripts/migrate-customers-mongodb-to-pg.ts dry-run   # Preview migration'
        );
        console.log(
          '  npm run tsx libs/data-access/src/scripts/migrate-customers-mongodb-to-pg.ts migrate   # Execute migration'
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

export { CustomerMigration };
