import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrderStats,
  bulkUpdateOrderStatus,
} from '../controllers/orders.controller';

const router = Router();

// GET /api/orders - Get all orders with pagination
router.get('/', getAllOrders);

// GET /api/orders/stats - Get order statistics
router.get('/stats', getOrderStats);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// POST /api/orders - Create new order
router.post('/', createOrder);

// PUT /api/orders/:id - Update order
router.put('/:id', updateOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', updateOrderStatus);

// PATCH /api/orders/bulk-update - Bulk update order status
router.patch('/bulk-update', bulkUpdateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder);

export default router;
