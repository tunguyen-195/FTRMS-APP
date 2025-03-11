import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';

export const updateProfile = async (req, res) => {
<<<<<<< HEAD
  const { email, phone, name } = req.body;
=======
  const { phone, name, dateOfBirth, nationality, currentPassword, newPassword, confirmNewPassword } = req.body;
>>>>>>> 34fa14477f11ef278aac5d217f85d8331503f2ef

  try {
    const user = await User.findById(req.user._id);

<<<<<<< HEAD
    if (!user) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/profile');
    }

    user.email = email;
    user.phone = phone;
    user.name = name;
    await user.save();

    req.flash('success_msg', 'Profile updated successfully.');
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error_msg', 'An error occurred while updating the profile.');
    res.redirect('/profile');
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    req.flash('error_msg', 'New passwords do not match.');
    return res.redirect('/dashboard');
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/dashboard');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      req.flash('error_msg', 'Current password is incorrect.');
      return res.redirect('/dashboard');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    req.flash('success_msg', 'Password changed successfully.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error changing password:', error);
    req.flash('error_msg', 'An error occurred while changing the password.');
    res.redirect('/dashboard');
  }
};
=======
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
>>>>>>> 34fa14477f11ef278aac5d217f85d8331503f2ef
