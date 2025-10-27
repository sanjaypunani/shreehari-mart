import { Repository, EntityManager } from 'typeorm';
import { Customer } from '../entities/Customer';
import { Wallet } from '../entities/Wallet';
import { AppDataSource } from '../database/config';
import { WalletRepository } from './WalletRepository';

export class CustomerRepository {
  private repository: Repository<Customer>;
  private walletRepository: WalletRepository;

  constructor() {
    this.repository = AppDataSource.getRepository(Customer);
    this.walletRepository = new WalletRepository();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    societyId?: string;
    buildingId?: string;
    isMonthlyPayment?: boolean;
  }): Promise<{ customers: Customer[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      societyId,
      buildingId,
      isMonthlyPayment,
    } = options || {};
    const queryBuilder = this.repository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.address', 'address')
      .leftJoinAndSelect('customer.society', 'society')
      .leftJoinAndSelect('customer.building', 'building')
      .leftJoinAndSelect('customer.wallet', 'wallet')
      .leftJoinAndSelect('customer.orders', 'orders');

    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.mobileNumber ILIKE :search OR customer.flatNumber ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (societyId) {
      queryBuilder.andWhere('customer.societyId = :societyId', { societyId });
    }

    if (buildingId) {
      queryBuilder.andWhere('customer.buildingId = :buildingId', {
        buildingId,
      });
    }

    if (isMonthlyPayment !== undefined) {
      queryBuilder.andWhere('customer.isMonthlyPayment = :isMonthlyPayment', {
        isMonthlyPayment,
      });
    }

    queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [customers, total] = await queryBuilder.getManyAndCount();

    return { customers, total };
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['address', 'orders', 'society', 'building', 'wallet'],
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['address', 'society', 'building', 'wallet'],
    });
  }

  async findByMobileNumber(mobileNumber: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: { mobileNumber },
      relations: ['address', 'society', 'building', 'wallet'],
    });
  }

  async create(customerData: {
    societyId: string;
    buildingId: string;
    name: string;
    email: string;
    phone?: string;
    mobileNumber: string;
    flatNumber: string;
    isMonthlyPayment?: boolean;
    address?: any;
  }): Promise<Customer> {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      // Create customer without wallet - wallet will be created on first access
      const customer = manager.create(Customer, {
        ...customerData,
        isMonthlyPayment: customerData.isMonthlyPayment || false,
      });

      const savedCustomer = await manager.save(customer);

      // Return the saved customer
      return savedCustomer;
    });
  }

  async update(
    id: string,
    customerData: Partial<Customer>
  ): Promise<Customer | null> {
    await this.repository.update(id, customerData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    return this.repository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'orders')
      .addSelect('COUNT(orders.id)', 'orderCount')
      .addSelect('SUM(orders.total)', 'totalSpent')
      .groupBy('customer.id')
      .orderBy('totalSpent', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getCustomerStats(id: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('customer')
      .leftJoin('customer.orders', 'orders')
      .select('COUNT(orders.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(orders.total), 0)', 'totalSpent')
      .addSelect('COALESCE(AVG(orders.total), 0)', 'averageOrderValue')
      .where('customer.id = :id', { id })
      .getRawOne();

    return {
      totalOrders: parseInt(result.totalOrders) || 0,
      totalSpent: parseFloat(result.totalSpent) || 0,
      averageOrderValue: parseFloat(result.averageOrderValue) || 0,
    };
  }
}
