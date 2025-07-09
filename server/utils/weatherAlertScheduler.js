const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');
const Event = require('../models/Event');
const { sendNotification } = require('./notificationUtils');

const ADVERSE_WEATHER_KEYWORDS = ['rain', 'thunderstorm', 'snow', 'storm', 'tornado', 'hurricane'];

const fetchWeatherForEvent = async (event) => {
  if (!event.location || !event.location.coordinates) {
    return null;
  }

  const [lon, lat] = event.location.coordinates;

  const options = {
    method: 'GET',
    url: 'https://open-weather13.p.rapidapi.com/forecast/daily',
    params: { lat: lat, lon: lon, cnt: '5' }, // 5-day forecast
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error.message);
    return null;
  }
};

const checkWeatherAndSendAlerts = async () => {
  console.log('Running scheduled job: Checking weather for upcoming events...');

  const usersWithSubscriptions = await User.find({ pushSubscription: { $exists: true } });

  for (const user of usersWithSubscriptions) {
    const upcomingEvents = await Event.find({
      user: user._id,
      start: { $gte: new Date() }, // Events starting from now
    });

    for (const event of upcomingEvents) {
      const forecast = await fetchWeatherForEvent(event);
      if (!forecast || !forecast.list) continue;

      // Check each day in the forecast
      for (const day of forecast.list) {
        const weatherDescription = day.weather[0].description.toLowerCase();
        if (ADVERSE_WEATHER_KEYWORDS.some(keyword => weatherDescription.includes(keyword))) {
          const alertPayload = {
            title: `Weather Alert for ${event.title}`,
            body: `Heads up! The forecast shows ${weatherDescription} on the day of your event.`,
          };

          await sendNotification(user.pushSubscription, alertPayload);
          // Break after sending one notification per event to avoid spam
          break;
        }
      }
    }
  }
};

// Schedule the job to run once every hour
const initScheduledJobs = () => {
  cron.schedule('0 * * * *', checkWeatherAndSendAlerts);
  console.log('Weather alert scheduler initialized. Will run every hour.');
};

module.exports = { initScheduledJobs };
