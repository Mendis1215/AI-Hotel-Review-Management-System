const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    sentiment: {
      type: String,
    },
    category: {
      type: String,
    },
    cluster: {
      type: Number,
    },
    clusterMeaning: {
      type: String,
    },
    aiRecommendation: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
