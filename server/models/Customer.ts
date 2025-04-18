import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  location?: string;
  role: 'customer';
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  role: { type: String, enum: ['customer'], default: 'customer' },
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);