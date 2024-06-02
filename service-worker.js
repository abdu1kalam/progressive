const version = 6;
const preCacheName = `static-${version}`;
const preCache = ["/", "/index.html", "/404.html"];

self.addEventListener("install", function (ev) {
  ev.waitUntil(
    caches
      .open(preCacheName)
      .then((cache) => {
        console.log("caching the static files");
        cache.addAll(preCache);
      })
      .catch(console.warn)
  );
  console.log("Service Worker Installed");
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== preCacheName)
            .map((key) => caches.delete(key))
        );
      })
      .catch(console.warn)
  );
  console.log("Service Worker Activated");
});

self.addEventListener("fetch", function (ev) {
  console.log("Service Worker Fetch", ev.request.url);

  ev.respondWith(
    caches.match(ev.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(ev.request).then(
          (response) => {
            return response;
          },
          (err) => {
            //network failure
            //send something else from the cache?
            if (
              ev.request.url.indexOf(".html") > -1 ||
              ev.request.mode == "navigation"
            ) {
              return caches.match("/404.html");
            }
          }
        )
      );
    })
  );
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

self.addEventListener("message", (ev) => {
  let data = ev.data;
  console.log("SW received", data);
});

const sendMessage = async (msg) => {
  let allClients = await clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map((client) => {
      let channel = new MessageChannel();
      return client.postMessage(msg);
    })
  );
};
