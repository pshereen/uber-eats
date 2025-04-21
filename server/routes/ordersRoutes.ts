import express from 'express';
import Order from '../models/Order';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
       res.status(400).json({ error: 'Invalid order data' });
       return;
    }

    const orderData: any = {
      items,
      total,
      createdAt: new Date(),
    };

    if (userId) {
      orderData.userId = userId; 
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


// Get all orders for a customer
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
     res.status(400).json({ error: 'userId is required' });
     return;
  }

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get orders placed at a specific restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const orders = await Order.find({
      'items.restaurant._id': restaurantId,
    });

    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch restaurant orders:', err);
    res.status(500).json({ error: 'Failed to fetch restaurant orders' });
  }
});


export default router;
