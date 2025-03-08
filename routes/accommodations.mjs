import express from 'express';
import { getAccommodations, manageAccommodations } from '../controllers/accommodationController.mjs';
import { ensureManagerOrAdmin} from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/', ensureManagerOrAdmin, getAccommodations);

// Route for managers to manage accommodations
router.get('/manage', ensureManagerOrAdmin, manageAccommodations);

export default router;