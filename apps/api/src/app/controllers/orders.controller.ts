import { Request, Response, NextFunction } from 'express';
import {
  OrderDto,
  OrderItemDto,
  CreateOrderDto,
  CreateOrderItemDto,
  ApiResponse,
  PaginatedResponse,
} from '@shreehari/types';
import { DatabaseService } from '@shreehari/data-access';

// Simple async handler
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Simple pagination helper
const paginate = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Simple error creator
const createError = (message: string, statusCode: number = 500) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};

// Simple logger
const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) =>
    console.error(`[ERROR] ${message}`, error),
};

// Helper function to convert Order entity to OrderDto
const mapOrderToDto = (order: any): OrderDto => {
  if (!order) {
    throw createError('Order data is null or undefined', 500);
  }
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: order.customerName || order.customer?.name || '',
    customerEmail: order.customerEmail || order.customer?.email || '',
    customerSociety: order.customer?.society?.name || '',
    customerFlatNumber: order.customer?.flatNumber || '',
    customerMobileNumber: order.customer?.mobileNumber || '',
    deliveryDate: order.deliveryDate
      ? order.deliveryDate instanceof Date
        ? order.deliveryDate.toISOString().split('T')[0]
        : String(order.deliveryDate)
      : undefined,
    items:
      order.items?.map(
        (item: any): OrderItemDto => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName || item.product?.name || '',
          orderedQuantity: item.orderedQuantity,
          unit: item.unit,
          pricePerBaseUnit: item.pricePerBaseUnit,
          baseQuantity: item.baseQuantity,
          finalPrice: item.finalPrice,
          // Legacy fields for backward compatibility
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          createdAt:
            item.createdAt instanceof Date
              ? item.createdAt.toISOString()
              : String(item.createdAt),
        })
      ) || [],
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
  };
};

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, skip } = paginate(req);
    const { status } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const { orders, total } = await orderRepository.findAll({
        page,
        limit,
        status: status as any,
      });

      const ordersDto = orders.map(mapOrderToDto);

      const response: ApiResponse<PaginatedResponse<OrderDto>> = {
        success: true,
        data: {
          data: ordersDto,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      logger.info(`Retrieved ${ordersDto.length} orders from database`);
      res.json(response);
    } catch (error) {
      logger.error('Failed to retrieve orders', error);
      throw createError('Failed to retrieve orders', 500);
    }
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const order = await orderRepository.findById(id);

      if (!order) {
        throw createError('Order not found', 404);
      }

      const orderDto = mapOrderToDto(order);

      const response: ApiResponse<OrderDto> = {
        success: true,
        data: orderDto,
      };

      res.json(response);
    } catch (error) {
      logger.error(`Failed to retrieve order ${id}`, error);
      if ((error as any).statusCode === 404) {
        throw error;
      }
      throw createError('Failed to retrieve order', 500);
    }
  }
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData: CreateOrderDto = req.body;

  try {
    // Validate required fields
    if (
      !orderData.customerId ||
      !orderData.items ||
      orderData.items.length === 0 ||
      !orderData.deliveryDate
    ) {
      throw createError(
        'Customer ID and items and delivery Date are required',
        400
      );
    }

    const databaseService = DatabaseService.getInstance();
    const orderRepository = databaseService.getOrderRepository();

    // Create order using repository
    const newOrder = await orderRepository.create({
      customerId: orderData.customerId,
      items: orderData.items.map((item) => ({
        productId: item.productId,
        orderedQuantity: item.orderedQuantity,
        unit: item.unit,
      })),
      deliveryDate: orderData.deliveryDate,
      discount: orderData.discount,
      notes: orderData.notes,
    });

    if (!newOrder) {
      throw createError(
        'Failed to create order - order creation returned null',
        500
      );
    }

    const orderDto = mapOrderToDto(newOrder);

    const response: ApiResponse<OrderDto> = {
      success: true,
      message: 'Order created successfully',
      data: orderDto,
    };

    logger.info(`Created new order: ${newOrder.id}`);
    res.status(201).json(response);
  } catch (error) {
    logger.error('Failed to create order', error);
    if (
      (error as any).message.includes('not found') ||
      (error as any).message.includes('not available')
    ) {
      throw createError((error as any).message, 400);
    }
    throw createError('Failed to create order', 500);
  }
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const databaseService = DatabaseService.getInstance();
    const orderRepository = databaseService.getOrderRepository();

    let updatedOrder: any;

    // Check if items are being updated
    if (updateData.items && Array.isArray(updateData.items)) {
      // Validate items if provided
      for (const item of updateData.items) {
        if (!item.productId || !item.orderedQuantity || !item.unit) {
          throw createError(
            'Each item must have productId, orderedQuantity, and unit',
            400
          );
        }

        if (!['gm', 'kg', 'pc'].includes(item.unit)) {
          throw createError('Invalid unit. Must be gm, kg, or pc', 400);
        }

        if (item.orderedQuantity <= 0) {
          throw createError('Ordered quantity must be greater than 0', 400);
        }
      }

      // Use the enhanced update method that handles items
      updatedOrder = await orderRepository.updateWithItems(id, updateData);
    } else {
      // Use the regular update method for simple field updates
      updatedOrder = await orderRepository.update(id, updateData);
    }

    if (!updatedOrder) {
      throw createError('Order not found', 404);
    }

    const orderDto = mapOrderToDto(updatedOrder);

    const response: ApiResponse<OrderDto> = {
      success: true,
      message: `Order updated successfully${updateData.items ? ' with items' : ''}`,
      data: orderDto,
    };

    logger.info(`Updated order: ${id}${updateData.items ? ' with items' : ''}`);
    res.json(response);
  } catch (error) {
    logger.error(`Failed to update order ${id}`, error);
    if ((error as any).statusCode === 404) {
      throw error;
    }
    throw createError('Failed to update order', 500);
  }
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const databaseService = DatabaseService.getInstance();
    const orderRepository = databaseService.getOrderRepository();

    const deleted = await orderRepository.delete(id);

    if (!deleted) {
      throw createError('Order not found', 404);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Order deleted successfully',
      data: null,
    };

    logger.info(`Deleted order: ${id}`);
    res.json(response);
  } catch (error) {
    logger.error(`Failed to delete order ${id}`, error);
    if ((error as any).statusCode === 404) {
      throw error;
    }
    throw createError('Failed to delete order', 500);
  }
});

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    try {
      if (!status) {
        throw createError('Status is required', 400);
      }

      const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw createError('Invalid status value', 400);
      }

      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const updatedOrder = await orderRepository.updateStatus(id, status);

      if (!updatedOrder) {
        throw createError('Order not found', 404);
      }

      const orderDto = mapOrderToDto(updatedOrder);

      const response: ApiResponse<OrderDto> = {
        success: true,
        message: `Order status updated to ${status}`,
        data: orderDto,
      };

      logger.info(`Updated order ${id} status to ${status}`);
      res.json(response);
    } catch (error) {
      logger.error(`Failed to update order ${id} status`, error);
      if (
        (error as any).statusCode === 404 ||
        (error as any).statusCode === 400
      ) {
        throw error;
      }
      throw createError('Failed to update order status', 500);
    }
  }
);

