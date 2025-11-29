import { Router, Request, Response } from 'express';
import { GitHubService } from '../services/githubService';
import logger from '../utils/logger';

const router = Router();
const githubService = new GitHubService();

// Get all pull requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const { repository, state = 'open' } = req.query;
    
    if (!repository) {
      return res.status(400).json({
        success: false,
        error: 'Repository parameter is required'
      });
    }

    const pullRequests = await githubService.getPullRequests(
      repository as string,
      state as string
    );

    res.json({
      success: true,
      data: pullRequests
    });
  } catch (error) {
    logger.error('Error fetching pull requests', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pull requests'
    });
  }
});

// Get pull request by number
router.get('/:repository/:number', async (req: Request, res: Response) => {
  try {
    const { repository, number } = req.params;
    const pullRequest = await githubService.getPullRequest(
      repository,
      Number(number)
    );

    res.json({
      success: true,
      data: pullRequest
    });
  } catch (error) {
    logger.error('Error fetching pull request', { error, params: req.params });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pull request'
    });
  }
});

// Get pull request diff
router.get('/:repository/:number/diff', async (req: Request, res: Response) => {
  try {
    const { repository, number } = req.params;
    const diff = await githubService.getPullRequestDiff(
      repository,
      Number(number)
    );

    res.json({
      success: true,
      data: diff
    });
  } catch (error) {
    logger.error('Error fetching pull request diff', { error, params: req.params });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pull request diff'
    });
  }
});

// Create pull request
router.post('/', async (req: Request, res: Response) => {
  try {
    const { repository, title, body, head, base } = req.body;

    if (!repository || !title || !head || !base) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: repository, title, head, base'
      });
    }

    const pullRequest = await githubService.createPullRequest({
      repository,
      title,
      body,
      head,
      base
    });

    res.status(201).json({
      success: true,
      data: pullRequest
    });
  } catch (error) {
    logger.error('Error creating pull request', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to create pull request'
    });
  }
});

// Add comment to pull request
router.post('/:repository/:number/comments', async (req: Request, res: Response) => {
  try {
    const { repository, number } = req.params;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'Comment body is required'
      });
    }

    const comment = await githubService.addPullRequestComment(
      repository,
      Number(number),
      body
    );

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    logger.error('Error adding pull request comment', { error, params: req.params });
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    });
  }
});

export default router;
