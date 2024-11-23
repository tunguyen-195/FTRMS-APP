import mongoose from 'mongoose';
import Unit from '../models/Unit.mjs';

const seedUnits = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing units
    await Unit.deleteMany({});

    // Define districts in Hanoi with codes
    const districts = [
      { code: 'BD', name: 'Ba Đình' },
      { code: 'HK', name: 'Hoàn Kiếm' },
      { code: 'TH', name: 'Tây Hồ' },
      { code: 'LB', name: 'Long Biên' },
      { code: 'CG', name: 'Cầu Giấy' },
      { code: 'DD', name: 'Đống Đa' },
      { code: 'HBT', name: 'Hai Bà Trưng' },
      { code: 'HM', name: 'Hoàng Mai' },
      { code: 'TX', name: 'Thanh Xuân' },
      { code: 'HD', name: 'Hà Đông' },
      { code: 'NTL', name: 'Nam Từ Liêm' },
      { code: 'BTL', name: 'Bắc Từ Liêm' },
      { code: 'SS', name: 'Sóc Sơn' },
      { code: 'DA', name: 'Đông Anh' },
      { code: 'GL', name: 'Gia Lâm' },
      { code: 'TT', name: 'Thanh Trì' },
      { code: 'ML', name: 'Mê Linh' },
      { code: 'ST', name: 'Sơn Tây' },
      { code: 'BV', name: 'Ba Vì' },
      { code: 'PT', name: 'Phúc Thọ' },
      { code: 'DP', name: 'Đan Phượng' },
      { code: 'HD', name: 'Hoài Đức' },
      { code: 'QO', name: 'Quốc Oai' },
      { code: 'TT', name: 'Thạch Thất' },
      { code: 'CM', name: 'Chương Mỹ' },
      { code: 'TO', name: 'Thanh Oai' },
      { code: 'TT', name: 'Thường Tín' },
      { code: 'PX', name: 'Phú Xuyên' },
      { code: 'UH', name: 'Ứng Hòa' },
      { code: 'MD', name: 'Mỹ Đức' },
    ];

    // Seed units
    await Unit.insertMany(districts);

    console.log('Units seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding units:', error);
    mongoose.connection.close();
  }
};

seedUnits();

// node --experimental-modules seeds/seedUnits.mjs