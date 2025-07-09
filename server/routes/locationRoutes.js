const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/locationController');

// @route   GET /api/location/reverse-geocode
// @desc    Get city and country from coordinates
// @access  Public
router.get('/reverse-geocode', reverseGeocode);

module.exports = router;
