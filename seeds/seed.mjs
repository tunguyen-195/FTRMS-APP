import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.mjs';
import User from '../models/User.mjs';
import ForeignResident from '../models/ForeignResident.mjs';
import Accommodation from '../models/Accommodation.mjs';
import Declaration from '../models/Declaration.mjs';
import Residence from '../models/Residence.mjs';
import logger from '../config/logger.mjs';

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();

    // Hash password
    const hashedPassword = await bcrypt.hash('a', 10);

    // Create sample users
    const users = await User.insertMany([
      { username: 'admin', password: hashedPassword, role: 'admin', officer_id: 'OFFICER001', email: 'admin@example.com', phone: '0123456789', name: 'Admin User', dateOfBirth: new Date('1980-01-01'), nationality: 'Vietnamese', gender: 'Male' },
      { username: 'manager', password: hashedPassword, role: 'manager', officer_id: 'OFFICER002', email: 'manager@example.com', phone: '0987654321', name: 'Manager User', dateOfBirth: new Date('1985-05-15'), nationality: 'Vietnamese', gender: 'Female' },
      { username: 'user1', password: hashedPassword, role: 'user', email: 'user1@example.com', phone: '0112233445', name: 'John Doe', dateOfBirth: new Date('1990-02-20'), nationality: 'American', gender: 'Male' },
      { username: 'user2', password: hashedPassword, role: 'user', email: 'user2@example.com', phone: '0223344556', name: 'Jane Smith', dateOfBirth: new Date('1992-03-25'), nationality: 'Canadian', gender: 'Female' },
      { username: 'user3', password: hashedPassword, role: 'user', email: 'user3@example.com', phone: '0334455667', name: 'Charlie Brown', dateOfBirth: new Date('1995-04-30'), nationality: 'British', gender: 'Male' },
      { username: 'user4', password: hashedPassword, role: 'user', email: 'user4@example.com', phone: '0445566778', name: 'Alice Johnson', dateOfBirth: new Date('1993-06-15'), nationality: 'Australian', gender: 'Female' },
    ]);

    // Create sample foreign residents
    const foreignResidents = await ForeignResident.insertMany([
      { passportNumber: 'A1234567', visaType: 'Business', visaExpiryDate: new Date('2025-01-01'), address: '123 Main St, Anytown, USA', user: users[2]._id },
      { passportNumber: 'B2345678', visaType: 'Tourism', visaExpiryDate: new Date('2024-05-15'), address: '456 Elm St, Toronto, Canada', user: users[3]._id },
      { passportNumber: 'C3456789', visaType: 'Study', visaExpiryDate: new Date('2024-09-30'), address: '789 Oak St, London, UK', user: users[4]._id },
      { passportNumber: 'D4567890', visaType: 'Work', visaExpiryDate: new Date('2025-12-31'), address: '101 Pine St, Sydney, Australia', user: users[5]._id },
      { passportNumber: 'E5678901', visaType: 'Tourism', visaExpiryDate: new Date('2023-11-15'), address: '202 Maple St, Wellington, New Zealand', user: users[0]._id },
      { passportNumber: 'F6789012', visaType: 'Business', visaExpiryDate: new Date('2024-06-01'), address: '303 Birch St, Singapore', user: users[1]._id },
    ]);

    // Create sample accommodations
    const accommodations = await Accommodation.insertMany([
      { name: 'Hanoi Hotel', type: 'Hotel', address: '123 Hoan Kiem, Hanoi', phone: '0241234567', managing_unit: 'Unit A', representative: 'Nguyen Van A' },
      { name: 'Hanoi Hostel', type: 'Hostel', address: '456 Ba Dinh, Hanoi', phone: '0247654321', managing_unit: 'Unit B', representative: 'Tran Thi B' },
      { name: 'Hanoi Apartment', type: 'Apartment', address: '789 Dong Da, Hanoi', phone: '0245555555', managing_unit: 'Unit C', representative: 'Le Van C' },
      { name: 'Saigon Hotel', type: 'Hotel', address: '101 Nguyen Hue, Saigon', phone: '0281234567', managing_unit: 'Unit D', representative: 'Pham Van D' },
      { name: 'Saigon Hostel', type: 'Hostel', address: '202 Le Loi, Saigon', phone: '0287654321', managing_unit: 'Unit E', representative: 'Hoang Thi E' },
      { name: 'Saigon Apartment', type: 'Apartment', address: '303 Tran Hung Dao, Saigon', phone: '0285555555', managing_unit: 'Unit F', representative: 'Vu Van F' },
    ]);

    // Create sample declarations
    const declarations = await Declaration.insertMany([
      { user: users[2]._id, full_name: users[2].name, nationality: users[2].nationality, accommodation: accommodations[0].name, check_in: new Date(), reason: 'Business', status: 'Pending' },
      { user: users[3]._id, full_name: users[3].name, nationality: users[3].nationality, accommodation: accommodations[1].name, check_in: new Date(), reason: 'Tourism', status: 'Approved' },
      { user: users[4]._id, full_name: users[4].name, nationality: users[4].nationality, accommodation: accommodations[2].name, check_in: new Date(), reason: 'Study', status: 'Rejected' },
      { user: users[5]._id, full_name: users[5].name, nationality: users[5].nationality, accommodation: accommodations[3].name, check_in: new Date(), reason: 'Work', status: 'Pending' },
      { user: users[0]._id, full_name: users[0].name, nationality: users[0].nationality, accommodation: accommodations[4].name, check_in: new Date(), reason: 'Tourism', status: 'Approved' },
      { user: users[1]._id, full_name: users[1].name, nationality: users[1].nationality, accommodation: accommodations[5].name, check_in: new Date(), reason: 'Business', status: 'Pending' },
    ]);

    // Create sample residences
    const residences = await Residence.insertMany([
      { foreign_resident: foreignResidents[0]._id, accommodation: accommodations[0]._id, check_in: new Date(), reason: 'Business', managed_by: users[0].officer_id },
      { foreign_resident: foreignResidents[1]._id, accommodation: accommodations[1]._id, check_in: new Date(), reason: 'Tourism', managed_by: users[1].officer_id },
      { foreign_resident: foreignResidents[2]._id, accommodation: accommodations[2]._id, check_in: new Date(), reason: 'Study' },
      { foreign_resident: foreignResidents[3]._id, accommodation: accommodations[3]._id, check_in: new Date(), reason: 'Work', managed_by: users[2].officer_id },
      { foreign_resident: foreignResidents[4]._id, accommodation: accommodations[4]._id, check_in: new Date(), reason: 'Tourism', managed_by: users[3].officer_id },
      { foreign_resident: foreignResidents[5]._id, accommodation: accommodations[5]._id, check_in: new Date(), reason: 'Business', managed_by: users[4].officer_id },
    ]);

    logger.info('Database seeded successfully');
    process.exit();
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

// node --experimental-modules ./seeds/seed.mjs
