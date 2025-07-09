const { google } = require('googleapis');

// Fetches upcoming events from the primary calendar using a user's access token
exports.getUpcomingEvents = async (accessToken) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  // Create a new OAuth2 client for the request
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const now = new Date();
  const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: oneMonthFromNow.toISOString(),
    maxResults: 50, // Get more events to display
    singleEvents: true,
    orderBy: 'startTime',
  });

  return res.data.items;
};
