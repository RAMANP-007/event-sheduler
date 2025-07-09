import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Placeholder data to match the design
const eventDetails = {
  title: 'Outdoor Concert',
  dateTime: 'Saturday, July 20, 2024 ⋅ 7:00 PM - 10:00 PM',
  location: 'Central Park',
  address: 'New York, NY',
  mapImage: 'https://images.unsplash.com/photo-1588464254229-431de13c359d?q=80&w=2000&auto=format&fit=crop',
};

const weatherForecast = {
  dateTime: 'Saturday, July 20, 2024 ⋅ 7:00 PM',
  condition: 'Partly Cloudy',
  temp: 25,
  precipitation: 10,
  wind: 15,
  weatherImage: 'https://images.unsplash.com/photo-1590077933128-c641435b4751?q=80&w=2000&auto=format&fit=crop',
};

const EventDetailPage = () => {
  return (
    <div className="container-fluid">
      {/* Event Title */}
      <div className="mb-4">
        <h1 className="fw-bold display-5">{eventDetails.title}</h1>
        <p className="text-muted-light fs-5">{eventDetails.dateTime}</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Location Section */}
          <div className="mb-5">
            <h4 className="fw-semibold mb-3">Location</h4>
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt-fill fs-4 me-3 text-muted-light"></i>
              <div>
                <p className="mb-0 fw-medium">{eventDetails.location}</p>
                <p className="mb-0 text-muted-light">{eventDetails.address}</p>
              </div>
            </div>
          </div>

          {/* Map Image */}
          <div className="mb-5">
            <img 
              src={eventDetails.mapImage} 
              alt="Event location map" 
              className="img-fluid rounded-3"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Weather Forecast Section */}
          <h4 className="fw-semibold mb-3">Weather Forecast</h4>
          <div className="custom-card p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <p className="text-muted-light mb-1">{weatherForecast.dateTime}</p>
                <p className="fs-4 fw-medium mb-1">{weatherForecast.condition}</p>
                <p className="text-muted-light mb-0">
                  Temperature: {weatherForecast.temp}°C ⋅ Precipitation: {weatherForecast.precipitation}% ⋅ Wind: {weatherForecast.wind} km/h
                </p>
              </div>
              <div className="col-md-4 mt-3 mt-md-0">
                <img 
                  src={weatherForecast.weatherImage} 
                  alt="Weather condition" 
                  className="img-fluid rounded-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
