const express = require('express');
const router = express.Router();
const { getWeather, getForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/weather
// @desc    Get weather for a specific location and date
// @access  Private
router.get('/', protect, getWeather);

// @route   GET /api/weather/forecast
// @desc    Get 5-day weather forecast for a specific location
// @access  Private
router.get('/forecast', protect, getForecast);

module.exports = router;