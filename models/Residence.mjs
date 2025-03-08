import mongoose from 'mongoose'

const residenceSchema = new mongoose.Schema({
  foreignResident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForeignResident',
    required: true,
  },
  declaration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Declaration',
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
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
})

export default mongoose.model('Residence', residenceSchema)
