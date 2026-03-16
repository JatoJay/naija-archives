import { Router } from 'express';
import { translate, detect, getSupportedLanguages } from '../controllers/translateController.js';

const router = Router();

router.post('/', translate);
router.post('/detect', detect);
router.get('/languages', getSupportedLanguages);

export default router;
