    import express from 'express';
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import { Restaurant } from '../models/Restaurant'; 
    import { Customer } from '../models/Customer'; 

    const router = express.Router();

    router.post('/login', async (req, res) => {
        try {
            const { email, password, role } = req.body;
      
            let user;

            if (role === 'customer') {
            user = await Customer.findOne({ email });
            } else {
            user = await Restaurant.findOne({ email });
            }
      
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
      
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
      
            const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET!, {
                expiresIn: '1h',
            });
        
            res.json({
                message: 'Login successful',
                token,
                user: {
                id: user._id,
                name: user.name,
                email: user.email,
                location: user.location,
                },
            });
        } catch (error) {
          res.status(500).json({ error: 'Login failed', details: error });
        }
      });
      

    export default router;
