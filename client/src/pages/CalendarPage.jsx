import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../futuristic-theme.css';
import api from '../api';
import { motion } from 'framer-motion';

import FuturisticEventModal from '../components/FuturisticEventModal';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [slotInfo, setSlotInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/api/events');
      setEvents(data.map(event => ({ ...event, start: new Date(event.start), end: new Date(event.end) })));
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSlotInfo(null);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slot) => {
    setSelectedEvent(null);
    setSlotInfo(slot);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSlotInfo(null);
  };

  const handleSaveEvent = async (eventData) => {
    const isNew = !eventData._id;
    const method = isNew ? 'post' : 'put';
    const url = isNew ? '/api/events' : `/api/events/${eventData._id}`;

    try {
      await api[method](url, eventData);
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event', error);
      throw error; // Re-throw to be caught in modal
    }
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event', error);
      throw error; // Re-throw to be caught in modal
    }
  };

  return (
    <div style={{ height: '100%' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
      />
      <FuturisticEventModal
        show={isModalOpen}
        onHide={handleModalClose}
        event={selectedEvent}
        slotInfo={slotInfo}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};


export default CalendarPage;
