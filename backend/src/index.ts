import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import { initializeQdrantCollection } from './config/qdrant.js';
import { initializeGCSBucket } from './config/gcs.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/authRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import translateRoutes from './routes/translateRoutes.js';

import './jobs/indexingJob.js';
import './jobs/transcriptionJob.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/translate', translateRoutes);

app.use(notFound);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDatabase();
    logger.info('Database connected');

    try {
      await initializeQdrantCollection();
      logger.info('Qdrant initialized');
    } catch (error) {
      logger.warn('Qdrant initialization failed - running in limited mode', { error });
    }

    try {
      await initializeGCSBucket();
      logger.info('GCS bucket checked');
    } catch (error) {
      logger.warn('GCS bucket check failed - running in limited mode', { error });
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();
