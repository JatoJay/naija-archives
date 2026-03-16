import { Router } from 'express';
import { getAllBranches, getBranchBySlug, getPortalStats } from '../controllers/branchController.js';

const router = Router();

router.get('/', getAllBranches);
router.get('/stats', getPortalStats);
router.get('/:slug', getBranchBySlug);

export default router;
