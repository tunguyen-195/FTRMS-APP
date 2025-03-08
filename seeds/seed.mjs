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
import UserAccommodationLink from '../models/UserAccommodationLink.mjs';

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
      { username: 'admin', password: hashedPassword, role: 'admin', officer_id: 'OFFICER001', email: 'admin@example.com', phone: '0123456789', name: 'Admin User', dateOfBirth: new Date('1980-01-01'), gender: 'Male' },
      { username: 'manager', password: hashedPassword, role: 'manager', officer_id: 'OFFICER002', email: 'manager@example.com', phone: '0987654321', name: 'Manager User', dateOfBirth: new Date('1985-05-15'), gender: 'Female' },
      { username: 'user1', password: hashedPassword, role: 'user', email: 'user1@example.com', phone: '0112233445', name: 'Nguyen Van A', dateOfBirth: new Date('1990-02-20'), gender: 'Male' },
      { username: 'user2', password: hashedPassword, role: 'user', email: 'user2@example.com', phone: '0223344556', name: 'Tran Thi B', dateOfBirth: new Date('1992-03-25'), gender: 'Female' },
      { username: 'user3', password: hashedPassword, role: 'user', email: 'user3@example.com', phone: '0334455667', name: 'Le Van C', dateOfBirth: new Date('1995-04-30'), gender: 'Male' },
      { username: 'user4', password: hashedPassword, role: 'user', email: 'user4@example.com', phone: '0445566778', name: 'Pham Thi D', dateOfBirth: new Date('1993-06-15'), gender: 'Female' },
    ]);

    console.log('Users created:', users);

    // Create sample accommodations
    const accommodations = await Accommodation.insertMany([
      { name: 'Hanoi Hotel', type: 'Hotel', address: '123 Hoan Kiem, Hanoi', phone: '0241234567', representative: users[2]._id },
      { name: 'Hanoi Hostel', type: 'Hostel', address: '456 Ba Dinh, Hanoi', phone: '0247654321', representative: users[3]._id },
      { name: 'Hanoi Apartment', type: 'Apartment', address: '789 Dong Da, Hanoi', phone: '0245555555', representative: users[4]._id },
      { name: 'Hanoi Guesthouse', type: 'Guesthouse', address: '101 Tay Ho, Hanoi', phone: '0243333333', representative: users[5]._id },
    ]);

    console.log('Accommodations created:', accommodations);

    // Create user-accommodation links
    const userAccommodationLinks = await UserAccommodationLink.insertMany([
      { user: users[2]._id, accommodation: accommodations[0]._id },
      { user: users[3]._id, accommodation: accommodations[1]._id },
      { user: users[4]._id, accommodation: accommodations[2]._id },
      { user: users[5]._id, accommodation: accommodations[3]._id },
    ]);

    console.log('User-Accommodation links created:', userAccommodationLinks);

    // Create sample foreign residents
    const foreignResidents = await ForeignResident.insertMany([
      { passportNumber: 'A1234567', visaType: 'Business', visaExpiryDate: new Date('2025-01-01'), address: '123 Main St, Anytown, USA', accommodation: accommodations[0]._id, fullName: 'John Smith', dateOfBirth: new Date('1985-05-15'), nationality: 'American' },
      { passportNumber: 'B2345678', visaType: 'Tourism', visaExpiryDate: new Date('2024-05-15'), address: '456 Elm St, Toronto, Canada', accommodation: accommodations[1]._id, fullName: 'Jane Doe', dateOfBirth: new Date('1990-07-20'), nationality: 'Canadian' },
      { passportNumber: 'C3456789', visaType: 'Study', visaExpiryDate: new Date('2024-09-30'), address: '789 Oak St, London, UK', accommodation: accommodations[2]._id, fullName: 'Alice Johnson', dateOfBirth: new Date('1992-11-30'), nationality: 'British' },
      { passportNumber: 'D4567890', visaType: 'Work', visaExpiryDate: new Date('2025-12-31'), address: '101 Pine St, Sydney, Australia', accommodation: accommodations[3]._id, fullName: 'Bob Brown', dateOfBirth: new Date('1988-03-25'), nationality: 'Australian' },
    ]);

    console.log('Foreign Residents created:', foreignResidents);

    // Create sample declarations
    const declarations = await Declaration.insertMany([
      {
        user: users[2]._id,
        foreignResident: foreignResidents[0]._id,
        accommodation: accommodations[0]._id,
        check_in: new Date(),
        reason: 'Business',
        status: 'Pending',
      },
      {
        user: users[3]._id,
        foreignResident: foreignResidents[1]._id,
        accommodation: accommodations[1]._id,
        check_in: new Date(),
        reason: 'Tourism',
        status: 'Approved',
      },
      {
        user: users[4]._id,
        foreignResident: foreignResidents[2]._id,
        accommodation: accommodations[2]._id,
        check_in: new Date(),
        reason: 'Study',
        status: 'Rejected',
      },
      {
        user: users[5]._id,
        foreignResident: foreignResidents[3]._id,
        accommodation: accommodations[3]._id,
        check_in: new Date(),
        reason: 'Work',
        status: 'Pending',
      },
    ]);

    console.log('Declarations created:', declarations);

    // Create sample residences
    const residences = await Residence.insertMany([
      {
        foreignResident: foreignResidents[0]._id,
        declaration: declarations[0]._id,
        accommodation: accommodations[0]._id,
        check_in: new Date(),
        reason: 'Business',
        status: 'Pending',
      },
      {
        foreignResident: foreignResidents[1]._id,
        declaration: declarations[1]._id,
        accommodation: accommodations[1]._id,
        check_in: new Date(),
        reason: 'Tourism',
        status: 'Approved',
      },
      {
        foreignResident: foreignResidents[2]._id,
        declaration: declarations[2]._id,
        accommodation: accommodations[2]._id,
        check_in: new Date(),
        reason: 'Study',
        status: 'Rejected',
      },
      {
        foreignResident: foreignResidents[3]._id,
        declaration: declarations[3]._id,
        accommodation: accommodations[3]._id,
        check_in: new Date(),
        reason: 'Work',
        status: 'Pending',
      },
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
