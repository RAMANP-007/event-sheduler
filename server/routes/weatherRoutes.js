const express = require('express');
const router = express.Router();
const { getWeather, getForecast, getWeatherAlerts } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/weather
// @desc    Get weather for a specific location and date
// @access  Private
router.get('/', protect, getWeather);

// @route   GET /api/weather/forecast
// @desc    Get 5-day weather forecast for a specific location
// @access  Private
router.get('/forecast', protect, getForecast);

// @route   GET /api/weather/alerts
// @desc    Get all upcoming events with adverse weather conditions
// @access  Private
router.get('/alerts', protect, getWeatherAlerts);

module.exports = router;