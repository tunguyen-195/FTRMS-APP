import express from 'express';
import { ensureAdminOrManager } from '../middleware/auth.mjs';
import { listUsers, addUser, editUser, deleteUser, viewUserDetails } from '../controllers/adminController.mjs';
import User from '../models/User.mjs';
import { generateReport, exportReport } from '../controllers/reportController.mjs';
import Residence from '../models/Residence.mjs';

const router = express.Router();

// List users
router.get('/users', ensureAdminOrManager, listUsers);

// View user details
router.get('/users/:id', ensureAdminOrManager, viewUserDetails);

// Add user
router.post('/users/add', ensureAdminOrManager, addUser);

// Edit user
router.post('/users/edit/:id', ensureAdminOrManager, editUser);

// Delete user
router.post('/users/delete/:id', ensureAdminOrManager, deleteUser);

// Render edit user form
router.get('/users/edit/:id', ensureAdminOrManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    res.render('admin/editUser', { user, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    req.flash('error_msg', 'Error fetching user for edit');
    res.redirect('/admin/users');
  }
});

// Reporting page
router.get('/reports', ensureAdminOrManager, generateReport);

// Route for exporting reports
router.get('/reports/export', ensureAdminOrManager, exportReport);

export default router;