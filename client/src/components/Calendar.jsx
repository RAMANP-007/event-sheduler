import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/calendar/events`, config);
        
        // Convert start/end strings to Date objects for the calendar
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch calendar events.';
        setError(errorMessage);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading Calendar...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ height: '70vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendar;
