import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '@shreehari/data-access';

// Simple async handler
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Simple error creator
const createError = (message: string, statusCode: number = 500) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};

// Simple logger
const logger = {
  info: (message: string, ...args: any[]) =>
    console.log(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) =>
    console.error(`[ERROR] ${message}`, ...args),
};

export const getOrderAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const dateFromObj = dateFrom ? new Date(dateFrom as string) : undefined;
      const dateToObj = dateTo ? new Date(dateTo as string) : undefined;

      const stats = await orderRepository.getOrderStats(dateFromObj, dateToObj);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Failed to get order analytics', error);
      throw createError('Failed to get order analytics', 500);
    }
  }
);

export const getCustomerAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const dateFromObj = dateFrom ? new Date(dateFrom as string) : undefined;
      const dateToObj = dateTo ? new Date(dateTo as string) : undefined;

      const analytics = await orderRepository.getCustomerAnalytics(
        dateFromObj,
        dateToObj
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Failed to get customer analytics', error);
      throw createError('Failed to get customer analytics', 500);
    }
  }
);

export const getProductAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const dateFromObj = dateFrom ? new Date(dateFrom as string) : undefined;
      const dateToObj = dateTo ? new Date(dateTo as string) : undefined;

      const analytics = await orderRepository.getProductAnalytics(
        dateFromObj,
        dateToObj
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Failed to get product analytics', error);
      throw createError('Failed to get product analytics', 500);
    }
  }
);

export const getDeliveryPlanAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      const dateFromObj = dateFrom ? new Date(dateFrom as string) : undefined;
      const dateToObj = dateTo ? new Date(dateTo as string) : undefined;

      const analytics = await orderRepository.getDeliveryPlanAnalytics(
        dateFromObj,
        dateToObj
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Failed to get delivery plan analytics', error);
      throw createError('Failed to get delivery plan analytics', 500);
    }
  }
);
