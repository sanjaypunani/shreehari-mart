import { Router } from 'express';
import {
  getAllDeliveryPartners,
  getDeliveryPartnerById,
  createDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
} from '../controllers/delivery-partners.controller';

const router = Router();

// GET /api/delivery-partners - Get all delivery partners (query ?active=true for active only)
router.get('/', getAllDeliveryPartners);

// GET /api/delivery-partners/:id - Get delivery partner by ID
router.get('/:id', getDeliveryPartnerById);

// POST /api/delivery-partners - Create a new delivery partner
router.post('/', createDeliveryPartner);

// PUT /api/delivery-partners/:id - Update a delivery partner
router.put('/:id', updateDeliveryPartner);

// DELETE /api/delivery-partners/:id - Delete a delivery partner
router.delete('/:id', deleteDeliveryPartner);

export default router;
