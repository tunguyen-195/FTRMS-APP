import mongoose from 'mongoose';

const someSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this matches the name of the User model
    required: true,
  },
  // Other fields...
});

export default mongoose.model('SomeModel', someSchema); 