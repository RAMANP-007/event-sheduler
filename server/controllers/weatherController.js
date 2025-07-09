const axios = require('axios');

// @desc    Get weather for a specific location and date
// @route   GET /api/weather?lat=37.81021&lon=-122.42282&date=2021-08-24
// @access  Private
exports.getWeather = async (req, res) => {
  const { lat, lon, date } = req.query;
  if (!lat || !lon || !date) {
    return res.status(400).json({ message: 'Latitude, longitude, and date parameters are required' });
  }

  const options = {
    method: 'GET',
    url: 'https://ai-weather-by-meteosource.p.rapidapi.com/time_machine',
    params: { lat, lon, date, units: 'auto' },
    headers: {
      'x-rapidapi-key': process.env.AI_WEATHER_API_KEY,
      'x-rapidapi-host': process.env.AI_WEATHER_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch weather from AI Weather API:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch weather data.' });
  }
};

// @desc    Get 5-day weather forecast
// @route   GET /api/weather/forecast?lat=<LAT>&lon=<LON>
// @access  Private
exports.getForecast = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude parameters are required' });
  }

  const options = {
    method: 'GET',
    url: 'https://open-weather13.p.rapidapi.com/fivedaysforcast',
    params: {
      latitude: lat,
      longitude: lon,
      lang: 'EN'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch 5-day forecast:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch 5-day forecast data.' });
  }
};