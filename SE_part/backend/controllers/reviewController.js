const Review = require('../models/Review');
const { spawn } = require('child_process');
const path = require('path');

// @desc    Submit new review (Triggers Python AI)
// @route   POST /api/reviews
// @access  Private (Customer)
const submitReview = async (req, res) => {
  const { reviewText, rating } = req.body;

  if (!reviewText || !rating) {
    return res.status(400).json({ message: 'Please provide text and rating' });
  }

  try {
    // First, save the "Pending" review to MongoDB so it generates an _id
    const review = await Review.create({
      user: req.user._id,
      reviewText,
      rating,
      sentiment: 'Pending Analysis',
      category: 'Pending Analysis',
      cluster: 0,
      clusterMeaning: 'Waiting for AI',
      aiRecommendation: 'Analysis in progress...',
      isApproved: false,
    });

    // 1. Path to Python script in AIML_part
    const pythonScriptPath = path.join(__dirname, '../../../AIML_part/pipeline/review_pipeline.py');
    
    // 2. Trigger Python script and pass the review text and the MongoDB document ID as arguments
    console.log(`Triggering Python script at: ${pythonScriptPath}`);
    const pythonProcess = spawn('python', [pythonScriptPath, reviewText, review._id.toString()]);
    
    // Optional: Log Python output for debugging
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Output: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    res.status(201).json(review);
    
    // In a real scenario with modified Python, we would capture stdout here and update the Review.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved reviews
// @route   GET /api/reviews/approved
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin dashboard)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's reviews
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.isApproved = true;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitReview, getApprovedReviews, getAllReviews, getMyReviews, approveReview, deleteReview };
