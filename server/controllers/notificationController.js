const webpush = require('web-push');
const User = require('../models/User');

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
exports.subscribe = async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id; // From auth middleware

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ message: 'Subscription object is required.' });
  }

  try {
    await User.findByIdAndUpdate(userId, { pushSubscription: subscription });

    res.status(201).json({ message: 'Successfully subscribed to notifications.' });

    // Optional: Send a welcome notification
    const payload = JSON.stringify({
      title: 'Notifications Enabled',
      body: 'Great! You will now receive weather alerts for your events.',
    });

    await webpush.sendNotification(subscription, payload);

  } catch (error) {
    console.error('Error saving subscription or sending welcome notification:', error);
    res.status(500).json({ message: 'Failed to subscribe.' });
  }
};
