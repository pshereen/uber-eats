// server/routes/menuRoutes.ts
import express from 'express';
import { getUploader } from '../utils/multerConfig';
const router = express.Router();
const MenuItem = require('../models/MenuItem');

const upload = getUploader('menuItems'); 

router.post('/add', upload.single('image'), async (req, res): Promise<void> => {
  try {
    const { title, description, price, restaurantId } = req.body;
    const imagePath = req.file ? `/uploads/menuItems/${req.file.filename}` : '';

    if (!title || !description || !price || !restaurantId) {
      res.status(400).json({ error: 'All fields including restaurantId are required' });
      return;
    }

    const newItem = new MenuItem({
      title,
      description,
      price,
      image: imagePath,
      restaurant: restaurantId,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error adding menu item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET menu by restaurant
router.get('/', async (req, res) => {
  try {
    const { restaurant } = req.query;
    const filter = restaurant ? { restaurant } : {};
    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// PUT update menu item
router.put('/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) { res.status(404).json({ error: 'Menu item not found' }); return }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE menu item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ error: 'Item not found' }); return;}
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});


export default router;
