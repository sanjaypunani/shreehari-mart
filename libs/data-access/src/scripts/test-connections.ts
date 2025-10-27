import { MongoClient } from 'mongodb';
import { Client } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config();

const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

async function testConnections() {
  console.log('🧪 Testing Database Connections');
  console.log('===============================');

  // Test MongoDB connection
  console.log('\n1. Testing MongoDB connection...');
  try {
    const mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log('✅ MongoDB connected successfully');

    const db = mongoClient.db('order_management');
    const collection = db.collection('customers');
    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} customers in MongoDB`);

    // Get sample customer
    const sample = await collection.findOne({});
    if (sample) {
      console.log(
        `📋 Sample customer: ${sample.customerName} (${sample.mobileNumber})`
      );
    }

    await mongoClient.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }

  // Test PostgreSQL connection
  console.log('\n2. Testing PostgreSQL connection...');
  try {
    const pgClient = new Client(PG_CONFIG);
    await pgClient.connect();
    console.log('✅ PostgreSQL connected successfully');

    // Check if tables exist
    const tablesQuery = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('customers', 'societies', 'buildings', 'wallets')
      ORDER BY table_name
    `;
    const result = await pgClient.query(tablesQuery);
    console.log(
      '📋 Available tables:',
      result.rows.map((r) => r.table_name)
    );

    // Check customer count
    try {
      const customerCount = await pgClient.query(
        'SELECT COUNT(*) FROM customers'
      );
      console.log(
        `📊 Current customers in PostgreSQL: ${customerCount.rows[0].count}`
      );
    } catch (e) {
      console.log('📊 No customers table or no data yet');
    }

    await pgClient.end();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    console.log(
      '💡 Make sure PostgreSQL is running and credentials are correct'
    );
    console.log('💡 Current config:', {
      host: PG_CONFIG.host,
      port: PG_CONFIG.port,
      user: PG_CONFIG.user,
      database: PG_CONFIG.database,
    });
  }

  console.log('\n✅ Connection test completed');
}

testConnections().catch(console.error);
