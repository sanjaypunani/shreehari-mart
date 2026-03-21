import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';
import { categoryUpload } from '../middleware/upload.middleware';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const categories = await categoryRepo.findAll();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const category = await categoryRepo.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new category
router.post('/', categoryUpload.single('image'), async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const { name } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Category name must not exceed 100 characters',
      });
    }

    // Uniqueness check
    const existing = await categoryRepo.findByName(trimmedName);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const categoryData: { name: string; imageUrl?: string } = {
      name: trimmedName,
    };

    if (req.file) {
      categoryData.imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const category = await categoryRepo.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update category
router.put('/:id', categoryUpload.single('image'), async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    // Existence check
    const existingCategory = await categoryRepo.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updateData: { name?: string; imageUrl?: string } = {};

    if (req.body.name !== undefined) {
      const trimmedName = req.body.name.trim();

      if (trimmedName.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Category name must not be empty',
        });
      }

      if (trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Category name must not exceed 100 characters',
        });
      }

      // Uniqueness check excluding current record
      const nameConflict = await categoryRepo.findByName(trimmedName);
      if (nameConflict && nameConflict.id !== req.params.id) {
        return res.status(409).json({
          success: false,
          message: 'A category with this name already exists',
        });
      }

      updateData.name = trimmedName;
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const category = await categoryRepo.update(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const categoryRepo = dbService.getCategoryRepository();

    const deleted = await categoryRepo.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
