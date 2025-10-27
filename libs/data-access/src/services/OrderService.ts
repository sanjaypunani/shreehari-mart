import { OrderRepository } from '../repositories/OrderRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { WalletRepository } from '../repositories/WalletRepository';

export class OrderService {
  private orderRepository: OrderRepository;
  private customerRepository: CustomerRepository;
  private productRepository: ProductRepository;
  private walletRepository: WalletRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.customerRepository = new CustomerRepository();
    this.productRepository = new ProductRepository();
    this.walletRepository = new WalletRepository();
  }

  /**
   * Create an order with automatic payment mode selection and price calculation
   */
  async createOrder(orderData: {
    customerId: string;
    items: Array<{
      productId: string;
      orderedQuantity: number;
      unit: 'gm' | 'kg' | 'pc';
    }>;
    deliveryDate: string;
    discount?: number;
    notes?: string;
  }) {
    try {
      const order = await this.orderRepository.create(orderData);
      return {
        success: true,
        data: order,
        message: `Order created successfully with ${order.paymentMode} payment mode`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * Get order with payment mode explanation
   */
  async getOrderWithPaymentInfo(orderId: string) {
    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        return {
          success: false,
          error: 'Order not found',
          data: null,
        };
      }

      const paymentModeExplanation = this.getPaymentModeExplanation(
        order.paymentMode
      );

      return {
        success: true,
        data: {
          ...order,
          paymentModeExplanation,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * Update an order with optional item modifications
   */
  async updateOrderWithItems(
    orderId: string,
    updateData: {
      deliveryDate?: string;
      discount?: number;
      notes?: string;
      items?: Array<{
        productId: string;
        orderedQuantity: number;
        unit: 'gm' | 'kg' | 'pc';
      }>;
    }
  ) {
    try {
      const order = await this.orderRepository.updateWithItems(
        orderId,
        updateData
      );
      if (!order) {
        return {
          success: false,
          error: 'Order not found',
          data: null,
        };
      }

      return {
        success: true,
        data: order,
        message: `Order updated successfully${updateData.items ? ' with items' : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * Get explanation for payment mode selection
   */
  private getPaymentModeExplanation(paymentMode: string): string {
    switch (paymentMode) {
      case 'wallet':
        return 'Auto-selected: Customer has sufficient wallet balance';
      case 'monthly':
        return 'Auto-selected: Customer prefers monthly payment and insufficient wallet balance';
      case 'cod':
        return 'Auto-selected: Default payment mode (insufficient wallet balance, not monthly customer)';
      default:
        return 'Unknown payment mode';
    }
  }

  /**
   * Example calculation for price demonstration
   */
  calculateItemPrice(
    orderedQuantity: number,
    unit: 'gm' | 'kg' | 'pc',
    productPrice: number,
    productQuantity: number,
    productUnit: 'gm' | 'kg' | 'pc'
  ): number {
    // Convert product unit to base quantity
    let baseQuantity: number;

    switch (productUnit) {
      case 'kg':
        baseQuantity = 1000; // 1000 grams = 1 kg
        break;
      case 'gm':
        baseQuantity = productQuantity;
        break;
      case 'pc':
        baseQuantity = 1; // 1 piece
        break;
      default:
        baseQuantity = 1;
    }

    // Formula: final_price = (ordered_quantity / base_quantity) * price_per_base_unit
    return (orderedQuantity / baseQuantity) * productPrice;
  }
}
