import express from 'express';
import Declaration from '../models/Declaration.mjs';
import Unit from '../models/Unit.mjs';

const router = express.Router();

// Endpoint to get residents by nationality
router.get('/residents-by-country', async (req, res) => {
  try {
    const residents = await Declaration.aggregate([
      {
        $match: { nationality: { $ne: null } }
      },
      {
        $group: {
          _id: '$nationality',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(residents);
  } catch (error) {
    console.error('Error fetching residents by country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get wards by district code
router.get('/wards', async (req, res) => {
  const { districtCode } = req.query;
  try {
    const hanoi = await Unit.findOne({ Code: '01' }); // Assuming '01' is the code for Hà Nội
    const district = hanoi.District.find(d => d.Code === districtCode);
    const wards = district ? district.Ward : [];
    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
