import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';

export const updateProfile = async (req, res) => {
  const { phone, name, dateOfBirth, nationality, currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Update personal information
    user.phone = phone;
    user.name = name;
    user.dateOfBirth = dateOfBirth;
    user.nationality = nationality;

    // Change password if provided
    if (currentPassword && newPassword && confirmNewPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Mật khẩu mới không khớp' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ message: 'Thông tin cá nhân đã được cập nhật' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin cá nhân' });
  }
}; 