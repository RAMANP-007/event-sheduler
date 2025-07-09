import React from 'react';

const WeatherCard = ({ day, temp, icon }) => {
  return (
    <div className="card weather-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <span>{day}</span>
        <span>{icon}</span>
        <span>{temp}</span>
      </div>
    </div>
  );
};

export default WeatherCard;
