const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Defines routes for /api/events
router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.route('/:id')
  .delete(protect, deleteEvent);

module.exports = router;
