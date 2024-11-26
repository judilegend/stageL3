// self.addEventListener("push", (event) => {
//   if (!event.data) return;

//   const data = event.data.json();
//   const options = {
//     body: data.body,
//     icon: data.icon || "/icons/icon-192x192.png",
//     badge: "/icons/badge-icon.png",
//     data: data.data,
//     tag: `task-${data.data.taskId}`,
//     actions: [
//       {
//         action: "open",
//         title: "Voir la tâche",
//       },
//       {
//         action: "close",
//         title: "Fermer",
//       },
//     ],
//     requireInteraction: true,
//     renotify: true,
//   };

//   event.waitUntil(self.registration.showNotification(data.title, options));
// });
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-icon.png",
    data: data.data,
    tag: `task-${data.data?.taskId || "notification"}`,
    actions: [
      { action: "open", title: "Voir la tâche" },
      { action: "close", title: "Fermer" },
    ],
    requireInteraction: true,
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Fetch error:", error);
        return new Response(JSON.stringify({ error: "Network error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
  }
});

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   if (event.action === "open" && event.notification.data?.url) {
//     event.waitUntil(clients.openWindow(event.notification.data.url));
//   }
// });
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" && event.notification.data?.url) {
    // Ouvre la fenêtre si elle existe déjà, sinon en crée une nouvelle
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          const matchingClient = windowClients.find(
            (client) => client.url === event.notification.data.url
          );

          if (matchingClient) {
            return matchingClient.focus();
          }
          return clients.openWindow(event.notification.data.url);
        })
    );
  }
});
