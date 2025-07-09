self.addEventListener('push', event => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // Optional: Add an icon
    badge: '/badge-72x72.png', // Optional: Add a badge
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Optional: Define what happens when the user clicks the notification
  event.waitUntil(
    clients.openWindow('/') // Opens the app's home page
  );
});
