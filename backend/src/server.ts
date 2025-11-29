import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Routes
import healthRouter from './routes/health';
import workflowsRouter from './routes/workflows';
import epicsRouter from './routes/epics';
import agentsRouter from './routes/agents';
import pullRequestsRouter from './routes/pullRequests';
import webhooksRouter from './routes/webhooks';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/workflows', workflowsRouter);
app.use('/api/epics', epicsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/pull-requests', pullRequestsRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handling
app.use(errorHandler);

// HTTP Server
const server = createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ port: Number(WS_PORT) });

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      logger.debug('WebSocket message received', { data });
      
      // Handle different message types
      switch (data.type) {
        case 'subscribe':
          // Subscribe to specific channels
          logger.info(`Client subscribed to ${data.channel}`);
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        default:
          logger.warn('Unknown WebSocket message type', { type: data.type });
      }
    } catch (error) {
      logger.error('Error parsing WebSocket message', { error });
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error', { error });
  });

  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to DevOps Pipeline WebSocket server'
  }));
});

// Export WebSocket server for broadcasting
export { wss };

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`WebSocket server running on port ${WS_PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
    wss.close(() => {
      logger.info('WebSocket server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
    wss.close(() => {
      logger.info('WebSocket server closed');
      process.exit(0);
    });
  });
});
