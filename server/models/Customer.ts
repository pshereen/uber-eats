import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  role: { type: String, enum: ['customer'], default: 'customer' }, // ✅ Add this
});

export const Customer = mongoose.model('Customer', customerSchema);
