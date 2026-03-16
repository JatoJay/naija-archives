import { Router } from 'express';
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getRecentItems,
  getCollectionItems,
  getItemById,
  searchItems,
} from '../controllers/collectionController.js';
import { authenticate, requireArchivist } from '../middleware/auth.js';

const router = Router();

router.get('/', getCollections);
router.get('/search', searchItems);
router.get('/recent-items', getRecentItems);
router.get('/items/:id', getItemById);
router.get('/:id', getCollectionById);
router.get('/:id/items', getCollectionItems);

router.post('/', authenticate, requireArchivist, createCollection);
router.patch('/:id', authenticate, requireArchivist, updateCollection);
router.delete('/:id', authenticate, requireArchivist, deleteCollection);

export default router;
