import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEventModal from '../components/AddEventModal';
import { format } from 'date-fns';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to view events.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/calendar/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      setError('Could not fetch events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventAdded = () => {
    setShowModal(false);
    fetchEvents(); // Refetch events after adding a new one
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Events</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Event</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{format(new Date(event.start), 'yyyy-MM-dd')}</td>
              <td>{format(new Date(event.start), 'p')}</td>
              <td>{event.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddEventModal show={showModal} handleClose={() => setShowModal(false)} onEventAdded={handleEventAdded} />
    </div>
  );
};

export default EventList;
