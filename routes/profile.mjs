import express from 'express';
import User from '../models/User.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import { ensureAuthenticated } from '../middleware/auth.mjs';
<<<<<<< HEAD
import { updateProfile, changePassword } from '../controllers/profileController.mjs';
=======
import { updateProfile } from '../controllers/profileController.mjs';
>>>>>>> 34fa14477f11ef278aac5d217f85d8331503f2ef

const router = express.Router();

// Route to handle form submission for updating user information
router.post('/update', ensureAuthenticated, updateProfile);
<<<<<<< HEAD
router.post('/change-password', ensureAuthenticated, changePassword);
=======
>>>>>>> 34fa14477f11ef278aac5d217f85d8331503f2ef

router.post('/update-profile', ensureAuthenticated, async (req, res) => {
  try {
    // Update logic
    res.json({ type: 'success', message: 'Cập nhật thông tin thành công!' });
  } catch (error) {
    res.json({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật thông tin.' });
  }
});

export default router;
