import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDatabase } from '../src/config/database.js';
import { initializeQdrantCollection } from '../src/config/qdrant.js';
import { initializeGCSBucket } from '../src/config/gcs.js';
import { errorHandler, notFound } from '../src/middleware/errorHandler.js';
import { logger } from '../src/utils/logger.js';

import authRoutes from '../src/routes/authRoutes.js';
import branchRoutes from '../src/routes/branchRoutes.js';
import collectionRoutes from '../src/routes/collectionRoutes.js';
import uploadRoutes from '../src/routes/uploadRoutes.js';
import aiRoutes from '../src/routes/aiRoutes.js';
import translateRoutes from '../src/routes/translateRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
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

app.get('/', (_req, res) => {
  res.json({ message: 'Nigeria Archives API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/translate', translateRoutes);

app.use(notFound);
app.use(errorHandler);

let initialized = false;

async function initialize() {
  if (initialized) return;

  try {
    await connectDatabase();
    logger.info('Database connected');

    try {
      await initializeQdrantCollection();
      logger.info('Qdrant initialized');
    } catch (error) {
      logger.warn('Qdrant initialization failed - running in limited mode');
    }

    try {
      await initializeGCSBucket();
      logger.info('GCS bucket checked');
    } catch (error) {
      logger.warn('GCS bucket check failed - running in limited mode');
    }

    initialized = true;
  } catch (error) {
    logger.error('Failed to initialize', { error });
  }
}

initialize();

export default app;
