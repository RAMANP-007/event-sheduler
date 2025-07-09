const axios = require('axios');
const Event = require('../models/Event');

// @desc    Get all events for the logged-in user
// @route   GET /api/calendar/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create an event and fetch its weather forecast
// @route   POST /api/calendar/events
// @access  Private
const createEvent = async (req, res) => {
  const { title, start, end, city, location } = req.body;

  if (!title || !start || !end || !city) {
    return res.status(400).json({ message: 'Title, start date, end date, and city are required.' });
  }

  try {
    // 1. Fetch weather forecast from OpenWeatherMap API
    const weatherOptions = {
      method: 'GET',
      url: 'https://api.openweathermap.org/data/2.5/forecast',
      params: {
        q: city,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric',
      },
    };

    let weatherDescription = 'Forecast not available';
    try {
      const weatherResponse = await axios.request(weatherOptions);
      // Find the forecast closest to the event's start date
      const eventStartTime = new Date(start).getTime();
      const forecast = weatherResponse.data.list.reduce((prev, curr) => {
        const currTime = new Date(curr.dt * 1000).getTime();
        const prevTime = new Date(prev.dt * 1000).getTime();
        return (Math.abs(currTime - eventStartTime) < Math.abs(prevTime - eventStartTime) ? curr : prev);
      });

      if (forecast) {
        weatherDescription = `${forecast.weather[0].description}, ${Math.round(forecast.main.temp)}°C`;
      } else {
        weatherDescription = 'Forecast not available for this date.';
      }
    } catch (weatherError) {
      if (weatherError.response && weatherError.response.status === 404) {
        console.error(`Could not find weather for city: ${city}`);
        weatherDescription = 'City not found.';
      } else {
        console.error('Could not fetch weather data:', weatherError.message);
      }
    }

    // 2. Create and save the new event
    const newEvent = new Event({
      location,
      title,
      start,
      end,
      city,
      weather: weatherDescription,
      user: req.user.id,
    });

    const event = await newEvent.save();
    res.status(201).json(event);

  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an event
// @route   DELETE /api/calendar/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await event.deleteOne(); // Use deleteOne() for Mongoose v6+

    res.json({ message: 'Event removed successfully' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
};
