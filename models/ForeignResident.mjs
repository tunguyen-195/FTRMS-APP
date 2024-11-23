import mongoose from 'mongoose'

const foreignResidentSchema = new mongoose.Schema({
  passportNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  visaType: {
    type: String,
    required: true,
  },
  visaExpiryDate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('ForeignResident', foreignResidentSchema)
