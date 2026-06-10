const express = require('express');
const router = express.Router();
const { getAdminDashboardSummary, getAIAnalytics } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/summary', protect, admin, getAdminDashboardSummary);
router.get('/ai', protect, admin, getAIAnalytics);

module.exports = router;
