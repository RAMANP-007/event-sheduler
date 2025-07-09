import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';
import EventModal from './EventModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Custom component to display event title with weather
const EventWithWeather = ({ event }) => (
  <span>
    <strong>{event.title}</strong>
    {event.weather && <em style={{ marginLeft: '10px' }}>({event.weather})</em>}
  </span>
);

const LocalCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/api/calendar/events');
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      setError('Could not fetch events. Please try again later.');
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView) => setView(newView), [setView]);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedEvent({ start, end });
    setShowModal(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  const handleSaveEvent = async (eventData) => {
    try {
      // For now, we only support creating new events as per the new logic.
      // Editing would require a different endpoint or logic.
      if (eventData._id) {
        // Logic for updating an event can be added here if needed.
        alert('Updating events is not yet supported in this version.');
        setShowModal(false);
        return;
      }

      const response = await api.post('/api/calendar/events', eventData);
      const newEvent = {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
      };
      setEvents([...events, newEvent]);
      alert('Event created successfully with weather forecast!');
    } catch (err) {
      setError('Could not save event. Please check your input and try again.');
      console.error(err);
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?._id) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/calendar/events/${selectedEvent._id}`);
        setEvents(events.filter(e => e._id !== selectedEvent._id));
        alert('Event deleted successfully!');
        setShowModal(false);
        setSelectedEvent(null);
      } catch (err) {
        setError('Could not delete event.');
        console.error(err);
      }
    }
  };

  return (
    <div style={{ height: '80vh' }}>
      {error && <p className="text-danger text-center">{error}</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleView}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{ event: EventWithWeather }} // Use custom component for events
      />
      {showModal && (
        <EventModal
          show={showModal}
          handleClose={() => { setShowModal(false); setSelectedEvent(null); }}
          handleSave={handleSaveEvent}
          handleDelete={handleDeleteEvent}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default LocalCalendar;
