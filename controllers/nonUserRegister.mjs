import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';
import Accommodation from '../models/Accommodation.mjs';

export const registerUser = async (req, res) => {
  const {
    username, email, phone, password, confirmPassword, name, dateOfBirth, nationality, gender,
    accommodationName, accommodationType, accommodationAddress, accommodationPhone
  } = req.body;

  if (password !== confirmPassword) {
    req.flash('error_msg', 'Mật khẩu không khớp');
    return res.redirect('/register');
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'Email đã được đăng ký');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      name,
      dateOfBirth,
      nationality,
      gender,
    });

    await user.save();

    const accommodation = new Accommodation({
      name: accommodationName,
      type: accommodationType,
      address: accommodationAddress,
      phone: accommodationPhone,
      representative: user._id, // Link the accommodation to the user
    });

    await accommodation.save();

    req.flash('success_msg', 'Bạn đã đăng ký thành công và có thể đăng nhập');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error during registration:', err);
    req.flash('error_msg', 'Đã xảy ra lỗi trong quá trình đăng ký');
    res.redirect('/register');
  }
};
