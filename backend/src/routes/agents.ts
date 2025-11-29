import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';
import logger from '../utils/logger';

const router = Router();
const db = new DatabaseService();

// Get all agents
router.get('/', async (req: Request, res: Response) => {
  try {
    const agents = await db.getAgents();

    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    logger.error('Error fetching agents', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    });
  }
});

// Get agent by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = await db.getAgent(id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    logger.error('Error fetching agent', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent'
    });
  }
});

// Create agent
router.post('/', async (req: Request, res: Response) => {
  try {
    const agentData = req.body;
    const agent = await db.createAgent(agentData);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    logger.error('Error creating agent', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to create agent'
    });
  }
});

// Update agent
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const agent = await db.updateAgent(id, updates);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    logger.error('Error updating agent', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to update agent'
    });
  }
});

// Delete agent
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteAgent(id);

    res.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting agent', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to delete agent'
    });
  }
});

// Get agent conversation history
router.get('/:id/conversations', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const conversations = await db.getAgentConversations(id);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    logger.error('Error fetching agent conversations', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent conversations'
    });
  }
});

export default router;
