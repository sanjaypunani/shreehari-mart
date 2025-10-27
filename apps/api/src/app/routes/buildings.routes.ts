import { Router } from 'express';
import { DatabaseService } from '@shreehari/data-access';

const router = Router();

// Get all buildings
router.get('/', async (req, res) => {
  try {
    const { societyId } = req.query;

    const dbService = DatabaseService.getInstance();
    const buildingRepo = dbService.getBuildingRepository();

    const buildings = await buildingRepo.findAll({
      societyId: societyId as string,
    });

    res.json({
      success: true,
      data: buildings,
    });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buildings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get building by ID
router.get('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const buildingRepo = dbService.getBuildingRepository();

    const building = await buildingRepo.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    res.json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch building',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new building
router.post('/', async (req, res) => {
  try {
    const { societyId, name } = req.body;

    if (!societyId || !name) {
      return res.status(400).json({
        success: false,
        message: 'Society ID and name are required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const buildingRepo = dbService.getBuildingRepository();
    const societyRepo = dbService.getSocietyRepository();

    // Verify society exists
    const society = await societyRepo.findById(societyId);
    if (!society) {
      return res.status(400).json({
        success: false,
        message: 'Society not found',
      });
    }

    const building = await buildingRepo.create({ societyId, name });

    res.status(201).json({
      success: true,
      message: 'Building created successfully',
      data: building,
    });
  } catch (error) {
    console.error('Error creating building:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create building',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update building
router.put('/:id', async (req, res) => {
  try {
    const { societyId, name } = req.body;

    const dbService = DatabaseService.getInstance();
    const buildingRepo = dbService.getBuildingRepository();

    const building = await buildingRepo.update(req.params.id, {
      societyId,
      name,
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    res.json({
      success: true,
      message: 'Building updated successfully',
      data: building,
    });
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update building',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete building
router.delete('/:id', async (req, res) => {
  try {
    const dbService = DatabaseService.getInstance();
    const buildingRepo = dbService.getBuildingRepository();

    const success = await buildingRepo.delete(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    res.json({
      success: true,
      message: 'Building deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting building:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete building',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
