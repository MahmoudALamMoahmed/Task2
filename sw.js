const totalCashed = [
  "index.html",
  "css/main.css",
  "home/home.html",
  "about/about.html",
  "contact/contact.html",
  "otherpage.html",
  "css/page1.css",
  "another/another.html",
  "css/page2.css",
];
const myPages = "myPages";

self.addEventListener("install", function (event) {
  console.log("service worker");
  event.waitUntil(
    caches
      .open(myPages)
      .then((cache) => cache.addAll(totalCashed))
      .then(() => self.skipWaiting())
      .catch((err) => console.error("error in caching", err))
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (file) {
        if (file) {
          // Retrieve from cache
          console.log("found in cache");
          return file;
        }
        console.log("retrieved from server");
        return fetch(event.request);
      })
      .catch((err) => console.error("error in fetch", err))
  );
});

// Handle Notification close Event
self.addEventListener("notificationclick", function(event) {
  const action = event.action;
  const primaryKey = event.notification.data.primaryKey;
  console.log("action is " , action);
  console.log("primary key is " , primaryKey);
  if(action === "close") {
    event.notification.close();
  }
  else {
    clients.openWindow("./otherpage.html")
  }
});