export const getOrderStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { dateFrom, dateTo, customerId } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const dateFromObj = dateFrom ? new Date(dateFrom as string) : undefined;
      const dateToObj = dateTo ? new Date(dateTo as string) : undefined;

      const stats = await orderRepository.getOrderStats(dateFromObj, dateToObj);

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error) {
      logger.error('Failed to get order statistics', error);
      throw createError('Failed to get order statistics', 500);
    }
  }
);

export const bulkUpdateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderIds, status, notes } = req.body;

    try {
      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        throw createError('Order IDs array is required', 400);
      }

      if (!status) {
        throw createError('Status is required', 400);
      }

      const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw createError('Invalid status value', 400);
      }

      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const updatePromises = orderIds.map((id) =>
        orderRepository.updateStatus(id, status)
      );
      const results = await Promise.allSettled(updatePromises);

      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length;
      const failed = results.length - successful;

      const response: ApiResponse<{ successful: number; failed: number }> = {
        success: true,
        message: `Bulk update completed: ${successful} successful, ${failed} failed`,
        data: { successful, failed },
      };

      logger.info(
        `Bulk updated ${successful} orders to ${status}, ${failed} failed`
      );
      res.json(response);
    } catch (error) {
      logger.error('Failed to bulk update orders', error);
      if ((error as any).statusCode === 400) {
        throw error;
      }
      throw createError('Failed to bulk update orders', 500);
    }
  }
);
