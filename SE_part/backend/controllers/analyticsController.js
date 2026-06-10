const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get Summary Data for Main Admin Dashboard
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getAdminDashboardSummary = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeBookings = await Booking.countDocuments({ status: { $ne: 'Rejected' } });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    
    // Calculate real data for Today Operations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayCheckIns = await Booking.countDocuments({ 
      checkIn: { $gte: startOfDay, $lte: endOfDay },
      status: 'Approved' 
    });
    
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    
    // Optional: Calculate Occupancy (Assuming 20 total rooms in the villa)
    // 20 rooms * 30 days = 600 room nights/month. Simple mock based on active bookings for now:
    const occupancyRate = Math.min(Math.round((activeBookings / 20) * 100), 100) + '%';
    
    res.json({
      totalCustomers,
      activeBookings,
      pendingReviews,
      occupancyRate,
      todayOperations: [
        { task: `${todayCheckIns} check-ins scheduled today`, status: todayCheckIns > 0 ? 'Open' : 'Clear' },
        { task: `${pendingBookings} bookings awaiting approval`, status: pendingBookings > 0 ? 'Action Needed' : 'Clear' },
        { task: `${pendingReviews} reviews need AI follow-up`, status: pendingReviews > 0 ? 'Action Needed' : 'Clear' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Detailed AI Analytics Data
// @route   GET /api/analytics/ai
// @access  Private/Admin
const getAIAnalytics = async (req, res) => {
  try {
    // 1. KPI Counts
    const totalReviews = await Review.countDocuments();
    const positiveReviews = await Review.countDocuments({ sentiment: 'Positive' });
    const negativeReviews = await Review.countDocuments({ sentiment: 'Negative' });
    const satisfactionRate = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

    // 2. Sentiment Split (Pie Chart)
    const sentimentSplit = await Review.aggregate([
      { $match: { sentiment: { $in: ['Positive', 'Negative', 'Neutral'] } } },
      { $group: { _id: '$sentiment', value: { $sum: 1 } } }
    ]).then(data => data.map(item => ({ name: item._id, value: item.value })));

    // 3. Category Split (Donut Chart)
    const categorySplit = await Review.aggregate([
      { $match: { category: { $exists: true, $ne: 'Pending Analysis' } } },
      { $group: { _id: '$category', value: { $sum: 1 } } }
    ]).then(data => data.map(item => ({ name: item._id, value: item.value })));

    // 4. Cluster Ranking (Bar Chart)
    const clusterRanking = await Review.aggregate([
      { $match: { clusterMeaning: { $exists: true, $ne: 'Waiting for AI' } } },
      { $group: { _id: '$clusterMeaning', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).then(data => data.map(item => ({ name: item._id, count: item.count })));

    // 5. Monthly Trend (Line Chart)
    const monthlyTrend = await Review.aggregate([
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          complaints: { 
            $sum: { $cond: [{ $eq: ["$sentiment", "Negative"] }, 1, 0] } 
          },
          praises: { 
            $sum: { $cond: [{ $eq: ["$sentiment", "Positive"] }, 1, 0] } 
          }
        } 
      },
      { $sort: { "_id": 1 } },
      { $limit: 6 }
    ]).then(data => data.map(item => ({ month: item._id, complaints: item.complaints, praises: item.praises })));

    // 6. Top Issue Alert
    const topIssueResult = await Review.aggregate([
      { $match: { sentiment: 'Negative', clusterMeaning: { $exists: true } } },
      { $group: { _id: '$clusterMeaning', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topIssue = topIssueResult.length > 0 ? topIssueResult[0] : null;

    // 7. Recent AI Recommendations
    const recentRecommendations = await Review.find({ 
      aiRecommendation: { $exists: true, $ne: 'Analysis in progress...' },
      sentiment: 'Negative'
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name');

    res.json({
      kpis: {
        totalReviews,
        positiveReviews,
        negativeReviews,
        satisfactionRate
      },
      sentimentSplit,
      categorySplit,
      clusterRanking,
      monthlyTrend,
      topIssue,
      recentRecommendations
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboardSummary, getAIAnalytics };
