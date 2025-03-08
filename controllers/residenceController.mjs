import Declaration from '../models/Declaration.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import Unit from '../models/Unit.mjs';
import logger from '../config/logger.mjs';
import Residence from '../models/Residence.mjs';

export const getResidences = async (req, res) => {
  try {
    // Fetch all residences and populate foreignResident, declaration, and accommodation
    const residences = await Residence.find()
      .populate('foreignResident')
      .populate('declaration')
      .populate('accommodation');

    res.render('residences', { residences, user: req.user });
  } catch (error) {
    logger.error('Error fetching residences:', error);
    req.flash('error_msg', 'Error fetching residences');
    res.redirect('/dashboard');
  }
};

export const updateDeclarationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const declaration = await Declaration.findByIdAndUpdate(id, { status }, { new: true });
    if (declaration) {
      res.json({ success: true, message: 'Status updated successfully', declaration });
    } else {
      logger.warn(`Declaration not found for ID: ${id}`);
      res.status(404).json({ success: false, message: 'Declaration not found' });
    }
  } catch (error) {
    logger.error(`Error updating declaration status for ID: ${id}`, error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
