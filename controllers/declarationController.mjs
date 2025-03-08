import Declaration from '../models/Declaration.mjs';
import Accommodation from '../models/Accommodation.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import mongoose from 'mongoose';
import logger from '../config/logger.mjs';
import Residence from '../models/Residence.mjs';

export const createDeclaration = async (req, res) => {
  try {
    // Fetch the accommodation associated with the logged-in user
    const accommodation = await Accommodation.findOne({ representative: req.user._id });

    if (!accommodation) {
      req.flash('error_msg', 'No accommodation found for your account.');
      return res.redirect('/declaration/new');
    }

    // Create a new ForeignResident entry
    const foreignResident = new ForeignResident({
      fullName: req.body.fullName,
      passportNumber: req.body.passportNumber,
      visaType: req.body.visaType,
      visaExpiryDate: req.body.visaExpiryDate,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      nationality: req.body.nationality,
      accommodation: accommodation._id, // Use the accommodation's ObjectId
    });

    await foreignResident.save();

    // Create a new Declaration entry
    const newDeclaration = new Declaration({
      user: req.user._id,
      accommodation: accommodation._id, // Use the accommodation's ObjectId
      check_in: req.body.check_in,
      check_out: req.body.check_out,
      reason: req.body.reason,
      status: 'Pending',
    });

    await newDeclaration.save();

    req.flash('success_msg', 'Declaration submitted successfully.');
    res.redirect('/declaration');
  } catch (error) {
    logger.error('Error creating declaration:', error);
    req.flash('error_msg', 'An error occurred while submitting the declaration.');
    res.redirect('/declaration/new');
  }
};

// Function to render the declaration form with accommodations
export const renderDeclarationForm = async (req, res) => {
  try {
    // Fetch the accommodation associated with the logged-in user
    const accommodation = await Accommodation.findOne({ managing_unit: req.user._id });

    if (!accommodation) {
      req.flash('error_msg', 'No accommodation found for your account.');
      return res.redirect('/declarations');
    }

    console.log('Accommodation:', accommodation); // Debugging line to verify data
    res.render('declaration', { accommodations: [accommodation], user: req.user });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    req.flash('error_msg', 'Error fetching accommodation');
    res.redirect('/declarations');
  }
};

export const getDeclarations = async (req, res) => {
  try {
    const residences = await Residence.find()
      .populate('foreignResident')
      .populate('accommodation');

    // Render the view with the fetched residences
    res.render('declaration', { residences, user: req.user });
  } catch (error) {
    logger.error('Error fetching residences:', error);
    req.flash('error_msg', 'Error fetching residences');
    res.redirect('/declaration'); // Redirect to the declaration page on error
  }
}; 