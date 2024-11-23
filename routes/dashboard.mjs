import express from 'express'
import { ensureAdminOrManager } from '../middleware/auth.mjs' // Sử dụng middleware kiểm tra quyền

const router = express.Router()

// Route dành cho admin và manager để truy cập trang dashboard
router.get('/', ensureAdminOrManager, (req, res) => {
  res.render('dashboard', { user: req.user })
})

export default router
