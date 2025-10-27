import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';

const router = Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      societyId,
      buildingId,
      isMonthlyPayment,
    } = req.query;

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    const result = await customerRepo.findAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      societyId: societyId as string,
      buildingId: buildingId as string,
      isMonthlyPayment:
        isMonthlyPayment === 'true'
          ? true
          : isMonthlyPayment === 'false'
            ? false
            : undefined,
    });

    res.json({
      success: true,
      data: {
        data: result.customers,
        total: result.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      },
      // pagination: {
      //   total: result.total,
      //   page: parseInt(page as string),
      //   limit: parseInt(limit as string),
      //   totalPages: Math.ceil(result.total / parseInt(limit as string)),
      // },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    const customer = await customerRepo.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const {
      societyId,
      buildingId,
      name,
      email,
      phone,
      mobileNumber,
      flatNumber,
      isMonthlyPayment,
      address,
    } = req.body;

    // Validation
    if (
      !societyId ||
      !buildingId ||
      !name ||
      !email ||
      !mobileNumber ||
      !flatNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Society ID, Building ID, name, email, mobile number, and flat number are required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    // Check if customer with same email or mobile already exists
    const existingCustomer =
      (await customerRepo.findByEmail(email)) ||
      (await customerRepo.findByMobileNumber(mobileNumber));

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email or mobile number already exists',
      });
    }

    const customer = await customerRepo.create({
      societyId,
      buildingId,
      name,
      email,
      phone,
      mobileNumber,
      flatNumber,
      isMonthlyPayment,
      address,
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customerData = req.body;

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    const customer = await customerRepo.update(req.params.id, customerData);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    const success = await customerRepo.delete(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get customer wallet
router.get('/:id/wallet', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const walletRepo = dbService.getWalletRepository();

    const wallet = await walletRepo.findByCustomerId(req.params.id);

    if (!wallet) {
      // Auto-create wallet if not exists
      const newWallet = await walletRepo.createWalletForCustomer(req.params.id);
      return res.json({
        success: true,
        data: newWallet,
      });
    }

    res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Credit money to wallet
router.post('/:id/wallet/credit', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const walletRepo = dbService.getWalletRepository();

    const result = await walletRepo.addFunds(
      req.params.id,
      amount,
      description
    );

    res.json({
      success: true,
      message: 'Funds added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding funds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add funds',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Debit money from wallet
router.post('/:id/wallet/debit', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const walletRepo = dbService.getWalletRepository();

    const result = await walletRepo.deductFunds(
      req.params.id,
      amount,
      description
    );

    res.json({
      success: true,
      message: 'Funds deducted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deducting funds:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to deduct funds',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get wallet transaction history
router.get('/:id/wallet/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const dbService = DatabaseService.getInstance();
    const walletRepo = dbService.getWalletRepository();

    const result = await walletRepo.getTransactionHistory(req.params.id, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    res.json({
      success: true,
      data: {
        data: result.transactions,
        total: result.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      },
      pagination: {},
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
