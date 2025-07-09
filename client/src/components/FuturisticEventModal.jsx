import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api';

const FuturisticEventModal = ({ show, onHide, event, onSave, onDelete, slotInfo }) => {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [error, setError] = useState('');

  const isNewEvent = !event?._id;

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setCity(event.city || '');
      setStart(event.start ? new Date(event.start) : new Date());
      setEnd(event.end ? new Date(event.end) : new Date());
    } else if (slotInfo) {
      setTitle('');
      setCity('');
      setStart(slotInfo.start);
      setEnd(slotInfo.end);
    } else {
      setTitle('');
      setCity('');
      const now = new Date();
      setStart(now);
      setEnd(new Date(now.getTime() + 60 * 60 * 1000)); // Default to 1 hour event
    }
  }, [event, slotInfo]);

  const handleSave = async () => {
    if (!title || !city) {
      setError('Title and City are required.');
      return;
    }
    const eventData = { ...event, title, start, end, city };
    try {
      await onSave(eventData);
      onHide();
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(event._id);
      onHide();
    } catch (err) {
      setError('Failed to delete event.');
      console.error(err);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-100vh', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 120 } },
    exit: { y: '100vh', opacity: 0 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onHide}
        >
          <motion.div
            className="card-futuristic modal-content p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="fw-bold mb-4">{isNewEvent ? 'Add Event' : 'Event Details'}</h3>
            {error && <p className="text-danger">{error}</p>}
            <div className="form-group mb-3">
              <label>Event Title</label>
              <input type="text" className="form-control-futuristic" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group mb-3">
              <label>City</label>
              <input type="text" className="form-control-futuristic" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isNewEvent} />
            </div>
            <div className="form-group mb-3">
              <label>Start Time</label>
              <DatePicker selected={start} onChange={date => setStart(date)} showTimeSelect dateFormat="Pp" className="form-control-futuristic" />
            </div>
            <div className="form-group mb-3">
              <label>End Time</label>
              <DatePicker selected={end} onChange={date => setEnd(date)} showTimeSelect dateFormat="Pp" className="form-control-futuristic" />
            </div>
            {!isNewEvent && event.weather && (
              <div className="form-group mb-3">
                <label>Weather Forecast</label>
                <p><strong>{event.weather}</strong></p>
              </div>
            )}
            <div className="d-flex justify-content-end mt-4">
              {!isNewEvent && (
                <button className="btn-futuristic-danger me-2" onClick={handleDelete}>Delete</button>
              )}
              <button className="btn-futuristic" onClick={handleSave}>Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FuturisticEventModal;
