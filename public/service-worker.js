const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "scripts/index.js",
    "scripts/ledger.js",
    "styles/style.css"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(PRECACHE).then(cache => {
            console.log("Pre-cache applied");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Cleans up old cache files
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== PRECACHE && key !== RUNTIME) {
                    console.log("Obsolete cache removed", key);
                    return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(RUNTIME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                    cache.put(evt.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });

            }).catch(err => console.log(err))
        );

        return;
    }

    evt.respondWith(
        caches.open(PRECACHE).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});