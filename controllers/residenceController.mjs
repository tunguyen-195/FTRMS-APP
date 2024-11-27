import Declaration from '../models/Declaration.mjs';
import Unit from '../models/Unit.mjs';

export const getResidences = async (req, res) => {
  const { district, ward } = req.query;

  try {
    const hanoi = await Unit.findOne({ Code: '01' });
    const districts = hanoi ? hanoi.District : [];
    const selectedDistrict = districts.find(d => d.Code === district);
    const wards = selectedDistrict ? selectedDistrict.Ward : [];

    const filter = {};
    if (ward) {
      const wardName = wards.find(w => w.Code === ward)?.Name;
      if (wardName) {
        filter['accommodation'] = new RegExp(wardName, 'i');
      }
    }

    const declarations = await Declaration.find(filter)
      .populate('user');

    res.render('residences', { declarations, user: req.user, selectedDistrict: district, selectedWard: ward, districts, wards });
  } catch (error) {
    console.error('Error fetching declarations:', error);
    req.flash('error_msg', 'Error fetching declarations');
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
      console.warn(`Declaration not found for ID: ${id}`);
      res.status(404).json({ success: false, message: 'Declaration not found' });
    }
  } catch (error) {
    console.error(`Error updating declaration status for ID: ${id}`, error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
