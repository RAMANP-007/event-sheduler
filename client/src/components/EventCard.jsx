import React from 'react';

const EventCard = ({ title, time, weather }) => {
  return (
    <div className="card event-card">
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{time} <span className="badge bg-secondary">{weather}</span></p>
      </div>
    </div>
  );
};

export default EventCard;
