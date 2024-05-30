// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.open("Lebanese-association-football-in-the-north").then((cache) => {
//       return cache.match(event.request).then((cachedResponse) => {
//         return (
//           cachedResponse ||
//           fetch(event.request).then((networkResponse) => {
//             cache.put(event.request, networkResponse.clone());
//             return networkResponse;
//           })
//         );
//       });
//     })
//   );
// });
