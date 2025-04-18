import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  image: String,
  role: { type: String, enum: ['restaurant'], default: 'restaurant' }, // ✅ Add this
  menuItems: [MenuItemSchema],
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
