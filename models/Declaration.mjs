import mongoose from 'mongoose';

const declarationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  accommodation: {
    type: String,
    required: true,
  },
  check_in: {
    type: Date,
    required: true,
  },
  check_out: {
    type: Date,
    required: false,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  declarationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Tạo index để tăng tốc độ truy vấn cho các trường thường xuyên tìm kiếm
declarationSchema.index({ user: 1, status: 1 });

export default mongoose.model('Declaration', declarationSchema);