import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to see the weather.');
      setLoading(false);
      return;
    }

    const fetchWeatherForCoords = async (lat, lon) => {
      try {
        setError('');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/weather/forecast`,
          {
            params: { lat, lon },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForecastData(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Could not fetch weather data.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const getLocationAndFetchWeather = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported. Showing weather for a default location.');
        setLoading(true);
        fetchWeatherForCoords('40.730610', '-73.935242'); // Fallback to default location
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherForCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError(`Could not get location: ${err.message}. Showing weather for a default location.`);
          fetchWeatherForCoords('40.730610', '-73.935242'); // Fallback to default location
        }
      );
    };

    getLocationAndFetchWeather();
  }, []);

  if (loading) return <p>Loading 5-day forecast...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!forecastData || forecastData.list.length === 0) return <p>No forecast data available.</p>;

  return (
    <div className="weather-forecast-container mt-4">
      <h4>5-Day Forecast for {forecastData.city.name}</h4>
      <div className="row">
        {forecastData.list.slice(0, 5).map((day) => (
          <div key={day.dt} className="col">
            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
                </h5>
                <img 
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p className="card-text mt-3 mb-3">{day.weather[0].description}</p>
                <p className="card-text">
                  {Math.round(day.main.temp_max - 273.15)}°C / {Math.round(day.main.temp_min - 273.15)}°C
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;