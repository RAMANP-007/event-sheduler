import React, { useState } from 'react';
import axios from 'axios';

const LocationFetcher = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/location/reverse-geocode`, {
            params: { lat: latitude, lon: longitude },
          });
          setLocation(response.data);
        } catch (err) {
          setError('Could not fetch location details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(`Could not get location: ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <div className="mt-4">
      <h5>Get Current Location</h5>
      <button className="btn btn-secondary" onClick={handleFetchLocation} disabled={loading}>
        {loading ? 'Fetching...' : 'Get My Location'}
      </button>
      {error && <p className="text-danger mt-2">{error}</p>}
      {location && (
        <div className="alert alert-info mt-3">
          <pre>{JSON.stringify(location, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LocationFetcher;
