import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { CollectionCategory, MediaType } from '@prisma/client';

export async function getCollections(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      branch,
      category,
      page = '1',
      limit = '20',
      search,
    } = req.query as Record<string, string | undefined>;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (branch) {
      const branchRecord = await prisma.branch.findUnique({
        where: { slug: branch },
        select: { id: true },
      });
      if (branchRecord) {
        where.branchId = branchRecord.id;
      }
    }

    if (category && Object.values(CollectionCategory).includes(category as CollectionCategory)) {
      where.category = category as CollectionCategory;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          branch: {
            select: { name: true, slug: true, region: true },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.collection.count({ where }),
    ]);

    res.json({
      data: collections.map((c) => ({
        ...c,
        itemCount: c._count.items,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCollectionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        branch: true,
        items: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: { items: true },
        },
      },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const itemsByType = await prisma.archiveItem.groupBy({
      by: ['mediaType'],
      where: { collectionId: id },
      _count: true,
    });

    res.json({
      ...collection,
      itemCount: collection._count.items,
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

export async function createCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { branchId, title, description, category, startYear, endYear, thumbnailUrl } = req.body;

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    const collection = await prisma.collection.create({
      data: {
        branchId,
        title,
        description,
        category: category as CollectionCategory,
        startYear: startYear ? parseInt(startYear, 10) : null,
        endYear: endYear ? parseInt(endYear, 10) : null,
        thumbnailUrl,
      },
      include: {
        branch: {
          select: { name: true, slug: true },
        },
      },
    });

    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
}

export async function updateCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, category, startYear, endYear, thumbnailUrl } = req.body;

    const existing = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Collection not found', 404);
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        title,
        description,
        category: category as CollectionCategory | undefined,
        startYear: startYear !== undefined ? parseInt(startYear, 10) : undefined,
        endYear: endYear !== undefined ? parseInt(endYear, 10) : undefined,
        thumbnailUrl,
      },
      include: {
        branch: {
          select: { name: true, slug: true },
        },
      },
    });

    res.json(collection);
  } catch (error) {
    next(error);
  }
}

export async function deleteCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Collection not found', 404);
    }

    await prisma.collection.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getRecentItems(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const items = await prisma.archiveItem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        collection: {
          select: {
            title: true,
            branch: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    res.json(
      items.map((item) => ({
        ...item,
        tags: item.tags ? item.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }))
    );
  } catch (error) {
    next(error);
  }
}

export async function getCollectionItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { mediaType, page = '1', limit = '20' } = req.query as Record<string, string | undefined>;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { collectionId: id };

    if (mediaType && Object.values(MediaType).includes(mediaType as MediaType)) {
      where.mediaType = mediaType as MediaType;
    }

    const [items, total] = await Promise.all([
      prisma.archiveItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.archiveItem.count({ where }),
    ]);

    res.json({
      data: items.map((item) => ({
        ...item,
        tags: item.tags ? item.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const item = await prisma.archiveItem.findUnique({
      where: { id },
      include: {
        collection: {
          select: {
            title: true,
            branch: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    res.json({
      ...item,
      tags: item.tags ? item.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  } catch (error) {
    next(error);
  }
}

export async function searchItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      q,
      mediaType,
      category,
      page = '1',
      limit = '20',
    } = req.query as Record<string, string | undefined>;

    if (!q) {
      res.json({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });
      return;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { extractedText: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ],
    };

    if (mediaType && Object.values(MediaType).includes(mediaType as MediaType)) {
      where.mediaType = mediaType as MediaType;
    }

    if (category && Object.values(CollectionCategory).includes(category as CollectionCategory)) {
      where.collection = { category: category as CollectionCategory };
    }

    const [items, total] = await Promise.all([
      prisma.archiveItem.findMany({
        where,
        include: {
          collection: {
            select: {
              title: true,
              branch: {
                select: { name: true, slug: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.archiveItem.count({ where }),
    ]);

    res.json({
      data: items.map((item) => ({
        ...item,
        tags: item.tags ? item.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}
