import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.mjs';
import Declaration from '../models/Declaration.mjs';
import Unit from '../models/Unit.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import User from '../models/User.mjs';
import mongoose from 'mongoose';

const router = express.Router();

// API to add a new declaration
router.post('/api/add', ensureAuthenticated, async (req, res) => {
  const { full_name, nationality, accommodation, check_in, check_out, reason } = req.body;

  try {
    const newDeclaration = new Declaration({
      user: req.user._id,
      full_name,
      nationality,
      accommodation,
      check_in,
      check_out,
      reason,
      declarationDate: new Date(),
      status: 'Pending',
    });

    await newDeclaration.save();
    res.status(201).json({ message: 'Declaration added successfully', declaration: newDeclaration });
  } catch (error) {
    console.error('Error adding declaration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to get declarations for the authenticated user
router.get('/api', ensureAuthenticated, async (req, res) => {
  try {
    const declarations = await Declaration.find({ user: req.user._id }).sort({ declarationDate: -1 });
    res.json(declarations);
  } catch (error) {
    console.error('Error fetching declarations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to display the declaration page
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log('User ID:', userId);

    // Fetch foreign resident data
    const foreignResident = await ForeignResident.findOne({ user: userId }).lean();
    // console.log('ForeignResident data:', foreignResident);

    // Attach foreignResident data to user
    const userWithForeignResident = {
      ...req.user.toObject(), // Convert Mongoose document to plain object
      foreignResident,
    };

    // Render the view with the combined user data
    res.render('declaration', { user: userWithForeignResident });
  } catch (error) {
    console.error('Error fetching foreign resident data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle new declaration form submission
router.post('/', ensureAuthenticated, async (req, res) => {
  const { full_name, nationality, accommodation, check_in, check_out, reason } = req.body;

  const newDeclaration = new Declaration({
    user: req.user._id,
    full_name,
    nationality,
    accommodation,
    check_in,
    check_out,
    reason,
    declarationDate: new Date(),
    status: 'Pending',
  });

  await newDeclaration.save();
  res.redirect('/declaration?tab=new');
});

// Add this route to fetch districts and wards
router.get('/api/units', ensureAuthenticated, async (req, res) => {
  try {
    const units = await Unit.findOne({ Code: '01' }); // Assuming '01' is the code for Hà Nội
    if (units && units.District) {
      res.json(units.District);
    } else {
      console.error('District property is not available');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update route for profile information
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

export default router;
