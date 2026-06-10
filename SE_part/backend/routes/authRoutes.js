const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
