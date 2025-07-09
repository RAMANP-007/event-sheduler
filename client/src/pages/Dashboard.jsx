import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api';
import WeatherWidget from '../components/WeatherWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const EventListItem = ({ event }) => (
  <motion.div 
    className="card-futuristic mb-3 p-3 event-card"
    variants={itemVariants}
    whileHover={{ 
      y: -5, 
      scale: 1.03,
      boxShadow: '0px 8px 25px rgba(0, 255, 255, 0.2)',
      transition: { type: 'spring', stiffness: 300 }
    }}
  >
    <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1">{event.title}</h5>
      <small>{new Date(event.start).toLocaleDateString()}</small>
    </div>
    <p className="mb-1">{event.location}</p>
    <small>{new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}</small>
  </motion.div>
);

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else {
          console.error('API did not return an array of events:', response.data);
          setEvents([]);
        }
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupEventsByDate = (eventList) => {
    const groups = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    const endOfNextWeek = new Date(endOfWeek);
    endOfNextWeek.setDate(endOfWeek.getDate() + 7);

    eventList.forEach(event => {
      const eventDate = new Date(event.start);
      if (eventDate >= today && eventDate < tomorrow) {
        groups.today.push(event);
      } else if (eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
        groups.tomorrow.push(event);
      } else if (eventDate > tomorrow && eventDate <= endOfWeek) {
        groups.thisWeek.push(event);
      } else if (eventDate > endOfWeek && eventDate <= endOfNextWeek) {
        groups.nextWeek.push(event);
      } else {
        groups.later.push(event);
      }
    });

    return groups;
  };

  const groupedEvents = groupEventsByDate(events);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <WeatherWidget />
      <div className="row">
        <div className="col-12">
          <h2 className="fw-semibold mb-4">Upcoming Events</h2>

          {groupedEvents.today.length > 0 && (
            <>
              <h4 className="mb-3">Today</h4>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {groupedEvents.today.map(event => <EventListItem key={event._id} event={event} />)}
              </motion.div>
            </>
          )}

          {groupedEvents.tomorrow.length > 0 && (
            <>
              <h4 className="mb-3">Tomorrow</h4>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {groupedEvents.tomorrow.map(event => <EventListItem key={event._id} event={event} />)}
              </motion.div>
            </>
          )}

          {groupedEvents.thisWeek.length > 0 && (
            <>
              <h4 className="mb-3">This Week</h4>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {groupedEvents.thisWeek.map(event => <EventListItem key={event._id} event={event} />)}
              </motion.div>
            </>
          )}

          {groupedEvents.nextWeek.length > 0 && (
            <>
              <h4 className="mb-3">Next Week</h4>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {groupedEvents.nextWeek.map(event => <EventListItem key={event._id} event={event} />)}
              </motion.div>
            </>
          )}

          {groupedEvents.later.length > 0 && (
            <>
              <h4 className="mb-3">Later</h4>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {groupedEvents.later.map(event => <EventListItem key={event._id} event={event} />)}
              </motion.div>
            </>
          )}

          {!loading && !error && events.length === 0 && <p>No upcoming events.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
