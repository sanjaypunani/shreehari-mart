import { Repository, Between, DataSource } from 'typeorm';
import { MonthlyBill, BillStatus } from '../entities/MonthlyBill';
import { Order } from '../entities/Order';
import { Customer } from '../entities/Customer';

interface FindAllOptions {
  page?: number;
  limit?: number;
  month?: string;
  status?: BillStatus;
  search?: string;
}

interface FindAllResult {
  data: MonthlyBill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MonthlyBillRepository {
  private monthlyBillRepository: Repository<MonthlyBill>;
  private orderRepository: Repository<Order>;
  private customerRepository: Repository<Customer>;

  constructor(dataSource: DataSource) {
    this.monthlyBillRepository = dataSource.getRepository(MonthlyBill);
    this.orderRepository = dataSource.getRepository(Order);
    this.customerRepository = dataSource.getRepository(Customer);
  }

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { page = 1, limit = 20, month, status, search } = options;
    const skip = (page - 1) * limit;

    let query = this.monthlyBillRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.customer', 'customer')
      .leftJoinAndSelect('customer.society', 'society')
      .leftJoinAndSelect('customer.building', 'building')
      .leftJoinAndSelect('bill.orders', 'orders');

    // Apply filters
    if (month) {
      query = query.where('bill.billingMonth = :month', { month });
    }

    if (status) {
      query = query.andWhere('bill.status = :status', { status });
    }

    if (search) {
      query = query.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR bill.billNumber ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination and get results
    const data = await query
      .orderBy('bill.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<MonthlyBill | null> {
    return this.monthlyBillRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'customer.society',
        'customer.building',
        'orders',
        'orders.items',
      ],
    });
  }

  async findByCustomerAndMonth(
    customerId: string,
    month: string
  ): Promise<MonthlyBill | null> {
    return this.monthlyBillRepository.findOne({
      where: { customerId, billingMonth: month },
      relations: ['customer', 'orders'],
    });
  }

  async create(data: Partial<MonthlyBill>): Promise<MonthlyBill> {
    const bill = this.monthlyBillRepository.create(data);
    return this.monthlyBillRepository.save(bill);
  }

  async update(
    id: string,
    data: Partial<MonthlyBill>
  ): Promise<MonthlyBill | null> {
    await this.monthlyBillRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.monthlyBillRepository.delete(id);
  }

  async markAsPaid(id: string): Promise<MonthlyBill | null> {
    await this.monthlyBillRepository.update(id, {
      status: 'paid' as BillStatus,
      paidAt: new Date(),
    });
    return this.findById(id);
  }

  async markAsSent(id: string): Promise<MonthlyBill | null> {
    await this.monthlyBillRepository.update(id, {
      status: 'sent' as BillStatus,
      sentAt: new Date(),
    });
    return this.findById(id);
  }

  async getSummary(month?: string): Promise<{
    billCount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    totalAmount: number;
  }> {
    let query = this.monthlyBillRepository.createQueryBuilder('bill');

    if (month) {
      query = query.where('bill.billingMonth = :month', { month });
    }

    const bills = await query.getMany();

    const summary = {
      billCount: bills.length,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      totalAmount: 0,
    };

    bills.forEach((bill) => {
      summary.totalAmount += Number(bill.totalAmount);

      switch (bill.status) {
        case 'paid':
          summary.paidAmount += Number(bill.totalAmount);
          break;
        case 'overdue':
          summary.overdueAmount += Number(bill.totalAmount);
          break;
        default:
          summary.pendingAmount += Number(bill.totalAmount);
          break;
      }
    });

    return summary;
  }

  async generateBillNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    // Get the count of bills for this month
    const monthStr = `${year}-${month}`;
    const count = await this.monthlyBillRepository.count({
      where: { billingMonth: monthStr },
    });

    // Generate bill number: MB-YYYY-MM-XXXX
    const billNumber = `MB-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
    return billNumber;
  }

  async bulkGenerateForMonth(
    month: string,
    year: number
  ): Promise<{
    generated: number;
    errors: string[];
  }> {
    const result = { generated: 0, errors: [] as string[] };
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    // Find all customers with monthly payment enabled
    const customers = await this.customerRepository.find({
      where: { isMonthlyPayment: true },
    });

    for (const customer of customers) {
      try {
        // Check if bill already exists
        const existingBill = await this.findByCustomerAndMonth(
          customer.id,
          monthStr
        );
        if (existingBill) {
          result.errors.push(
            `Bill already exists for customer ${customer.name} for ${monthStr}`
          );
          continue;
        }

        // Find orders for this customer in this month
        const startDate = new Date(year, parseInt(month) - 1, 1);
        const endDate = new Date(year, parseInt(month), 0);

        const orders = await this.orderRepository.find({
          where: {
            customerId: customer.id,
            paymentMode: 'monthly',
            createdAt: Between(startDate, endDate),
            monthlyBillId: undefined,
          },
        });

        if (orders.length === 0) {
          continue; // No orders to bill
        }

        // Calculate total amount
        const totalAmount = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        // Generate bill
        const billNumber = await this.generateBillNumber();
        const bill = await this.create({
          customerId: customer.id,
          billNumber,
          billingMonth: monthStr,
          billingYear: year,
          totalAmount,
          orderCount: orders.length,
          status: 'draft' as BillStatus,
          dueDate: new Date(year, parseInt(month), 15), // Due 15th of next month
        });

        // Update orders with the bill ID
        await this.orderRepository.update(
          orders.map((o) => o.id),
          { monthlyBillId: bill.id }
        );

        result.generated++;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(
          `Error generating bill for customer ${customer.name}: ${errorMessage}`
        );
      }
    }

    return result;
  }
}
