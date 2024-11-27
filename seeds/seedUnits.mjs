import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from '../config/database.mjs';
import Unit from '../models/Unit.mjs';

dotenv.config();
connectDB();

// Use import.meta.url to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedFilePath = path.join(__dirname, 'mongo_data_vn_unit.json'); // Đường dẫn tới file JSON

const seedUnits = async () => {
  try {
    // Clear existing data
    await Unit.deleteMany();

    // Read data from the JSON file
    const rawData = fs.readFileSync(seedFilePath, 'utf8');
    const allProvinces = JSON.parse(rawData);

    // Insert all provinces into the database
    await Unit.insertMany(allProvinces);

    console.log('All units have been seeded successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding units:', error);
    process.exit(1);
  }
};

seedUnits();

// node --experimental-modules seeds/seedUnits.mjs