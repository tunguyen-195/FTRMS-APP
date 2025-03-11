import express from 'express';
import User from '../models/User.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import { ensureAuthenticated } from '../middleware/auth.mjs';
import { updateProfile, changePassword } from '../controllers/profileController.mjs';

const router = express.Router();

// Route to handle form submission for updating user information
router.post('/update', ensureAuthenticated, updateProfile);
router.post('/change-password', ensureAuthenticated, changePassword);

router.post('/update-profile', ensureAuthenticated, async (req, res) => {
  try {
    // Update logic
    res.json({ type: 'success', message: 'Cập nhật thông tin thành công!' });
  } catch (error) {
    res.json({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật thông tin.' });
  }
});

export default router;
