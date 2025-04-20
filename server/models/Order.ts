import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem {
  menuItemId: string;
  title: string;
  price: number;
  quantity: number;
  restaurant: {
    _id: string;
    name: string;
  };
}

export interface OrderDocument extends Document {
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: [
      {
        menuItemId: { type: String, required: true },
        title: String,
        price: Number,
        quantity: Number,
        restaurant: {
          _id: String,
          name: String,
        },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<OrderDocument>('Order', OrderSchema);
