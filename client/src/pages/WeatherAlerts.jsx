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
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlerts = async (lat, lon) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view alerts.');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/api/weather/alerts`, {
          params: { lat, lon },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(data);
      } catch (err) {
        setError('Failed to fetch weather alerts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAlerts(latitude, longitude);
        },
        (err) => {
          setError('Geolocation is required to fetch weather alerts. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

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
        {alerts.length === 0 ? (
          <motion.div variants={itemVariants}>
            <AnimatedError message="No weather alerts for your current location." />
          </motion.div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div 
              key={index} 
              className="card-futuristic mb-3 p-4"
              variants={itemVariants}
              exit={{ opacity: 0, x: -50 }}
            >
              <div>
                <h5 className="fw-semibold text-danger">{alert.event}</h5>
                <p className="text-muted mb-2">
                  From: {format(new Date(alert.start * 1000), 'PPP p')} <br/>
                  To: {format(new Date(alert.end * 1000), 'PPP p')}
                </p>
                <p className="mb-0">{alert.description}</p>
                <p className="text-muted mt-2">Source: {alert.sender_name}</p>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherAlerts;
