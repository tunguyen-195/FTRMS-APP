import mongoose from 'mongoose'

const residenceSchema = new mongoose.Schema({
  foreign_resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForeignResident',
    required: true,
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true,
  },
  check_in: {
    type: Date,
    required: true,
  },
  check_out: {
    type: Date,
  },
  reason: {
    type: String,
    required: true,
  },
  managed_by: {
    type: String,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Residence', residenceSchema)
