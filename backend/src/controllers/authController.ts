import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new AppError('User already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'PUBLIC',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('Not authenticated', 401);
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('Not authenticated', 401);
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
}
