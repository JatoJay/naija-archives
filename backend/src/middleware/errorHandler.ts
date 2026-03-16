import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err.message, {
    stack: err.stack,
    name: err.name,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({
      error: `File upload error: ${err.message}`,
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired',
    });
    return;
  }

  const statusCode = 'statusCode' in err ? (err as AppError).statusCode : 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    error: message,
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
}
