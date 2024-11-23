import express from 'express'
import passport from 'passport'
import { forwardAuthenticated } from '../middleware/auth.mjs'
import bcrypt from 'bcrypt'
import User from '../models/User.mjs'
import ForeignResident from '../models/ForeignResident.mjs'

const router = express.Router()

// Hiển thị trang đăng nhập, nếu chưa đăng nhập
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', { title: 'Login' })
})

// Xử lý đăng nhập
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: true
}), (req, res) => {
  req.flash('success_msg', 'Đăng nhập thành công!');
  res.redirect('/dashboard');
})

// Đăng xuất
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }
    req.flash('success_msg', 'Đã đăng xuất thành công.');
    res.redirect('/auth/login');
  });
});

// Render the registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { username, email, phone, password, confirmPassword, nationality, address } = req.body;

  if (password !== confirmPassword) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect('/auth/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role: 'user', // Default role
      nationality,
      address,
    });

    await newUser.save();
    req.flash('success_msg', 'Đăng ký tài khoản thành công!');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error registering user:', error);
    req.flash('error_msg', 'Internal Server Error');
    res.redirect('/auth/register');
  }
});

export default router
