import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.routes';
import productsRouter from './routes/products.routes';
import customersRouter from './routes/customers.routes';
import societiesRouter from './routes/societies.routes';
import buildingsRouter from './routes/buildings.routes';
import analyticsRouter from './routes/analytics.routes';
import { DatabaseService } from '@shreehari/data-access';

// Simple CORS options
const corsOptions = {
  origin: '*',
  credentials: true,
};

// Simple request logger
const requestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Simple error handler
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

export const createServer = () => {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Database health check
  app.get('/health/database', async (req, res) => {
    try {
      const dbService = DatabaseService.getInstance();
      const healthCheck = await dbService.healthCheck();

      const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(healthCheck);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date(),
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Routes
  app.use('/api/orders', ordersRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/societies', societiesRouter);
  app.use('/api/buildings', buildingsRouter);
  app.use('/api/analytics', analyticsRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

export default createServer;
