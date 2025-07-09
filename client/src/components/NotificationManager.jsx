import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationManager = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSubscription = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
      setLoading(false);
    };
    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to subscribe.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        setError('VAPID public key is not configured.');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/subscribe`,
        subscription,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSubscribed(true);
    } catch (err) {
      setError('Failed to subscribe to notifications. Please ensure you have granted permission.');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading notification status...</p>;
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Push Notifications</h5>
        {isSubscribed ? (
          <p className="text-success">You are subscribed to weather alert notifications.</p>
        ) : (
          <div>
            <p>Enable push notifications to receive weather alerts directly on your device.</p>
            <button className="btn btn-primary" onClick={handleSubscribe}>
              Enable Notifications
            </button>
          </div>
        )}
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default NotificationManager;
