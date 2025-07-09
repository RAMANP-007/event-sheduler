const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const webpush = require('web-push');
const { initScheduledJobs } = require('./utils/weatherAlertScheduler');

// Passport config
require('./config/passport')(passport);

// VAPID keys setup for web-push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidMailto = process.env.VAPID_MAILTO;

if (vapidPublicKey && vapidPrivateKey && vapidMailto) {
  webpush.setVapidDetails(vapidMailto, vapidPublicKey, vapidPrivateKey);
  console.log('VAPID keys configured for web-push.');
} else {
  console.warn('VAPID keys are not configured. Push notifications will not work.');
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const app = express();

// Root route for server status
app.get('/', (req, res) => {
  res.json({ message: 'Event Scheduler API is running' });
});

// --- Middleware Setup ---

// 1. CORS Configuration - MUST be first
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from the frontend
  credentials: true
}));

// 2. Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 3. Session Middleware (for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET, // Re-using JWT secret for session signing
    resave: false,
    saveUninitialized: false,
  })
);

// 4. Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// --- Routes Setup ---
app.use('/auth', require('./routes/authRoutes'));
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

console.log('Attempting to start server on port', PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize scheduled jobs
  initScheduledJobs();
});
