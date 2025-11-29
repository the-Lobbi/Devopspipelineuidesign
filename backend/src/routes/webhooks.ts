import { Router, Request, Response } from 'express';
import { N8nWorkflowService } from '../services/n8nWorkflowService';
import logger from '../utils/logger';
import { wss } from '../server';

const router = Router();
const n8nService = new N8nWorkflowService();

// Jira webhook handler
router.post('/jira', async (req: Request, res: Response) => {
  try {
    const { webhookEvent, issue } = req.body;

    logger.info('Received Jira webhook', { 
      event: webhookEvent, 
      issueKey: issue?.key 
    });

    // Check if epic has 'agentic-ready' label
    if (issue?.fields?.labels?.includes('agentic-ready') && issue.fields.issuetype.name === 'Epic') {
      // Trigger n8n epic intake workflow
      await n8nService.triggerEpicIntake({
        epicKey: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        labels: issue.fields.labels
      });

      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'epic_intake',
            data: {
              epicKey: issue.key,
              status: 'processing'
            }
          }));
        }
      });
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    logger.error('Error processing Jira webhook', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// GitHub webhook handler
router.post('/github', async (req: Request, res: Response) => {
  try {
    const event = req.headers['x-github-event'];
    const { action, pull_request, review, comment } = req.body;

    logger.info('Received GitHub webhook', { 
      event, 
      action,
      prNumber: pull_request?.number 
    });

    // Handle PR review comments
    if (event === 'pull_request_review' || event === 'pull_request_review_comment') {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'pr_review_feedback',
            data: {
              prNumber: pull_request?.number,
              repository: pull_request?.base?.repo?.full_name,
              action,
              comment: comment?.body || review?.body
            }
          }));
        }
      });
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    logger.error('Error processing GitHub webhook', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// n8n webhook handler (for workflow status updates)
router.post('/n8n', async (req: Request, res: Response) => {
  try {
    const { workflowId, executionId, status, data } = req.body;

    logger.info('Received n8n webhook', { 
      workflowId, 
      executionId, 
      status 
    });

    // Broadcast workflow status to WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'workflow_status',
          data: {
            workflowId,
            executionId,
            status,
            ...data
          }
        }));
      }
    });

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    logger.error('Error processing n8n webhook', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

export default router;
