import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import restaurantRoutes from './routes/restaurantRoutes';
import customerRoutes from './routes/customerRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/ordersRoutes';
import authRoutes from './routes/authRoutes';
import type { CorsOptions } from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());


// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Default root route 
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});