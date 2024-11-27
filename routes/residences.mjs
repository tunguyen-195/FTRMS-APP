import express from 'express'
import { ensureAdminOrManager } from '../middleware/auth.mjs'
import { getResidences, updateDeclarationStatus } from '../controllers/residenceController.mjs'

const router = express.Router()

// Route for admin and manager to access the residence management page
router.get('/', ensureAdminOrManager, getResidences)

// Route to update declaration status
router.patch('/:id/status', ensureAdminOrManager, updateDeclarationStatus)

export default router
