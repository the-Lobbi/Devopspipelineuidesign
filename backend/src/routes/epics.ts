import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';
import logger from '../utils/logger';

const router = Router();
const db = new DatabaseService();

// Get all epics
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, assignee, limit = 50, offset = 0 } = req.query;
    
    const epics = await db.getEpics({
      status: status as string,
      assignee: assignee as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      data: epics
    });
  } catch (error) {
    logger.error('Error fetching epics', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch epics'
    });
  }
});

// Get epic by key
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const epic = await db.getEpic(key);
    
    if (!epic) {
      return res.status(404).json({
        success: false,
        error: 'Epic not found'
      });
    }

    res.json({
      success: true,
      data: epic
    });
  } catch (error) {
    logger.error('Error fetching epic', { error, key: req.params.key });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch epic'
    });
  }
});

// Create epic
router.post('/', async (req: Request, res: Response) => {
  try {
    const epicData = req.body;
    const epic = await db.createEpic(epicData);

    res.status(201).json({
      success: true,
      data: epic
    });
  } catch (error) {
    logger.error('Error creating epic', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to create epic'
    });
  }
});

// Update epic
router.put('/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const updates = req.body;
    
    const epic = await db.updateEpic(key, updates);
    
    if (!epic) {
      return res.status(404).json({
        success: false,
        error: 'Epic not found'
      });
    }

    res.json({
      success: true,
      data: epic
    });
  } catch (error) {
    logger.error('Error updating epic', { error, key: req.params.key });
    res.status(500).json({
      success: false,
      error: 'Failed to update epic'
    });
  }
});

// Get epic activities
router.get('/:key/activities', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const activities = await db.getEpicActivities(key);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    logger.error('Error fetching epic activities', { error, key: req.params.key });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch epic activities'
    });
  }
});

export default router;
