import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import restaurantRoutes from './routes/restaurantRoutes';
import customerRoutes from './routes/customerRoutes';
import path from 'path';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);



mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
