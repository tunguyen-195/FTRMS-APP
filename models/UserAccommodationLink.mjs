import mongoose from 'mongoose';

const userAccommodationLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('UserAccommodationLink', userAccommodationLinkSchema);