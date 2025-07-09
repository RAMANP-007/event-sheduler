const webpush = require('web-push');
const User = require('../models/User');

/**
 * Sends a push notification to a user and removes the subscription if it's invalid.
 * @param {object} subscription - The user's push subscription object.
 * @param {object} payload - The notification payload (e.g., { title, body }).
 */
const sendNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log('Successfully sent notification.');
  } catch (error) {
    // 410 Gone status indicates the subscription is no longer valid.
    if (error.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid. Removing from DB.');
      // Find the user with this subscription and remove it.
      await User.findOneAndUpdate(
        { 'pushSubscription.endpoint': subscription.endpoint },
        { $unset: { pushSubscription: "" } }
      );
    } else {
      console.error('Error sending notification:', error.message);
    }
  }
};

module.exports = { sendNotification };
