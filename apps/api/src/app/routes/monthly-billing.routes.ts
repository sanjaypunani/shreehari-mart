import { Router } from 'express';
import { MonthlyBillingController } from '../controllers/monthly-billing.controller';

const router = Router();
const monthlyBillingController = new MonthlyBillingController();

// GET /api/monthly-bills/summary - Must come before /:id routes
router.get('/summary', (req, res) =>
  monthlyBillingController.getMonthlyBillingSummary(req, res)
);

// POST /api/monthly-bills/bulk-generate
router.post('/bulk-generate', (req, res) =>
  monthlyBillingController.bulkGenerateBills(req, res)
);

// GET /api/monthly-bills
router.get('/', (req, res) =>
  monthlyBillingController.getMonthlyBills(req, res)
);

// GET /api/monthly-bills/:id
router.get('/:id', (req, res) =>
  monthlyBillingController.getMonthlyBillById(req, res)
);

// POST /api/monthly-bills
router.post('/', (req, res) =>
  monthlyBillingController.createMonthlyBill(req, res)
);

// POST /api/monthly-bills/:id/mark-paid
router.post('/:id/mark-paid', (req, res) =>
  monthlyBillingController.markBillAsPaid(req, res)
);

// POST /api/monthly-bills/:id/mark-sent
router.post('/:id/mark-sent', (req, res) =>
  monthlyBillingController.markBillAsSent(req, res)
);

// POST /api/monthly-bills/:id/send-email
router.post('/:id/send-email', (req, res) =>
  monthlyBillingController.sendInvoiceEmail(req, res)
);

// GET /api/monthly-bills/:id/download-invoice
router.get('/:id/download-invoice', (req, res) =>
  monthlyBillingController.downloadInvoice(req, res)
);

// GET /api/monthly-bills/:id/download/:format - New route for format-specific downloads
router.get('/:id/download/:format', (req, res) =>
  monthlyBillingController.downloadInvoice(req, res)
);

export default router;
