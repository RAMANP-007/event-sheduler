const { google } = require('googleapis');
const User = require('../models/User');

// @desc    Get Google Calendar events
// @route   GET /api/calendar/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    // The user object should be attached to the request by the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user || !user.accessToken) {
      return res.status(401).json({ message: 'Not authorized, no access token found for user.' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      allDay: !!event.start.date && !event.start.dateTime,
    }));

    res.json(events);

  } catch (error) {
    console.error('Error fetching Google Calendar events:', error.message);
    
    if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
      return res.status(401).json({ message: 'Authentication error. Please log in again.' });
    }
    
    res.status(500).json({ message: 'Server error while fetching calendar events.' });
  }
};