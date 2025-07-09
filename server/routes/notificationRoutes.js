const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/notifications/subscribe
// @desc    Subscribe user to push notifications
// @access  Private
router.post('/subscribe', protect, subscribe);

module.exports = router;
