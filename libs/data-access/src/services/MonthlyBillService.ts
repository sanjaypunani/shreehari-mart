import { DataSource } from 'typeorm';
import { MonthlyBillRepository } from '../repositories/MonthlyBillRepository';
import { MonthlyBill, BillStatus } from '../entities/MonthlyBill';
import {
  MonthlyBillDto,
  CreateMonthlyBillDto,
  MonthlyBillingSummaryDto,
  BulkGenerateBillsDto,
  BulkGenerateBillsResponseDto,
  PaginatedResponse,
} from '@shreehari/types';

export class MonthlyBillService {
  private monthlyBillRepository: MonthlyBillRepository;

  constructor(dataSource: DataSource) {
    this.monthlyBillRepository = new MonthlyBillRepository(dataSource);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    month?: string;
    status?: BillStatus;
    search?: string;
  }): Promise<PaginatedResponse<MonthlyBillDto>> {
    const result = await this.monthlyBillRepository.findAll({
      ...options,
      status: options.status as BillStatus,
    });

    return {
      data: result.data.map((bill: MonthlyBill) => this.mapToDto(bill)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: string): Promise<MonthlyBillDto | null> {
    const bill = await this.monthlyBillRepository.findById(id);
    return bill ? this.mapToDto(bill) : null;
  }

  async create(data: CreateMonthlyBillDto): Promise<MonthlyBillDto> {
    const billNumber = await this.monthlyBillRepository.generateBillNumber();

    const bill = await this.monthlyBillRepository.create({
      customerId: data.customerId,
      billNumber,
      billingMonth: data.billingPeriod.month,
      billingYear: data.billingPeriod.year,
      totalAmount: 0, // Will be calculated based on orders
      orderCount: data.orderIds.length,
      status: 'draft' as BillStatus,
    });

    return this.mapToDto(bill);
  }

  async markAsPaid(id: string): Promise<MonthlyBillDto | null> {
    const bill = await this.monthlyBillRepository.markAsPaid(id);
    return bill ? this.mapToDto(bill) : null;
  }

  async markAsSent(id: string): Promise<MonthlyBillDto | null> {
    const bill = await this.monthlyBillRepository.markAsSent(id);
    return bill ? this.mapToDto(bill) : null;
  }

  async getSummary(month?: string): Promise<MonthlyBillingSummaryDto> {
    return this.monthlyBillRepository.getSummary(month);
  }

  async bulkGenerate(
    data: BulkGenerateBillsDto
  ): Promise<BulkGenerateBillsResponseDto> {
    const monthStr = data.billingPeriod.month;
    const monthNumber = monthStr.split('-')[1];

    return this.monthlyBillRepository.bulkGenerateForMonth(
      monthNumber,
      data.billingPeriod.year
    );
  }

  async downloadInvoice(
    id: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<{
    downloadUrl: string;
    filename: string;
  }> {
    const bill = await this.monthlyBillRepository.findById(id);
    if (!bill) {
      throw new Error('Bill not found');
    }

    // Generate filename with current timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `invoice-${bill.billNumber}-${timestamp}.${format}`;

    // For now, return a mock URL that includes the correct route
    // In a real implementation, you would generate the actual PDF/Excel file here
    // and return the path to the generated file
    const downloadUrl = `/api/monthly-billing/${id}/download/${format}`;

    return { downloadUrl, filename };
  }

  async sendInvoiceEmail(
    id: string,
    options: {
      emailAddress?: string;
      customMessage?: string;
    }
  ): Promise<void> {
    const bill = await this.monthlyBillRepository.findById(id);
    if (!bill) {
      throw new Error('Bill not found');
    }

    // Mock implementation - replace with actual email sending
    console.log(
      `Sending invoice ${bill.billNumber} to ${options.emailAddress || bill.customer.email}`
    );

    // Mark as sent
    await this.monthlyBillRepository.markAsSent(id);
  }

  private mapToDto(bill: MonthlyBill): MonthlyBillDto {
    return {
      id: bill.id,
      customerId: bill.customerId,
      customer: {
        id: bill.customer.id,
        societyId: bill.customer.societyId,
        buildingId: bill.customer.buildingId,
        name: bill.customer.name,
        email: bill.customer.email,
        phone: bill.customer.phone,
        mobileNumber: bill.customer.mobileNumber,
        flatNumber: bill.customer.flatNumber,
        isMonthlyPayment: bill.customer.isMonthlyPayment,
        society: bill.customer.society
          ? {
              id: bill.customer.society.id,
              name: bill.customer.society.name,
              address: bill.customer.society.address,
              createdAt:
                bill.customer.society.createdAt instanceof Date
                  ? bill.customer.society.createdAt.toISOString()
                  : String(bill.customer.society.createdAt),
              updatedAt:
                bill.customer.society.updatedAt instanceof Date
                  ? bill.customer.society.updatedAt.toISOString()
                  : String(bill.customer.society.updatedAt),
            }
          : undefined,
        building: bill.customer.building
          ? {
              id: bill.customer.building.id,
              societyId: bill.customer.building.societyId,
              name: bill.customer.building.name,
              createdAt:
                bill.customer.building.createdAt instanceof Date
                  ? bill.customer.building.createdAt.toISOString()
                  : String(bill.customer.building.createdAt),
              updatedAt:
                bill.customer.building.updatedAt instanceof Date
                  ? bill.customer.building.updatedAt.toISOString()
                  : String(bill.customer.building.updatedAt),
            }
          : undefined,
        totalOrders: 0, // Will be calculated if needed
        totalSpent: 0, // Will be calculated if needed
        createdAt:
          bill.customer.createdAt instanceof Date
            ? bill.customer.createdAt.toISOString()
            : String(bill.customer.createdAt),
        updatedAt:
          bill.customer.updatedAt instanceof Date
            ? bill.customer.updatedAt.toISOString()
            : String(bill.customer.updatedAt),
      },
      billNumber: bill.billNumber,
      billingPeriod: {
        month: bill.billingMonth,
        year: bill.billingYear,
      },
      orders:
        bill.orders?.map((order) => ({
          id: order.id,
          customerId: order.customerId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          deliveryDate: order.deliveryDate
            ? order.deliveryDate instanceof Date
              ? order.deliveryDate.toISOString().split('T')[0]
              : String(order.deliveryDate)
            : undefined,
          items:
            order.items?.map((item) => ({
              id: item.id,
              productId: item.productId,
              productName: item.product?.name || '',
              orderedQuantity: item.orderedQuantity,
              unit: item.unit,
              pricePerBaseUnit: item.pricePerBaseUnit,
              baseQuantity: item.baseQuantity,
              finalPrice: item.finalPrice,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              createdAt:
                item.createdAt instanceof Date
                  ? item.createdAt.toISOString()
                  : String(item.createdAt),
            })) || [],
          status: order.status,
          paymentMode: order.paymentMode,
          totalAmount: order.totalAmount,
          discount: order.discount,
          createdAt:
            order.createdAt instanceof Date
              ? order.createdAt.toISOString()
              : String(order.createdAt),
          updatedAt:
            order.updatedAt instanceof Date
              ? order.updatedAt.toISOString()
              : String(order.updatedAt),
        })) || [],
      orderCount: bill.orderCount,
      totalAmount: Number(bill.totalAmount),
      status: bill.status,
      dueDate:
        bill.dueDate instanceof Date
          ? bill.dueDate.toISOString()
          : bill.dueDate
            ? String(bill.dueDate)
            : undefined,
      sentAt:
        bill.sentAt instanceof Date
          ? bill.sentAt.toISOString()
          : bill.sentAt
            ? String(bill.sentAt)
            : undefined,
      paidAt:
        bill.paidAt instanceof Date
          ? bill.paidAt.toISOString()
          : bill.paidAt
            ? String(bill.paidAt)
            : undefined,
      createdAt:
        bill.createdAt instanceof Date
          ? bill.createdAt.toISOString()
          : String(bill.createdAt),
      updatedAt:
        bill.updatedAt instanceof Date
          ? bill.updatedAt.toISOString()
          : String(bill.updatedAt),
    };
  }
}
