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
  const { id } = req.params; // This is the ID of the Residence
  const { status } = req.body;

  console.log('Updating declaration status for Residence ID:', id); // Log the Residence ID

  try {
    // Find the Residence by ID
    const residence = await Residence.findById(id)
      .populate('declaration'); // Populate the declaration field

    if (!residence) {
      logger.warn(`Residence not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Residence not found' });
    }

    // Now we have the residence, we can access the declaration ID
    const declarationId = residence.declaration._id; // Access the _id property directly
    console.log('Updating declaration status for Declaration ID:', declarationId); // Log the Declaration ID

    // Update the status of the declaration
    const declaration = await Declaration.findById(declarationId);

    if (!declaration) {
      logger.warn(`Declaration not found for ID: ${declarationId}`);
      return res.status(404).json({ success: false, message: 'Declaration not found' });
    }

    // Update the status of the declaration
    declaration.status = status; // Set the new status
    await declaration.save(); // Save the updated declaration

    // Update the status of the residence as well
    residence.status = status; // Set the new status for residence
    await residence.save(); // Save the updated residence

    console.log('Updated declaration status:', declaration.status); // Log the updated status

    res.json({ success: true, message: 'Status updated successfully', declaration, residence });
  } catch (error) {
    logger.error(`Error updating declaration status for Residence ID: ${id}`, error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
