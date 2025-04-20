import express, { Request, Response, NextFunction } from 'express';
import { Restaurant } from '../models/Restaurant';
import path from 'path';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import { getUploader } from '../utils/multerConfig'; 

const upload = getUploader('restaurants');

const router = express.Router();

router.post(
  '/register',
  upload.single('image'), 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, location } = req.body;
      const imagePath = req.file ? `/uploads/restaurants/${req.file.filename}` : '';
      const hashedPassword = await bcrypt.hash(password, 10);

      const existing = await Restaurant.findOne({ email });
      if (existing) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      const restaurant = new Restaurant({
        name,
        email,
        password: hashedPassword,
        location,
        image: imagePath,
      });

      await restaurant.save();

      const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'Restaurant registered successfully',
        restaurant,
        token,
        role: 'restaurant',
      });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed', details: error });
    }
  }
);

router.get(
  '/profile',
  authenticateToken,
  async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const restaurant = await Restaurant.findById(userId).select('-password');
      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }
      res.json(restaurant);
    } catch (error) {
      next(error); 
    }
  }
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find().select('-password -menuItems');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants', details: error });
  }
});

export default router;
