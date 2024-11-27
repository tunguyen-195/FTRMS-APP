import User from '../models/User.mjs';
import bcrypt from 'bcryptjs';

// List all users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/users', { users, user: res.locals.user });
  } catch (error) {
    req.flash('error_msg', 'Error fetching users');
    res.redirect('/admin');
  }
};

// Add a new user
export const addUser = async (req, res) => {
  const { username, email, phone, password, name, dateOfBirth, nationality, gender, role } = req.body;
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error_msg', 'Username already exists. Please use a different username.');
      return res.redirect('/admin/users');
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash('error_msg', 'Email already exists. Please use a different email.');
      return res.redirect('/admin/users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, phone, password: hashedPassword, name, dateOfBirth, nationality, gender, role });
    await newUser.save();
    req.flash('success_msg', 'User added successfully');
    res.redirect('/admin/users');
  } catch (error) {
    req.flash('error_msg', 'Error adding user');
    res.redirect('/admin/users');
  }
};

// Edit an existing user
export const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, phone, name, dateOfBirth, nationality, gender, role } = req.body;
  try {
    await User.findByIdAndUpdate(id, { username, email, phone, name, dateOfBirth, nationality, gender, role });
    req.flash('success_msg', 'User updated successfully');
    res.redirect('/admin/users');
  } catch (error) {
    req.flash('error_msg', 'Error updating user');
    res.redirect('/admin/users');
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/users');
  } catch (error) {
    req.flash('error_msg', 'Error deleting user');
    res.redirect('/admin/users');
  }
};

// View user details
export const viewUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    res.render('admin/userDetails', { user });
  } catch (error) {
    req.flash('error_msg', 'Error fetching user details');
    res.redirect('/admin/users');
  }
};