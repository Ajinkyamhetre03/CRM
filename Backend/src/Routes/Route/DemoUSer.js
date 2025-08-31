// routes/userRoutes.js
import express from 'express';
import User from '../../Models/User.js';
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
