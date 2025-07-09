const axios = require('axios');

// @desc    Get city and country from coordinates
// @route   GET /api/location/reverse-geocode?lat=<LAT>&lon=<LON>
// @access  Public
exports.reverseGeocode = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const options = {
      method: 'GET',
      url: 'http://api.openweathermap.org/geo/1.0/reverse',
      params: {
        lat,
        lon,
        limit: 1,
        appid: process.env.OPENWEATHERMAP_API_KEY,
      },
    };

    const response = await axios.request(options);
    const locationData = response.data[0];

    if (!locationData) {
      return res.status(404).json({ message: 'Could not find location data for the provided coordinates.' });
    }

    res.json({
      city: locationData.name,
      country: locationData.country,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });

  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    res.status(500).json({ message: 'Failed to perform reverse geocoding.' });
  }
};
