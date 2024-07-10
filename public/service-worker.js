// service-worker.js

self.addEventListener("install", (event) => {
    // console.log("Service Worker installing.");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    // console.log("Service Worker activating.");
  });
  
  self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        if (event.notification.data && event.notification.data.url) {
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        }
      })
    );
  });
  