import { ProductRepository } from '../repositories/ProductRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { OrderRepository } from '../repositories/OrderRepository';
// import { OrderPaymentRepository } from '../repositories/OrderPaymentRepository';
import { SocietyRepository } from '../repositories/SocietyRepository';
import { BuildingRepository } from '../repositories/BuildingRepository';
import { WalletRepository } from '../repositories/WalletRepository';
import { DatabaseConnection } from '../database/connection';

export class DatabaseService {
  private static instance: DatabaseService;
  private productRepository: ProductRepository;
  private customerRepository: CustomerRepository;
  private orderRepository: OrderRepository;
  // private orderPaymentRepository: OrderPaymentRepository;
  private societyRepository: SocietyRepository;
  private buildingRepository: BuildingRepository;
  private walletRepository: WalletRepository;

  private constructor() {
    this.productRepository = new ProductRepository();
    this.customerRepository = new CustomerRepository();
    this.orderRepository = new OrderRepository();
    // this.orderPaymentRepository = new OrderPaymentRepository();
    this.societyRepository = new SocietyRepository();
    this.buildingRepository = new BuildingRepository();
    this.walletRepository = new WalletRepository();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getProductRepository(): ProductRepository {
    this.ensureConnection();
    return this.productRepository;
  }

  public getCustomerRepository(): CustomerRepository {
    this.ensureConnection();
    return this.customerRepository;
  }

  public getOrderRepository(): OrderRepository {
    this.ensureConnection();
    return this.orderRepository;
  }

  // public getOrderPaymentRepository(): OrderPaymentRepository {
  //   this.ensureConnection();
  //   return this.orderPaymentRepository;
  // }

  public getSocietyRepository(): SocietyRepository {
    this.ensureConnection();
    return this.societyRepository;
  }

  public getBuildingRepository(): BuildingRepository {
    this.ensureConnection();
    return this.buildingRepository;
  }

  public getWalletRepository(): WalletRepository {
    this.ensureConnection();
    return this.walletRepository;
  }

  private ensureConnection(): void {
    const dbConnection = DatabaseConnection.getInstance();
    if (!dbConnection.isConnectionActive()) {
      throw new Error(
        'Database connection is not active. Please ensure connection is established.'
      );
    }
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    details?: string;
  }> {
    try {
      const dbConnection = DatabaseConnection.getInstance();

      if (!dbConnection.isConnectionActive()) {
        return {
          status: 'unhealthy',
          timestamp: new Date(),
          details: 'Database connection is not active',
        };
      }

      // Try a simple query to verify connection
      await this.productRepository.findAll({ page: 1, limit: 1 });

      return {
        status: 'healthy',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
