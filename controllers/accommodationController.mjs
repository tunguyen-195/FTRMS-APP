import Accommodation from '../models/Accommodation.mjs';
import User from '../models/User.mjs';
import Residence from '../models/Residence.mjs';

export const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .populate('representative');

    const residences = await Residence.find().populate('foreignResident');

    const accommodationOwners = {};
    residences.forEach(residence => {
      accommodationOwners[residence.accommodation] = residence.foreignResident.fullName;
    });

    res.render('accommodations', { accommodations, accommodationOwners, user: req.user });
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    req.flash('error_msg', 'Error fetching accommodations');
    res.redirect('/dashboard');
  }
};

// Controller function to render the accommodation management page
export const manageAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .populate('representative');

    const residences = await Residence.find().populate('foreignResident');

    const accommodationOwners = {};
    residences.forEach(residence => {
      accommodationOwners[residence.accommodation] = residence.foreignResident.fullName;
    });

    res.render('manageAccommodations', { accommodations, accommodationOwners, user: req.user });
  } catch (error) {
    console.error('Error fetching accommodations for management:', error);
    req.flash('error_msg', 'Error fetching accommodations');
    res.redirect('/dashboard');
  }
}; 