import { Repository, EntityManager } from 'typeorm';
import { Order, OrderStatus, PaymentMode } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
// import { OrderPayment } from '../entities/OrderPayment';
import { Product } from '../entities/Product';
import { Customer } from '../entities/Customer';
import { Wallet } from '../entities/Wallet';
import {
  WalletTransaction,
  WalletTransactionType,
} from '../entities/WalletTransaction';
import { AppDataSource } from '../database/config';

export class OrderRepository {
  private repository: Repository<Order>;
  private orderItemRepository: Repository<OrderItem>;
  // private orderPaymentRepository: Repository<OrderPayment>;
  private productRepository: Repository<Product>;
  private customerRepository: Repository<Customer>;
  private walletRepository: Repository<Wallet>;
  private walletTransactionRepository: Repository<WalletTransaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
    this.orderItemRepository = AppDataSource.getRepository(OrderItem);
    // this.orderPaymentRepository = AppDataSource.getRepository(OrderPayment);
    this.productRepository = AppDataSource.getRepository(Product);
    this.customerRepository = AppDataSource.getRepository(Customer);
    this.walletRepository = AppDataSource.getRepository(Wallet);
    this.walletTransactionRepository =
      AppDataSource.getRepository(WalletTransaction);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<{ orders: Order[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      customerId,
      dateFrom,
      dateTo,
    } = options || {};
    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.society', 'society')
      .leftJoinAndSelect('customer.building', 'building')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    if (dateFrom) {
      queryBuilder.andWhere('order.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.createdAt <= :dateTo', { dateTo });
    }

    queryBuilder
      .orderBy('order.deliveryDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return { orders, total };
  }

  async findById(id: string): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['customer', 'customer.address', 'items', 'items.product'],
    });
  }

  async create(orderData: {
    customerId: string;
    items: Array<{
      productId: string;
      orderedQuantity: number;
      unit: 'gm' | 'kg' | 'pc';
    }>;
    deliveryDate: string;
    discount?: number;
    notes?: string;
  }): Promise<Order> {
    const createdOrder = await AppDataSource.transaction(
      async (manager: EntityManager) => {
        // Get customer with wallet
        const customer = await manager.findOne(Customer, {
          where: { id: orderData.customerId },
          relations: ['wallet'],
        });

        if (!customer) {
          throw new Error(`Customer with ID ${orderData.customerId} not found`);
        }

        // Calculate total and validate products
        let totalAmount = 0;
        const orderItems: Partial<OrderItem>[] = [];

        for (const item of orderData.items) {
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          if (!product.isAvailable) {
            throw new Error(`Product ${product.name} is not available`);
          }

          // Price calculation logic based on the refined module design
          const baseQuantity = this.getBaseQuantityForUnit(
            product.unit,
            product.quantity
          );
          const pricePerBaseUnit = product.price;

          const finalPrice = this.calculateItemPrice(
            item.orderedQuantity,
            item.unit,
            product.price,
            product.quantity,
            product.unit
          );

          totalAmount += finalPrice;

          orderItems.push({
            productId: item.productId,
            orderedQuantity: item.orderedQuantity,
            unit: item.unit,
            pricePerBaseUnit,
            baseQuantity,
            finalPrice,
            // Legacy fields for backward compatibility
            quantity: item.orderedQuantity,
            price: pricePerBaseUnit,
            total: finalPrice,
          });
        }

        // Auto-determine payment mode based on business logic
        let paymentMode: PaymentMode = 'cod'; // default

        const walletBalance = customer.wallet?.balance || 0;

        if (walletBalance >= totalAmount) {
          paymentMode = 'wallet';
        } else if (customer.isMonthlyPayment) {
          paymentMode = 'monthly';
        }
        console.log('Determined payment mode:', paymentMode);
        console.log('Total amount before discount:', totalAmount);
        // Create order
        const order = manager.create(Order, {
          customerId: orderData.customerId,
          totalAmount,
          paymentMode,
          notes: orderData.notes,
          deliveryDate: orderData.deliveryDate,
          discount: orderData.discount || 0,
          status: 'pending' as OrderStatus,
        });

        const savedOrder = await manager.save(Order, order);

        // Create order items
        const itemsToSave = orderItems.map((item) =>
          manager.create(OrderItem, { ...item, orderId: savedOrder.id })
        );

        await manager.save(OrderItem, itemsToSave);

        // Process payment if wallet payment
        if (paymentMode === 'wallet') {
          await this.processWalletPayment(
            manager,
            savedOrder.id,
            totalAmount,
            customer.wallet!.id
          );
        }

        // Create payment record for audit trail
        // const payment = manager.create(OrderPayment, {
        //   orderId: savedOrder.id,
        //   amount: totalAmount,
        //   method: paymentMode,
        //   status: paymentMode === 'wallet' ? 'success' : 'pending',
        // });

        // await manager.save(OrderPayment, payment);

        return savedOrder;
      }
    );

    // Load the complete order with relations after the transaction is committed
    const orderWithRelations = await this.findById(createdOrder.id);

    if (!orderWithRelations) {
      throw new Error('Failed to retrieve created order with relations');
    }

    return orderWithRelations;
  }

  private getBaseQuantityForUnit(
    unit: 'gm' | 'kg' | 'pc',
    productQuantity: number
  ): number {
    switch (unit) {
      case 'kg':
        return 1000; // 1000 grams = 1 kg
      case 'gm':
        return productQuantity; // Use the product's base quantity
      case 'pc':
        return 1; // 1 piece
      default:
        return 1;
    }
  }

  private async processWalletPayment(
    manager: EntityManager,
    orderId: string,
    amount: number,
    walletId: string
  ): Promise<void> {
    // Debit wallet
    const wallet = await manager.findOne(Wallet, { where: { id: walletId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    wallet.balance -= amount;
    await manager.save(Wallet, wallet);

    // Create wallet transaction
    const transaction = manager.create(WalletTransaction, {
      walletId,
      amount,
      type: WalletTransactionType.DEBIT,
      description: `Payment for order #${orderId}`,
    });

    await manager.save(WalletTransaction, transaction);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, orderData);
    return this.findById(id);
  }

  async updateWithItems(
    id: string,
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
  ): Promise<Order | null> {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      // Check if order exists
      const existingOrder = await this.findById(id);
      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // Check if order is in a state that allows modification
      if (
        existingOrder.status === 'delivered' ||
        existingOrder.status === 'cancelled'
      ) {
        throw new Error(
          `Cannot modify order with status: ${existingOrder.status}`
        );
      }

      let totalAmount = existingOrder.totalAmount;
      let paymentMode = existingOrder.paymentMode;

      // If items are being updated, recalculate everything
      if (updateData.items && updateData.items.length > 0) {
        // Get customer with wallet for payment mode calculation
        const customer = await manager.findOne(Customer, {
          where: { id: existingOrder.customerId },
          relations: ['wallet'],
        });

        if (!customer) {
          throw new Error(
            `Customer with ID ${existingOrder.customerId} not found`
          );
        }

        // Remove existing order items
        await manager.delete(OrderItem, { orderId: id });

        // Calculate new total and validate products
        totalAmount = 0;
        const orderItems: Partial<OrderItem>[] = [];

        for (const item of updateData.items) {
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          if (!product.isAvailable) {
            throw new Error(`Product ${product.name} is not available`);
          }

          // Price calculation logic
          const baseQuantity = this.getBaseQuantityForUnit(
            product.unit,
            product.quantity
          );
          const pricePerBaseUnit = product.price;

          const finalPrice = this.calculateItemPrice(
            item.orderedQuantity,
            item.unit,
            product.price,
            product.quantity,
            product.unit
          );

          totalAmount += finalPrice;

          orderItems.push({
            productId: item.productId,
            orderedQuantity: item.orderedQuantity,
            unit: item.unit,
            pricePerBaseUnit,
            baseQuantity,
            finalPrice,
            // Legacy fields for backward compatibility
            quantity: item.orderedQuantity,
            price: pricePerBaseUnit,
            total: finalPrice,
          });
        }

        // Recalculate payment mode based on new total
        const walletBalance = customer.wallet?.balance || 0;

        if (walletBalance >= totalAmount) {
          paymentMode = 'wallet';
        } else if (customer.isMonthlyPayment) {
          paymentMode = 'monthly';
        } else {
          paymentMode = 'cod';
        }

        // Handle payment changes
        await this.handlePaymentModeChange(
          manager,
          existingOrder,
          paymentMode,
          totalAmount,
          customer.wallet?.id
        );

        // Create new order items
        const itemsToSave = orderItems.map((item) =>
          manager.create(OrderItem, { ...item, orderId: id })
        );

        await manager.save(OrderItem, itemsToSave);
      }

      // Update order fields
      const orderUpdateData: Partial<Order> = {
        totalAmount,
        paymentMode,
        notes: updateData.notes,
        discount: updateData.discount,
        deliveryDate: updateData.deliveryDate
          ? new Date(updateData.deliveryDate)
          : undefined,
      };

      // Only include non-undefined values
      Object.keys(orderUpdateData).forEach((key) => {
        if (
          orderUpdateData[key as keyof typeof orderUpdateData] === undefined
        ) {
          delete orderUpdateData[key as keyof typeof orderUpdateData];
        }
      });

      await manager.update(Order, id, orderUpdateData);

      // Return updated order with relations
      return this.findById(id);
    });
  }

  private async handlePaymentModeChange(
    manager: EntityManager,
    existingOrder: Order,
    newPaymentMode: PaymentMode,
    newTotalAmount: number,
    walletId?: string
  ): Promise<void> {
    const oldPaymentMode = existingOrder.paymentMode;
    const oldTotalAmount = existingOrder.totalAmount;

    // If payment mode changed from wallet to something else, refund the old amount
    if (
      oldPaymentMode === 'wallet' &&
      newPaymentMode !== 'wallet' &&
      walletId
    ) {
      await this.refundWalletPayment(
        manager,
        existingOrder.id,
        oldTotalAmount,
        walletId
      );
    }

    // If payment mode changed to wallet, process new payment
    if (
      newPaymentMode === 'wallet' &&
      oldPaymentMode !== 'wallet' &&
      walletId
    ) {
      await this.processWalletPayment(
        manager,
        existingOrder.id,
        newTotalAmount,
        walletId
      );
    }

    // If payment mode is wallet for both but amount changed
    else if (
      oldPaymentMode === 'wallet' &&
      newPaymentMode === 'wallet' &&
      walletId
    ) {
      const amountDifference = newTotalAmount - oldTotalAmount;

      if (amountDifference > 0) {
        // Charge additional amount
        await this.processWalletPayment(
          manager,
          existingOrder.id,
          amountDifference,
          walletId
        );
      } else if (amountDifference < 0) {
        // Refund the difference
        await this.refundWalletPayment(
          manager,
          existingOrder.id,
          Math.abs(amountDifference),
          walletId
        );
      }
    }
  }

  private async refundWalletPayment(
    manager: EntityManager,
    orderId: string,
    amount: number,
    walletId: string
  ): Promise<void> {
    // Credit wallet
    const wallet = await manager.findOne(Wallet, { where: { id: walletId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance += amount;
    await manager.save(Wallet, wallet);

    // Create wallet transaction
    const transaction = manager.create(WalletTransaction, {
      walletId,
      amount,
      type: WalletTransactionType.CREDIT,
      description: `Refund for order #${orderId} modification`,
    });

    await manager.save(WalletTransaction, transaction);
  }

  async delete(id: string): Promise<boolean> {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      const order = await this.findById(id);
      if (!order) return false;

      // Order deletion without stock restoration since we don't track stock anymore
      const result = await manager.delete(Order, id);
      return result.affected! > 0;
    });
  }

  async getOrderStats(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalDiscount: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    paymentModeBreakdown: Record<PaymentMode, number>;
    pendingOrders: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder('order');

    // Use deliveryDate for filtering instead of createdAt
    if (dateFrom) {
      queryBuilder.andWhere('order.deliveryDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.deliveryDate <= :dateTo', { dateTo });
    }

    const [orders, totalOrders] = await queryBuilder.getManyAndCount();

    // Calculate totals after discount
    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + (Number(order.totalAmount) - Number(order.discount || 0)),
      0
    );
    const totalDiscount = orders.reduce(
      (sum, order) => sum + Number(order.discount || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const ordersByStatus: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      delivered: 0,
      cancelled: 0,
    };

    const paymentModeBreakdown: Record<PaymentMode, number> = {
      wallet: 0,
      monthly: 0,
      cod: 0,
    };

    orders.forEach((order) => {
      ordersByStatus[order.status]++;
      paymentModeBreakdown[order.paymentMode]++;
    });

    const pendingOrders = ordersByStatus.pending;

    return {
      totalOrders,
      totalRevenue,
      totalDiscount,
      averageOrderValue,
      ordersByStatus,
      paymentModeBreakdown,
      pendingOrders,
    };
  }

  async getCustomerAnalytics(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    newVsReturningCustomers: {
      new: number;
      returning: number;
    };
    topCustomers: Array<{
      id: string;
      name: string;
      flatNumber: string;
      societyName: string;
      totalOrderValue: number;
      orderCount: number;
    }>;
    customerRetentionRate: number;
    mostActiveAreas: Array<{
      societyName: string;
      orderCount: number;
      revenue: number;
    }>;
  }> {
    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.society', 'society');

    // Use deliveryDate for filtering
    if (dateFrom) {
      queryBuilder.andWhere('order.deliveryDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.deliveryDate <= :dateTo', { dateTo });
    }

    const orders = await queryBuilder.getMany();

    // Calculate new vs returning customers
    const customerFirstOrders = new Map<string, Date>();
    const customersInRange = new Set<string>();

    // First, get all customer first order dates
    const allCustomerOrders = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .orderBy('order.deliveryDate', 'ASC')
      .getMany();

    allCustomerOrders.forEach((order) => {
      if (!customerFirstOrders.has(order.customerId)) {
        customerFirstOrders.set(
          order.customerId,
          order.deliveryDate || order.createdAt
        );
      }
    });

    // Categorize customers in current date range
    let newCustomers = 0;
    let returningCustomers = 0;

    orders.forEach((order) => {
      if (!customersInRange.has(order.customerId)) {
        customersInRange.add(order.customerId);
        const firstOrderDate = customerFirstOrders.get(order.customerId);
        const orderDate = order.deliveryDate || order.createdAt;

        if (firstOrderDate && dateFrom && firstOrderDate >= dateFrom) {
          newCustomers++;
        } else {
          returningCustomers++;
        }
      }
    });

    // Top customers by order value
    const customerStats = new Map<
      string,
      {
        name: string;
        flatNumber: string;
        societyName: string;
        totalOrderValue: number;
        orderCount: number;
      }
    >();

    orders.forEach((order) => {
      const customerId = order.customerId;
      const existing = customerStats.get(customerId);
      const orderValue =
        Number(order.totalAmount) - Number(order.discount || 0);

      if (existing) {
        existing.totalOrderValue += orderValue;
        existing.orderCount += 1;
      } else {
        customerStats.set(customerId, {
          name: order.customer.name,
          flatNumber: order.customer.flatNumber,
          societyName: order.customer.society?.name || 'Unknown',
          totalOrderValue: orderValue,
          orderCount: 1,
        });
      }
    });

    const topCustomers = Array.from(customerStats.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.totalOrderValue - a.totalOrderValue)
      .slice(0, 10);

    // Customer retention rate (customers with more than 1 order)
    const customersWithMultipleOrders = Array.from(
      customerStats.values()
    ).filter((customer) => customer.orderCount > 1).length;
    const totalCustomers = customerStats.size;
    const customerRetentionRate =
      totalCustomers > 0
        ? (customersWithMultipleOrders / totalCustomers) * 100
        : 0;

    // Most active areas by society
    const societyStats = new Map<
      string,
      { orderCount: number; revenue: number }
    >();

    orders.forEach((order) => {
      const societyName = order.customer.society?.name || 'Unknown';
      const existing = societyStats.get(societyName);
      const orderValue =
        Number(order.totalAmount) - Number(order.discount || 0);

      if (existing) {
        existing.orderCount += 1;
        existing.revenue += orderValue;
      } else {
        societyStats.set(societyName, { orderCount: 1, revenue: orderValue });
      }
    });

    const mostActiveAreas = Array.from(societyStats.entries())
      .map(([societyName, stats]) => ({ societyName, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      newVsReturningCustomers: {
        new: newCustomers,
        returning: returningCustomers,
      },
      topCustomers,
      customerRetentionRate,
      mostActiveAreas,
    };
  }

  async getProductAnalytics(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    topSellingVegetables: Array<{
      id: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
      unit: string;
    }>;
    lowSellingVegetables: Array<{
      id: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
      unit: string;
    }>;
    revenueContribution: Array<{
      id: string;
      name: string;
      revenue: number;
      percentage: number;
    }>;
  }> {
    const queryBuilder = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('order.status IN (:...statuses)', {
        statuses: ['confirmed', 'delivered'],
      });

    if (dateFrom) {
      queryBuilder.andWhere('order.deliveryDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.deliveryDate <= :dateTo', { dateTo });
    }

    const orderItems = await queryBuilder.getMany();

    // Group by product
    const productStats = new Map<
      string,
      {
        id: string;
        name: string;
        totalQuantity: number;
        totalRevenue: number;
        unit: string;
      }
    >();

    orderItems.forEach((item) => {
      const productId = item.productId;
      const existing = productStats.get(productId);

      if (existing) {
        existing.totalQuantity += Number(item.orderedQuantity);
        existing.totalRevenue += Number(item.finalPrice);
      } else {
        productStats.set(productId, {
          id: productId,
          name: item.product.name,
          totalQuantity: Number(item.orderedQuantity),
          totalRevenue: Number(item.finalPrice),
          unit: item.unit,
        });
      }
    });

    // Convert to arrays and sort
    const allProducts = Array.from(productStats.values());
    const totalRevenue = allProducts.reduce(
      (sum, product) => sum + Number(product.totalRevenue),
      0
    );

    // Top selling by quantity
    const topSellingVegetables = [...allProducts]
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    // Low selling (threshold: < 1kg or < 10 pieces)
    const lowSellingVegetables = allProducts
      .filter((product) => {
        if (product.unit === 'kg') return product.totalQuantity < 1;
        if (product.unit === 'gm') return product.totalQuantity < 1000;
        if (product.unit === 'pc') return product.totalQuantity < 10;
        return false;
      })
      .sort((a, b) => a.totalQuantity - b.totalQuantity)
      .slice(0, 10);

    // Revenue contribution
    const revenueContribution = allProducts
      .map((product) => ({
        id: product.id,
        name: product.name,
        revenue: Number(product.totalRevenue),
        percentage:
          totalRevenue > 0
            ? (Number(product.totalRevenue) / totalRevenue) * 100
            : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    return {
      topSellingVegetables,
      lowSellingVegetables,
      revenueContribution,
    };
  }

  async getDeliveryPlanAnalytics(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    ordersBySociety: Array<{
      societyName: string;
      buildings: Array<{
        buildingName: string;
        orders: Array<{
          id: string;
          flatNumber: string;
          customerName: string;
          orderAmount: number;
          paymentMethod: PaymentMode;
          deliveryDate: string;
        }>;
      }>;
    }>;
    itemsByDeliveryDate: Array<{
      deliveryDate: string;
      items: Array<{
        productName: string;
        totalQuantity: number;
        unit: string;
        packageCount: number;
        packageSize: number;
        packageDescription: string;
      }>;
    }>;
  }> {
    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.society', 'society')
      .leftJoinAndSelect('customer.building', 'building')
      .leftJoinAndSelect('order.items', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.status IN (:...statuses)', {
        statuses: ['pending', 'confirmed'],
      });

    if (dateFrom) {
      queryBuilder.andWhere('order.deliveryDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.deliveryDate <= :dateTo', { dateTo });
    }

    queryBuilder
      .orderBy('order.deliveryDate', 'ASC')
      .addOrderBy('society.name', 'ASC')
      .addOrderBy('building.name', 'ASC');

    const orders = await queryBuilder.getMany();

    // Group orders by society -> building
    const societyMap = new Map<string, Map<string, Array<any>>>();

    orders.forEach((order) => {
      const societyName = order.customer.society?.name || 'Unknown';
      const buildingName = order.customer.building?.name || 'Unknown';

      if (!societyMap.has(societyName)) {
        societyMap.set(societyName, new Map());
      }

      const buildingMap = societyMap.get(societyName)!;
      if (!buildingMap.has(buildingName)) {
        buildingMap.set(buildingName, []);
      }

      const deliveryDateStr = order.deliveryDate
        ? order.deliveryDate instanceof Date
          ? order.deliveryDate.toISOString().split('T')[0]
          : String(order.deliveryDate)
        : '';

      buildingMap.get(buildingName)!.push({
        id: order.id,
        flatNumber: order.customer.flatNumber,
        customerName: order.customer.name,
        orderAmount: Number(order.totalAmount) - Number(order.discount || 0),
        paymentMethod: order.paymentMode,
        deliveryDate: deliveryDateStr,
      });
    });

    // Convert to desired format
    const ordersBySociety = Array.from(societyMap.entries()).map(
      ([societyName, buildingMap]) => ({
        societyName,
        buildings: Array.from(buildingMap.entries()).map(
          ([buildingName, orders]) => ({
            buildingName,
            orders,
          })
        ),
      })
    );

    // Group items by delivery date
    const dateItemsMap = new Map<
      string,
      Map<
        string,
        {
          productName: string;
          totalQuantity: number;
          unit: string;
          packageCount: number;
          packageSize: number;
          packageDescription: string;
        }
      >
    >();

    orders.forEach((order) => {
      let deliveryDate: string;
      if (!order.deliveryDate) {
        deliveryDate = 'No Date';
      } else if (order.deliveryDate instanceof Date) {
        deliveryDate = order.deliveryDate.toISOString().split('T')[0];
      } else {
        // Handle case where deliveryDate is stored as string
        deliveryDate = String(order.deliveryDate);
      }

      if (!dateItemsMap.has(deliveryDate)) {
        dateItemsMap.set(deliveryDate, new Map());
      }

      const itemsMap = dateItemsMap.get(deliveryDate)!;

      order.items.forEach((item) => {
        const productName = item.product.name;
        // Create a unique key for product + ordered unit combination
        const packageKey = `${productName}_${item.unit}_${item.orderedQuantity}`;
        const existing = itemsMap.get(packageKey);

        if (existing) {
          existing.totalQuantity += item.orderedQuantity;
          existing.packageCount += 1;
        } else {
          // Calculate package size and description
          const packageSize = item.orderedQuantity;
          const packageDescription = `${productName} ${packageSize}${item.unit}`;

          itemsMap.set(packageKey, {
            productName,
            totalQuantity: item.orderedQuantity,
            unit: item.unit,
            packageCount: 1,
            packageSize: packageSize,
            packageDescription: packageDescription,
          });
        }
      });
    });

    const itemsByDeliveryDate = Array.from(dateItemsMap.entries()).map(
      ([deliveryDate, itemsMap]) => ({
        deliveryDate,
        items: Array.from(itemsMap.entries()).map(([packageKey, data]) => ({
          productName: data.productName,
          totalQuantity: data.totalQuantity,
          unit: data.unit,
          packageCount: data.packageCount,
          packageSize: data.packageSize,
          packageDescription: data.packageDescription,
        })),
      })
    );

    return {
      ordersBySociety,
      itemsByDeliveryDate,
    };
  }

  calculateItemPrice = (
    orderedQuantity: number,
    unit: 'gm' | 'kg' | 'pc',
    productPrice: number,
    productQuantity: number,
    productUnit: 'gm' | 'kg' | 'pc'
  ): number => {
    // Convert ordered quantity to the same unit as product pricing
    let normalizedOrderedQuantity: number;

    // Handle unit conversion
    if (productUnit === 'kg' && unit === 'gm') {
      // Product is priced per kg, but ordered in grams
      normalizedOrderedQuantity = orderedQuantity / 1000;
    } else if (productUnit === 'gm' && unit === 'kg') {
      // Product is priced per gram, but ordered in kg
      normalizedOrderedQuantity = orderedQuantity * 1000;
    } else if (productUnit === unit) {
      // Same units, no conversion needed
      normalizedOrderedQuantity = orderedQuantity;
    } else if (productUnit === 'pc' || unit === 'pc') {
      // For pieces, use direct quantity
      normalizedOrderedQuantity = orderedQuantity;
    } else {
      // Fallback for any other cases
      normalizedOrderedQuantity = orderedQuantity;
    }

    // Calculate price per unit of the product
    const pricePerUnit = productPrice / productQuantity;

    return normalizedOrderedQuantity * pricePerUnit;
  };
}
