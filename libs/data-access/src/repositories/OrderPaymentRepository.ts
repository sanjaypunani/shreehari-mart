import { Repository } from 'typeorm';
import {
  OrderPayment,
  PaymentMethod,
  PaymentStatus,
} from '../entities/OrderPayment';
import { AppDataSource } from '../database/config';

export class OrderPaymentRepository {
  private repository: Repository<OrderPayment>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderPayment);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    method?: PaymentMethod;
    status?: PaymentStatus;
    orderId?: string;
  }): Promise<{ payments: OrderPayment[]; total: number }> {
    const { page = 1, limit = 10, method, status, orderId } = options || {};

    const queryBuilder = this.repository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (method) {
      queryBuilder.andWhere('payment.method = :method', { method });
    }

    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    if (orderId) {
      queryBuilder.andWhere('payment.orderId = :orderId', { orderId });
    }

    queryBuilder
      .orderBy('payment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [payments, total] = await queryBuilder.getManyAndCount();

    return { payments, total };
  }

  async findById(id: string): Promise<OrderPayment | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['order', 'order.customer'],
    });
  }

  async findByOrderId(orderId: string): Promise<OrderPayment[]> {
    return this.repository.find({
      where: { orderId },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(paymentData: {
    orderId: string;
    amount: number;
    method: PaymentMethod;
    status?: PaymentStatus;
  }): Promise<OrderPayment> {
    const payment = this.repository.create({
      ...paymentData,
      status: paymentData.status || 'pending',
    });

    return this.repository.save(payment);
  }

  async updateStatus(
    id: string,
    status: PaymentStatus
  ): Promise<OrderPayment | null> {
    const payment = await this.findById(id);
    if (!payment) return null;

    payment.status = status;
    return this.repository.save(payment);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getPaymentStats(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalPayments: number;
    totalAmount: number;
    paymentsByMethod: Record<PaymentMethod, number>;
    paymentsByStatus: Record<PaymentStatus, number>;
  }> {
    const queryBuilder = this.repository.createQueryBuilder('payment');

    if (dateFrom) {
      queryBuilder.andWhere('payment.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('payment.createdAt <= :dateTo', { dateTo });
    }

    const payments = await queryBuilder.getMany();

    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    const paymentsByMethod = {
      wallet: 0,
      monthly: 0,
      cod: 0,
    } as Record<PaymentMethod, number>;

    const paymentsByStatus = {
      pending: 0,
      success: 0,
      failed: 0,
    } as Record<PaymentStatus, number>;

    payments.forEach((payment) => {
      paymentsByMethod[payment.method]++;
      paymentsByStatus[payment.status]++;
    });

    return {
      totalPayments,
      totalAmount,
      paymentsByMethod,
      paymentsByStatus,
    };
  }
}
