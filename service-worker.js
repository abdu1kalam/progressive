self.addEventListener("install", function (event) {
  console.log("Service Worker Installed");
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker Activated");
});

self.addEventListener("fetch", function (event) {
  console.log("Service Worker Fetch", event.request.url);
});

self.addEventListener("push", function (event) {
  const options = {
    body: event.data ? event.data.text() : "Push message no payload",
    icon: "icon.svg",
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
