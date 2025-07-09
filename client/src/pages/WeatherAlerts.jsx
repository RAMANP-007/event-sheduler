import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ADVERSE_WEATHER_KEYWORDS = ['rain', 'thunderstorm', 'snow', 'storm', 'tornado', 'hurricane'];

const AnimatedLoader = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="d-flex justify-content-center align-items-center p-4"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: 32, height: 32, border: '4px solid var(--header-color)', borderTopColor: 'transparent', borderRadius: '50%' }}
    />
  </motion.div>
);

const AnimatedError = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-futuristic p-3 text-warning d-flex align-items-center justify-content-center"
  >
    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
    {message}
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const WeatherAlerts = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view alerts.');
        setLoading(false);
        return;
      }

      try {
        // Corrected API endpoint
        const { data } = await axios.get(`/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const upcomingEvents = data.filter(event => new Date(event.start) >= new Date());

        const filteredEvents = upcomingEvents.filter(event =>
          event.weather && ADVERSE_WEATHER_KEYWORDS.some(keyword => event.weather.toLowerCase().includes(keyword))
        );

        setEvents(filteredEvents);
      } catch (err) {
        setError('Failed to fetch weather alerts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      setError('Failed to delete the event.');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <AnimatedLoader />;
  if (error) return <AnimatedError message={error} />;

  return (
    <motion.div 
      className="container-fluid mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="mb-4 fw-bold" variants={itemVariants}>
        <i className="bi bi-exclamation-triangle-fill text-warning me-3"></i>
        Weather Alerts
      </motion.h2>
      <AnimatePresence>
        {events.length === 0 ? (
          <motion.div variants={itemVariants}>
            <AnimatedError message="No upcoming events with adverse weather conditions found." />
          </motion.div>
        ) : (
          events.map((event) => (
            <motion.div 
              key={event._id} 
              className="card-futuristic mb-3 p-4"
              variants={itemVariants}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-semibold">{event.title}</h5>
                  <p className="text-muted mb-2">
                    {format(new Date(event.start), 'PPP')} - {event.city}
                  </p>
                  <p className="mb-0">
                    <strong className="text-danger">Alert:</strong> The forecast predicts {event.weather}.
                  </p>
                </div>
                <button className="btn-futuristic-danger" onClick={() => handleDelete(event._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherAlerts;
