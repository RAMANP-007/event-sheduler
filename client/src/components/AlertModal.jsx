import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to reschedule this event?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleClose}>
          Reschedule
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
