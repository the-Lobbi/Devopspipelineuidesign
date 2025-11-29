import { Router, Request, Response } from 'express';
import { N8nWorkflowService } from '../services/n8nWorkflowService';
import logger from '../utils/logger';

const router = Router();
const n8nService = new N8nWorkflowService();

// Get all workflows
router.get('/', async (req: Request, res: Response) => {
  try {
    const workflows = await n8nService.listWorkflows();
    res.json({
      success: true,
      data: workflows
    });
  } catch (error) {
    logger.error('Error fetching workflows', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflows'
    });
  }
});

// Get workflow by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await n8nService.getWorkflow(id);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }

    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    logger.error('Error fetching workflow', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflow'
    });
  }
});

// Execute workflow
router.post('/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const execution = await n8nService.executeWorkflow(id, data);
    
    res.json({
      success: true,
      data: execution
    });
  } catch (error) {
    logger.error('Error executing workflow', { error, id: req.params.id });
    res.status(500).json({
      success: false,
      error: 'Failed to execute workflow'
    });
  }
});

// Get workflow execution status
router.get('/:id/executions/:executionId', async (req: Request, res: Response) => {
  try {
    const { id, executionId } = req.params;
    const execution = await n8nService.getExecution(executionId);
    
    if (!execution) {
      return res.status(404).json({
        success: false,
        error: 'Execution not found'
      });
    }

    res.json({
      success: true,
      data: execution
    });
  } catch (error) {
    logger.error('Error fetching execution', { error, executionId: req.params.executionId });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch execution status'
    });
  }
});

export default router;
