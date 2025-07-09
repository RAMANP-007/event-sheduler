import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddEventModal = ({ show, onHide, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to add an event.');
      return;
    }

    try {
      const start = new Date(`${date}T${time}`);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/calendar/events`,
        { title, start, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onEventAdded();
    } catch (err) {
      setError('Failed to add event.');
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="eventTitle">
            <Form.Label>Event Title</Form.Label>
            <Form.Control type="text" placeholder="Enter event title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="eventDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="eventTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="eventLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventModal;
