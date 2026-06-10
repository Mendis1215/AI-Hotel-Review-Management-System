const express = require('express');
const router = express.Router();
const {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  getMyReviews,
  approveReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for homepage
router.get('/approved', getApprovedReviews);

// Customer route
router.post('/', protect, submitReview);
router.get('/my', protect, getMyReviews);

// Admin routes
router.get('/all', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, approveReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
