import { Request, Response } from 'express';
import { AppDataSource } from '@shreehari/data-access';
import { MonthlyBillService } from '@shreehari/data-access';
import {
  MonthlyBillDto,
  CreateMonthlyBillDto,
  MonthlyBillingSummaryDto,
  BulkGenerateBillsDto,
  BulkGenerateBillsResponseDto,
  SendInvoiceEmailDto,
  DownloadInvoiceResponseDto,
  ApiResponse,
  PaginatedResponse,
} from '@shreehari/types';

export class MonthlyBillingController {
  private monthlyBillService: MonthlyBillService;

  constructor() {
    this.monthlyBillService = new MonthlyBillService(AppDataSource);
  }

  // GET /api/monthly-bills
  async getMonthlyBills(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, month, status, search } = req.query;

      const result = await this.monthlyBillService.findAll({
        page: Number(page),
        limit: Number(limit),
        month: month as string,
        status: status as any,
        search: search as string,
      });

      const response: ApiResponse<PaginatedResponse<MonthlyBillDto>> = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching monthly bills:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to fetch monthly bills',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // GET /api/monthly-bills/:id
  async getMonthlyBillById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bill = await this.monthlyBillService.findById(id);

      if (!bill) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Monthly bill not found',
          data: null,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<MonthlyBillDto> = {
        success: true,
        data: bill,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching monthly bill:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to fetch monthly bill',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // POST /api/monthly-bills
  async createMonthlyBill(req: Request, res: Response): Promise<void> {
    try {
      const createData: CreateMonthlyBillDto = req.body;
      const bill = await this.monthlyBillService.create(createData);

      const response: ApiResponse<MonthlyBillDto> = {
        success: true,
        data: bill,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating monthly bill:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to create monthly bill',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // POST /api/monthly-bills/:id/mark-paid
  async markBillAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bill = await this.monthlyBillService.markAsPaid(id);

      if (!bill) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Monthly bill not found',
          data: null,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<MonthlyBillDto> = {
        success: true,
        data: bill,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to mark bill as paid',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // POST /api/monthly-bills/:id/mark-sent
  async markBillAsSent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bill = await this.monthlyBillService.markAsSent(id);

      if (!bill) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Monthly bill not found',
          data: null,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<MonthlyBillDto> = {
        success: true,
        data: bill,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error marking bill as sent:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to mark bill as sent',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // GET /api/monthly-bills/summary
  async getMonthlyBillingSummary(req: Request, res: Response): Promise<void> {
    try {
      const { month } = req.query;
      const summary = await this.monthlyBillService.getSummary(month as string);

      const response: ApiResponse<MonthlyBillingSummaryDto> = {
        success: true,
        data: summary,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching billing summary:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to fetch billing summary',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // POST /api/monthly-bills/bulk-generate
  async bulkGenerateBills(req: Request, res: Response): Promise<void> {
    try {
      const bulkData: BulkGenerateBillsDto = req.body;
      const result = await this.monthlyBillService.bulkGenerate(bulkData);

      const response: ApiResponse<BulkGenerateBillsResponseDto> = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error bulk generating bills:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to bulk generate bills',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // POST /api/monthly-bills/:id/send-email
  async sendInvoiceEmail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { emailAddress, customMessage }: SendInvoiceEmailDto = req.body;

      await this.monthlyBillService.sendInvoiceEmail(id, {
        emailAddress,
        customMessage,
      });

      const response: ApiResponse<{ success: boolean; message: string }> = {
        success: true,
        data: {
          success: true,
          message: 'Invoice email sent successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error sending invoice email:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to send invoice email',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  // GET /api/monthly-bills/:id/download-invoice
  // GET /api/monthly-bills/:id/download/:format
  async downloadInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id, format: urlFormat } = req.params;
      const { format: queryFormat = 'pdf' } = req.query;

      // Use format from URL path if available, otherwise use query parameter
      const format = urlFormat || queryFormat;

      // For direct file download, generate and serve the file
      if (format === 'pdf' || format === 'excel') {
        await this.generateAndServeFile(id, format as 'pdf' | 'excel', res);
        return;
      }

      // For API response with download URL
      const result = await this.monthlyBillService.downloadInvoice(
        id,
        format as 'pdf' | 'excel'
      );

      const response: ApiResponse<DownloadInvoiceResponseDto> = {
        success: true,
        data: {
          filename: result.filename,
          downloadUrl: result.downloadUrl,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to download invoice',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  private async generateAndServeFile(
    id: string,
    format: 'pdf' | 'excel',
    res: Response
  ): Promise<void> {
    const bill = await this.monthlyBillService.findById(id);
    if (!bill) {
      res.status(404).json({
        success: false,
        message: 'Monthly bill not found',
      });
      return;
    }

    const filename = `invoice-${bill.billNumber}.${format}`;

    if (format === 'pdf') {
      // Generate PDF content (simple HTML-to-PDF for now)
      const htmlContent = this.generateInvoiceHTML(bill);

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      // For now, return HTML content (in production, convert to PDF)
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${bill.billNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .bill-info { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .orders-table { width: 100%; border-collapse: collapse; }
            .orders-table th, .orders-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .orders-table th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
    } else {
      // For Excel format, return JSON for now
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
      res.json({
        bill: bill,
        message: 'Excel generation not implemented yet',
      });
    }
  }

  private generateInvoiceHTML(bill: MonthlyBillDto): string {
    const orderRows =
      bill.orders
        ?.map(
          (order) => `
      <tr>
        <td>${order.id.slice(0, 8)}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>${order.items?.length || 0}</td>
        <td>₹${Number(order.totalAmount || 0).toFixed(2)}</td>
      </tr>
    `
        )
        .join('') || '';

    return `
      <div class="header">
        <h1>INVOICE</h1>
        <h2>Shreehari Mart</h2>
      </div>
      
      <div class="bill-info">
        <p><strong>Invoice Number:</strong> ${bill.billNumber}</p>
        <p><strong>Billing Period:</strong> ${new Date(bill.billingPeriod.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <p><strong>Due Date:</strong> ${bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Status:</strong> ${bill.status.toUpperCase()}</p>
      </div>
      
      <div class="customer-info">
        <h3>Bill To:</h3>
        <p><strong>${bill.customer.name}</strong></p>
        <p>${bill.customer.society?.name || ''}</p>
        <p>Flat: ${bill.customer.flatNumber}</p>
        <p>Email: ${bill.customer.email}</p>
        <p>Phone: ${bill.customer.phone}</p>
      </div>
      
      <h3>Orders Included:</h3>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows}
        </tbody>
      </table>
      
      <div class="total">
        <p>Total Orders: ${bill.orderCount}</p>
        <p>Total Amount: ₹${Number(bill.totalAmount || 0).toFixed(2)}</p>
      </div>
    `;
  }
}
