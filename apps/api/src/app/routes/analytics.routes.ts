import { Router } from 'express';
import {
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getDeliveryPlanAnalytics,
} from '../controllers/analytics.controller';

const router = Router();

// GET /api/analytics/orders - Get comprehensive order analytics
router.get('/orders', getOrderAnalytics);

// GET /api/analytics/customers - Get customer analytics
router.get('/customers', getCustomerAnalytics);

// GET /api/analytics/products - Get product analytics
router.get('/products', getProductAnalytics);

// GET /api/analytics/delivery-plan - Get delivery planning analytics
router.get('/delivery-plan', getDeliveryPlanAnalytics);

export default router;
