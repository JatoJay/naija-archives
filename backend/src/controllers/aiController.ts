import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { generateRAGResponse } from '../services/vertexAIService.js';
import { v4 as uuidv4 } from 'uuid';

export async function chat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { query, sessionId, branchFilter } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    let session = sessionId
      ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: { id: uuidv4() },
      });
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: query,
      },
    });

    const response = await generateRAGResponse(query, branchFilter);

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      },
    });

    res.json({
      answer: response.answer,
      sources: response.sources,
      sessionId: session.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sessionId } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
}

export async function clearChatHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sessionId } = req.params;

    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
