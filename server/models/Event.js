const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  location: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  weather: {
    type: String, // e.g., 'Sunny', '15°C'
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
