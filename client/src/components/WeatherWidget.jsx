import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnow, WiFog } from 'react-icons/wi';

const iconMap = {
  '01d': WiDaySunny,
  '01n': WiNightClear,
  '02d': WiDayCloudy,
  '02n': WiNightAltCloudy,
  '03d': WiCloud,
  '03n': WiCloud,
  '04d': WiCloudy,
  '04n': WiCloudy,
  '09d': WiShowers,
  '09n': WiShowers,
  '10d': WiRain,
  '10n': WiRain,
  '11d': WiThunderstorm,
  '11n': WiThunderstorm,
  '13d': WiSnow,
  '13n': WiSnow,
  '50d': WiFog,
  '50n': WiFog,
};

const WeatherIcon = ({ iconCode, size }) => {
  const IconComponent = iconMap[iconCode] || WiDaySunny;
  return <IconComponent size={size} color="var(--primary-glow-color)" />;
};

const AnimatedLoader = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="d-flex justify-content-center align-items-center p-4"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: 24, height: 24, border: '3px solid var(--header-color)', borderTopColor: 'transparent', borderRadius: '50%' }}
    />
  </motion.div>
);

const AnimatedError = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-futuristic p-3 text-warning d-flex align-items-center"
  >
    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
    {message}
  </motion.div>
);

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    const fetchWeatherData = (lat, lon) => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setError('Weather API key is not configured.');
        setLoading(false);
        return;
      }
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      Promise.all([axios.get(weatherUrl), axios.get(forecastUrl)])
        .then(([weatherRes, forecastRes]) => {
          setWeather(weatherRes.data);
          setCity(weatherRes.data.name);
          const dailyData = forecastRes.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
          setForecast(dailyData);
        })
        .catch(() => {
          setError('Failed to fetch weather data.');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
      () => {
        setError('Geolocation is not enabled.');
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <AnimatedLoader />;
  if (error) return <AnimatedError message={error} />;

  return (
    <motion.div 
      className="card-futuristic mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        {weather && (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-semibold">{city}</h5>
              <p className="mb-0 fs-4 fw-bold">{Math.round(weather.main.temp)}°C</p>
              <p className="text-muted text-capitalize">{weather.weather[0].description}</p>
            </div>
            <WeatherIcon iconCode={weather.weather[0].icon} size={100} />
          </div>
        )}
        <button 
          onClick={() => setShowForecast(!showForecast)}
          className="btn-futuristic mt-3 w-100"
        >
          {showForecast ? 'Hide' : 'Show'} 5-Day Forecast
        </button>
        <AnimatePresence>
          {showForecast && (
            <motion.div
              key="forecast"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 overflow-hidden"
            >
              <hr />
              <div className="d-flex justify-content-around text-center">
                {forecast.slice(0, 5).map(day => (
                  <div key={day.dt}>
                    <p className="mb-1 fw-medium">{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <WeatherIcon iconCode={day.weather[0].icon} size={50} />
                    <p className="mb-0">{Math.round(day.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;