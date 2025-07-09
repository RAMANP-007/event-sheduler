import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';

const EventModal = ({ show, handleClose, handleSave, handleDelete, event }) => {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setCity(event.city || '');
      setStart(event.start ? new Date(event.start) : new Date());
      setEnd(event.end ? new Date(event.end) : new Date());
    } else {
      // Reset for new event
      setTitle('');
      setCity('');
      setStart(new Date());
      setEnd(new Date());
    }
  }, [event]);

  const onSave = () => {
    if (!title || !city) {
      alert('Title and City are required.');
      return;
    }
    handleSave({ ...event, title, start, end, city });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{event && event._id ? 'Event Details' : 'Add Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Event Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city for weather forecast"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!!event?._id} // Disable city editing for existing events
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <DatePicker
              selected={start}
              onChange={(date) => setStart(date)}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <DatePicker
              selected={end}
              onChange={(date) => setEnd(date)}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </Form.Group>

          {event?.weather && (
            <Form.Group className="mb-3">
              <Form.Label>Weather Forecast</Form.Label>
              <p className="form-control-static"><strong>{event.weather}</strong></p>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={onSave}>Save</Button>
        {event?._id && (
          <Button variant="danger" onClick={handleDelete} className="ms-2">Delete</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
