const CACHE_NAME = 'training-plans-cache-v3';

// Utility function to check for disableCache=true
function hasDisableCache(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get('disableCache') === 'true';
    } catch (e) {
        // If URL parsing fails, default to not disabling cache
        return false;
    }
}

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// Activate event: Clean up old caches
// self.addEventListener('activate', (event) => {
//     const cacheWhitelist = [CACHE_NAME];
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (!cacheWhitelist.includes(cacheName)) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

function cacheFile(event) {
    return caches.match(event.request).then((cachedResponse) => {
        // Serve from cache if available, otherwise fetch from network
        return cachedResponse || fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
                // Cache the new resource dynamically
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(() => {
            // Optionally provide fallback for offline scenarios
            // Example: return caches.match('/offline.html');
        });
    })
}

function cacheWhileRevalidate(event) {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch((error) => {
                    console.error('Fetch failed:', error);
                    // Optionally, return cachedResponse if network fails
                    return cachedResponse;
                });

            // Return cached response immediately if available, else wait for network
            return cachedResponse || fetchPromise;
        });
    })
}

// Fetch event: Handle requests
self.addEventListener('fetch', (event) => {
    const requestURL = event.request.url;
    const isSameOrigin = event.request.url.startsWith(self.location.origin)
    const fileExtention = requestURL.split('.').pop();
    const type = event.request.destination;
    const isImage = type === 'image';
    const isNavigation = event.request.mode === 'navigate';
    const shouldBypassCache = hasDisableCache(requestURL);
    const isLocalhost = requestURL.includes('localhost');
    const isChromeExtension = requestURL.includes('chrome-extension://');

    if (shouldBypassCache && !isSameOrigin || isLocalhost || isChromeExtension) {
        return
    }

    const shouldCacheFile = (['js', 'css', 'html', 'jpg'].includes(fileExtention) && !isNavigation) || isImage
    if (shouldCacheFile) {
        return event.respondWith(cacheFile(event));
    }

    if (isNavigation) {
        return event.respondWith(
            cacheWhileRevalidate(event)
        );
    }
});
