import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';
import ForeignResident from '../models/ForeignResident.mjs';

export const registerUser = async (req, res) => {
  const { username, email, phone, password, confirmPassword, name, dateOfBirth, nationality, gender, passportNumber, visaType, visaExpiryDate, address } = req.body;

  if (password !== confirmPassword) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect('/register');
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/register');
    }

    user = new User({
      username,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      name,
      dateOfBirth,
      nationality,
      gender,
    });

    await user.save();

    const foreignResident = new ForeignResident({
      passportNumber,
      visaType,
      visaExpiryDate,
      address,
      user: user._id,
    });

    await foreignResident.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred during registration');
    res.redirect('/register');
  }
};
