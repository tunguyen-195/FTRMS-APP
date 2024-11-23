import express from 'express';
import User from '../models/User.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import { ensureAuthenticated } from '../middleware/auth.mjs';

const router = express.Router();

// Route to handle form submission for updating user information
router.post('/update', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const { passportNumber, visaType, visaExpiryDate, address } = req.body;

    // Update the ForeignResident information in the database
    const updatedResident = await ForeignResident.findOneAndUpdate(
      { user: userId },
      { passportNumber, visaType, visaExpiryDate, address },
      { new: true, upsert: true } // Create if not exists
    );

    if (updatedResident) {
      console.log('Update successful:', updatedResident);
      res.json({ success: true, user: updatedResident });
    } else {
      console.log('No matching user found for update');
      res.json({ success: false, message: 'Không tìm thấy thông tin người dùng.' });
    }
  } catch (err) {
    console.error('Error updating user details:', err);
    res.json({ success: false, message: 'Có lỗi xảy ra khi cập nhật thông tin' });
  }
});

router.post('/update-profile', ensureAuthenticated, async (req, res) => {
  try {
    // Update logic
    res.json({ type: 'success', message: 'Cập nhật thông tin thành công!' });
  } catch (error) {
    res.json({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật thông tin.' });
  }
});

export default router;
