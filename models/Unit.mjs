import mongoose from 'mongoose';

// Define the Ward schema
const wardSchema = new mongoose.Schema({
  Type: String,
  Code: String,
  Name: String,
  NameEn: String,
  FullName: String,
  FullNameEn: String,
  CodeName: String,
  DistrictCode: String,
  AdministrativeUnitId: Number,
});

// Define the District schemaz
const districtSchema = new mongoose.Schema({
  Type: String,
  Code: String,
  Name: String,
  NameEn: String,
  FullName: String,
  FullNameEn: String,
  CodeName: String,
  ProvinceCode: String,
  AdministrativeUnitId: Number,
  Ward: [wardSchema], // Array of Ward documents
});

// Define the Province schema
const provinceSchema = new mongoose.Schema({
  Type: String,
  Code: String,
  Name: String,
  NameEn: String,
  FullName: String,
  FullNameEn: String,
  CodeName: String,
  AdministrativeUnitId: Number,
  AdministrativeRegionId: Number,
  District: [districtSchema], // Array of District documents
});

// Create the Unit model
export default mongoose.model('Unit', provinceSchema);
