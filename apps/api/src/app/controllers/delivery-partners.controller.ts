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

// GET / - Get all delivery partners (optionally filter by active)
export const getAllDeliveryPartners = asyncHandler(
  async (req: Request, res: Response) => {
    const dbService = DatabaseService.getInstance();
    const repo = dbService.getDeliveryPartnerRepository();

    const partners =
      req.query.active === 'true'
        ? await repo.findActive()
        : await repo.findAll();

    res.json({
      success: true,
      data: partners,
    });
  }
);

// GET /:id - Get delivery partner by ID
export const getDeliveryPartnerById = asyncHandler(
  async (req: Request, res: Response) => {
    const dbService = DatabaseService.getInstance();
    const repo = dbService.getDeliveryPartnerRepository();

    const partner = await repo.findById(req.params.id);

    if (!partner) {
      throw createError('Delivery partner not found', 404);
    }

    res.json({
      success: true,
      data: partner,
    });
  }
);

// POST / - Create a new delivery partner
export const createDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const dbService = DatabaseService.getInstance();
    const repo = dbService.getDeliveryPartnerRepository();

    const { name, mobileNumber, isActive } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError('Name is required', 400);
    }

    // Validate mobileNumber
    if (
      !mobileNumber ||
      typeof mobileNumber !== 'string' ||
      mobileNumber.trim().length === 0
    ) {
      throw createError('Mobile number is required', 400);
    }

    const partner = await repo.create({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      isActive,
    });

    res.status(201).json({
      success: true,
      data: partner,
    });
  }
);

// PUT /:id - Update a delivery partner
export const updateDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const dbService = DatabaseService.getInstance();
    const repo = dbService.getDeliveryPartnerRepository();

    const existing = await repo.findById(req.params.id);
    if (!existing) {
      throw createError('Delivery partner not found', 404);
    }

    const updateData: {
      name?: string;
      mobileNumber?: string;
      isActive?: boolean;
    } = {};

    if (req.body.name !== undefined) {
      const trimmed = req.body.name.trim();
      if (trimmed.length === 0) {
        throw createError('Name must not be empty', 400);
      }
      updateData.name = trimmed;
    }

    if (req.body.mobileNumber !== undefined) {
      const trimmed = req.body.mobileNumber.trim();
      if (trimmed.length === 0) {
        throw createError('Mobile number must not be empty', 400);
      }
      updateData.mobileNumber = trimmed;
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive;
    }

    const partner = await repo.update(req.params.id, updateData);

    res.json({
      success: true,
      data: partner,
    });
  }
);

// DELETE /:id - Delete a delivery partner
export const deleteDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const dbService = DatabaseService.getInstance();
    const repo = dbService.getDeliveryPartnerRepository();

    const deleted = await repo.delete(req.params.id);

    if (!deleted) {
      throw createError('Delivery partner not found', 404);
    }

    res.json({
      success: true,
      message: 'Delivery partner deleted',
    });
  }
);
