const express = require('express');
const router = express.Router();
const { getEvents } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.route('/events').get(protect, getEvents);

module.exports = router;
