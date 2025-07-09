const axios = require('axios');

const GEO_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_URL = `https://${RAPIDAPI_HOST}/fivedaysforcast`;

const getCoordinates = async (location) => {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        q: location,
        limit: 1,
        appid: GEO_API_KEY,
      },
    });
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw new Error('Could not find location');
  }
};

const getForecast = async (lat, lon) => {
  try {
    const options = {
      method: 'GET',
      url: WEATHER_URL,
      params: {
        latitude: lat,
        longitude: lon,
        lang: 'EN',
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    };
    const response = await axios.request(options);
    // The new API returns the forecast list directly in response.data
    // To match the old structure { list: [...] }, we wrap it.
    return { list: response.data };
  } catch (error) {
    console.error('Error fetching weather forecast:', error.response ? error.response.data : error.message);
    throw new Error('Could not fetch weather forecast');
  }
};

module.exports = { getCoordinates, getForecast };
