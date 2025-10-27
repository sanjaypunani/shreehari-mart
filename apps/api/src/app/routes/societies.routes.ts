import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';

const router = Router();

// Get all societies
router.get('/', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const societyRepo = dbService.getSocietyRepository();

    const societies = await societyRepo.findAll();

    res.json({
      success: true,
      data: societies,
    });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch societies',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get society by ID
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const societyRepo = dbService.getSocietyRepository();

    const society = await societyRepo.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.json({
      success: true,
      data: society,
    });
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch society',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new society
router.post('/', async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name and address are required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const societyRepo = dbService.getSocietyRepository();

    // Check if society with same name already exists
    const existingSociety = await societyRepo.findByName(name);
    if (existingSociety) {
      return res.status(400).json({
        success: false,
        message: 'Society with this name already exists',
      });
    }

    const society = await societyRepo.create({ name, address });

    res.status(201).json({
      success: true,
      message: 'Society created successfully',
      data: society,
    });
  } catch (error) {
    console.error('Error creating society:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create society',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update society
router.put('/:id', async (req, res) => {
  try {
    const { name, address } = req.body;

    const dbService = DatabaseService.getInstance();
    const societyRepo = dbService.getSocietyRepository();

    const society = await societyRepo.update(req.params.id, { name, address });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.json({
      success: true,
      message: 'Society updated successfully',
      data: society,
    });
  } catch (error) {
    console.error('Error updating society:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update society',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete society
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const societyRepo = dbService.getSocietyRepository();

    const success = await societyRepo.delete(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.json({
      success: true,
      message: 'Society deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting society:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete society',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
