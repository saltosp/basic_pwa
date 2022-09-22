'use strict';
//change cache names any time any of the cached files change
const CACHE_NAME = 'cache_name_003';
const DATA_CACHE_NAME = 'data_cache_name_003';

//files to cache for offline mode
const FILES_TO_CACHE = [
    '/',
    'service-worker.js',
    'tailwind.css',
    'dexie.js',
    'vue.js',
    'index.html',
    'index-controller.js',
    'tailwind.config.js',
    'manifest.json',
    'assets/icons/icon-48x48.png',
    'assets/icons/icon-72x72.png',
    'assets/icons/icon-96x96.png',
    'assets/icons/icon-128x128.png',
    'assets/icons/icon-144x144.png',
    'assets/icons/icon-152x152.png',
    'assets/icons/icon-192x192.png',
    'assets/icons/icon-384x384.png',
    'assets/icons/icon-512x512.png'
];

self.addEventListener('install', (evt) => {
    //precache static resources for work offline
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    //remove previous cached data from disk.
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
    //window.location.replace('../index.html');
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        let url = event.request.url.indexOf(self.location.origin) !== -1 ?
            event.request.url.split(`${self.location.origin}/`)[1] :
            event.request.url;
        //If the request asks for a resource from the origin, then you should change the absolute URL to a relative URL. It will tell you whether this should be saved in the cache
        console.log(url);
        let isFileCached = FILES_TO_CACHE.indexOf(url) !== -1;

        if (isFileCached) {
            event.respondWith(
                caches.open(CACHE_NAME)
                    .then(cache => {
                        return cache.match(url)
                            .then(response => {
                                if (response) {
                                    return response;
                                }
                                throw Error('There is not response for such request', url);
                            });
                    })
                    .catch(error => {
                        return fetch(event.request);
                    })
            );
        }
    }
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
