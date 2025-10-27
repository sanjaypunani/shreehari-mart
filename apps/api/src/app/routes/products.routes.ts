import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    console.log('search query param:', search);
    const unit = req.query.unit as string;
    const isAvailable =
      req.query.isAvailable === 'true'
        ? true
        : req.query.isAvailable === 'false'
          ? false
          : undefined;

    const { products, total } = await productRepo.findAll({
      page,
      limit,
      search,
      unit,
      isAvailable,
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    const product = await productRepo.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    // Prepare product data
    const productData = {
      ...req.body,
      // Convert numeric fields from string to number
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity, 10),
    };

    // Add image URL if file was uploaded
    if (req.file) {
      productData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const product = await productRepo.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    // Prepare product data
    const productData = {
      ...req.body,
    };

    // Convert numeric fields if they exist
    if (req.body.price) {
      productData.price = parseFloat(req.body.price);
    }
    if (req.body.quantity) {
      productData.quantity = parseInt(req.body.quantity, 10);
    }
    if (req.body.isAvailable !== undefined) {
      productData.isAvailable =
        req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }

    // Add image URL if file was uploaded
    if (req.file) {
      productData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const product = await productRepo.update(req.params.id, productData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    const deleted = await productRepo.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Toggle product availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();

    const product = await productRepo.toggleAvailability(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: `Product availability toggled to ${product.isAvailable ? 'available' : 'unavailable'}`,
      data: product,
    });
  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product availability',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
