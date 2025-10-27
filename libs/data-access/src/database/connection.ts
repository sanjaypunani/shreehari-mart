import { AppDataSource } from './config';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private dataSource = AppDataSource;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.dataSource.initialize();
        this.isConnected = true;
        console.log('✅ Database connection established successfully');
      }
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.isConnected && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.isConnected = false;
        console.log('✅ Database connection closed successfully');
      }
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }

  public getDataSource() {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.dataSource;
  }

  public isConnectionActive(): boolean {
    return this.isConnected && this.dataSource.isInitialized;
  }
}

export default DatabaseConnection;
