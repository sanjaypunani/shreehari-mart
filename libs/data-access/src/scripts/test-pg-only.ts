import { Client } from 'pg';
import { config } from 'dotenv';

config();

const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

async function testPostgreSQL() {
  console.log('🔍 Testing PostgreSQL connection...');
  console.log('Config:', {
    host: PG_CONFIG.host,
    port: PG_CONFIG.port,
    user: PG_CONFIG.user,
    database: PG_CONFIG.database,
  });

  try {
    const pgClient = new Client(PG_CONFIG);
    console.log('📡 Attempting to connect...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connected successfully');

    const tablesQuery = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    const result = await pgClient.query(tablesQuery);
    console.log(
      '📋 Available tables:',
      result.rows.map((r) => r.table_name)
    );

    await pgClient.end();
    console.log('✅ PostgreSQL test completed');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
  }
}

testPostgreSQL().catch(console.error);
