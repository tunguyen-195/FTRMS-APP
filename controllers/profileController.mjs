import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';

export const updateProfile = async (req, res) => {
  const { email, phone, name } = req.body;

  try {
    const user = await User.findById(req.user._id);

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