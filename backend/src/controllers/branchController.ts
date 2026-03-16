import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAllBranches(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: { collections: true },
        },
      },
      orderBy: { established: 'asc' },
    });

    const branchesWithStats = await Promise.all(
      branches.map(async (branch) => {
        const itemCount = await prisma.archiveItem.count({
          where: {
            collection: {
              branchId: branch.id,
            },
          },
        });

        return {
          ...branch,
          collectionCount: branch._count.collections,
          itemCount,
        };
      })
    );

    res.json(branchesWithStats);
  } catch (error) {
    next(error);
  }
}

export async function getBranchBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params.slug as string;

    const branch = await prisma.branch.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { collections: true },
        },
      },
    });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    const itemCount = await prisma.archiveItem.count({
      where: {
        collection: {
          branchId: branch.id,
        },
      },
    });

    const itemsByType = await prisma.archiveItem.groupBy({
      by: ['mediaType'],
      where: {
        collection: {
          branchId: branch.id,
        },
      },
      _count: true,
    });

    res.json({
      ...branch,
      collectionCount: branch._count.collections,
      itemCount,
      itemsByType: itemsByType.reduce(
        (acc, item) => {
          acc[item.mediaType] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    next(error);
  }
}

export async function getPortalStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [branches, collections, items, itemsByType] = await Promise.all([
      prisma.branch.count(),
      prisma.collection.count(),
      prisma.archiveItem.count(),
      prisma.archiveItem.groupBy({
        by: ['mediaType'],
        _count: true,
      }),
    ]);

    const stats = {
      branches,
      collections,
      totalItems: items,
      documents: 0,
      images: 0,
      audioRecordings: 0,
      videoRecords: 0,
    };

    for (const item of itemsByType) {
      switch (item.mediaType) {
        case 'DOCUMENT':
          stats.documents = item._count;
          break;
        case 'IMAGE':
          stats.images = item._count;
          break;
        case 'AUDIO':
          stats.audioRecordings = item._count;
          break;
        case 'VIDEO':
          stats.videoRecords = item._count;
          break;
      }
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
}
