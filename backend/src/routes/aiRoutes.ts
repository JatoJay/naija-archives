import { Router } from 'express';
import { chat, getChatHistory, clearChatHistory } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', chat);
router.get('/history/:sessionId', getChatHistory);
router.delete('/history/:sessionId', clearChatHistory);

export default router;
