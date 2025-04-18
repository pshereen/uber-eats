import express, { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';



const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, location } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const existing = await Customer.findOne({ email });
      if (existing) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }
  
      const customer = new Customer({ name, email, password: hashedPassword, location });
      await customer.save();
  
      const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
  
      res.status(201).json({
        message: 'Customer registered successfully',
        customer,
        token,
        role: 'customer',
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', details: error });
    }
  });
  


router.get(
  '/profile',
  authenticateToken,
  async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const customer = await Customer.findById(userId).select('-password');
      if (!customer) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }
      res.json(customer);
    } catch (error) {
      next(error); // Pass errors to global error handler if any
    }
  }
);

router.put(
  '/profile',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { name, email, location } = req.body;

      const updatedCustomer = await Customer.findByIdAndUpdate(
        userId,
        { name, email, location },
        { new: true }
      ).select('-password');

      if (!updatedCustomer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile', details: error });
    }
  }
);



export default router;