import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  email: string;
  password: string;
  location?: string;
  image?: string;
  role: 'restaurant';
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  image: { type: String },
  role: { type: String, enum: ['restaurant'], default: 'restaurant' },
});

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
