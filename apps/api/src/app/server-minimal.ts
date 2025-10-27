import express from 'express';
import cors from 'cors';

const corsOptions = {
  origin: '*',
  credentials: true,
};

const requestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

const errorHandler = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('Error:', error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

export function createServer() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Mock analytics endpoints for frontend testing
  app.get('/api/analytics/orders', (req, res) => {
    res.json({
      success: true,
      data: {
        totalOrders: 150,
        totalRevenue: 45000,
        totalDiscount: 2250,
        averageOrderValue: 300,
        ordersByStatus: {
          pending: 10,
          confirmed: 25,
          delivered: 100,
          cancelled: 15,
        },
        paymentModeBreakdown: { wallet: 80, monthly: 45, cod: 25 },
        pendingOrders: 10,
      },
    });
  });

  app.get('/api/analytics/customers', (req, res) => {
    res.json({
      success: true,
      data: {
        newVsReturning: {
          newCustomers: 35,
          returningCustomers: 115,
          newCustomerPercentage: 23.3,
          returningCustomerPercentage: 76.7,
        },
        topCustomers: [
          {
            customerId: '1',
            customerName: 'Rajesh Sharma',
            totalOrders: 25,
            totalSpent: 7500,
            avgOrderValue: 300,
          },
          {
            customerId: '2',
            customerName: 'Priya Patel',
            totalOrders: 20,
            totalSpent: 6800,
            avgOrderValue: 340,
          },
          {
            customerId: '3',
            customerName: 'Amit Kumar',
            totalOrders: 18,
            totalSpent: 5400,
            avgOrderValue: 300,
          },
        ],
        retentionMetrics: {
          totalCustomers: 150,
          activeCustomers: 120,
          retentionRate: 80.0,
          repeatOrderRate: 65.5,
        },
        customersByLocation: [
          {
            societyName: 'Green Valley Society',
            customerCount: 45,
            totalOrders: 180,
            totalRevenue: 54000,
          },
          {
            societyName: 'Rose Garden Complex',
            customerCount: 32,
            totalOrders: 128,
            totalRevenue: 38400,
          },
          {
            societyName: 'Sunrise Apartments',
            customerCount: 28,
            totalOrders: 112,
            totalRevenue: 33600,
          },
        ],
      },
    });
  });

  app.get('/api/analytics/products', (req, res) => {
    res.json({
      success: true,
      data: {
        topSellingProducts: [
          {
            id: '1',
            name: 'Potato',
            totalQuantity: 500,
            totalRevenue: 20000,
            unit: 'kg',
          },
          {
            id: '2',
            name: 'Onion',
            totalQuantity: 300,
            totalRevenue: 15000,
            unit: 'kg',
          },
          {
            id: '3',
            name: 'Tomato',
            totalQuantity: 250,
            totalRevenue: 12500,
            unit: 'kg',
          },
        ],
        lowSellingProducts: [
          {
            id: '4',
            name: 'Exotic Lettuce',
            totalQuantity: 5,
            totalRevenue: 500,
            unit: 'pc',
          },
          {
            id: '5',
            name: 'Dragon Fruit',
            totalQuantity: 2,
            totalRevenue: 800,
            unit: 'pc',
          },
        ],
        revenueContribution: [
          { id: '1', name: 'Potato', revenue: 20000, percentage: 25.0 },
          { id: '2', name: 'Onion', revenue: 15000, percentage: 18.8 },
          { id: '3', name: 'Tomato', revenue: 12500, percentage: 15.6 },
        ],
      },
    });
  });

  app.get('/api/analytics/delivery-plan', (req, res) => {
    res.json({
      success: true,
      data: {
        ordersBySociety: [
          {
            societyName: 'Green Valley Society',
            buildings: [
              {
                buildingName: 'Building A',
                orders: [
                  {
                    id: '1',
                    flatNumber: 'A-101',
                    customerName: 'Rajesh Sharma',
                    orderAmount: 450,
                    paymentMethod: 'wallet',
                    deliveryDate: '2024-01-15',
                  },
                ],
              },
            ],
          },
        ],
        itemsByDeliveryDate: [
          {
            deliveryDate: '2024-01-15',
            items: [
              { productName: 'Potato', totalQuantity: 50, unit: 'kg' },
              { productName: 'Onion', totalQuantity: 30, unit: 'kg' },
            ],
          },
        ],
      },
    });
  });

  app.use(errorHandler);
  return app;
}
