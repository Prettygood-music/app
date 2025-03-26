/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Assets to pre-cache. These should be the static assets and app shell
const ASSETS = [
  ...build,         // JavaScript bundles and other build artifacts
  ...files          // Static files from the 'static' folder
];

// Additional URLs to cache (like app routes)
const ROUTES_TO_CACHE = [
  '/',
  '/home',
  '/search',
  '/library',
  '/login',
  '/offline',
  '/install'
];

// Function to remove old caches
const deleteOldCaches = async () => {
  const keys = await caches.keys();
  const oldKeys = keys.filter(key => key !== CACHE);
  return Promise.all(oldKeys.map(key => caches.delete(key)));
};

const sw = self as unknown as ServiceWorkerGlobalScope;

// Install event - cache static assets
sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll([...ASSETS, ...ROUTES_TO_CACHE]))
      .then(() => {
        // Force the waiting service worker to become active
        sw.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    deleteOldCaches().then(() => {
      // Take control of all clients immediately
      sw.clients.claim();
    })
  );
});

// Fetch event - serve from cache or fetch from network
sw.addEventListener('fetch', (event) => {
  // Don't cache API requests or other special URLs
  const isApiRequest = event.request.url.includes('/api/');
  const isStreamRequest = event.request.url.includes('/tracks/') && event.request.url.includes('/stream');
  
  // Skip non-GET requests
  if (event.request.method !== 'GET' || isApiRequest || isStreamRequest) {
    return;
  }

  // Network-first strategy for HTML pages (navigation requests)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, serve from cache or offline page
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/offline')
                .then(offlineResponse => {
                  return offlineResponse || new Response('Offline page not found', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            });
        })
    );
    return;
  }

  // Cache-first strategy for assets
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, go to network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache non-successful responses
            if (!networkResponse.ok) {
              return networkResponse;
            }

            // Clone the response because we need to return one and cache one
            const responseToCache = networkResponse.clone();
            
            // Store in cache asynchronously
            caches.open(CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('Cache put error:', err);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Handle failed requests
            if (event.request.destination === 'image') {
              // For image requests, return a placeholder
              return caches.match('/web-app-manifest-192x192.png')
                .then(placeholderResponse => {
                  return placeholderResponse || new Response('Image not available', {
                    status: 404,
                    statusText: 'Not Found'
                  });
                });
            }
            
            // Return a simple error response for other resource types
            return new Response('Resource unavailable while offline', {
              status: 408,
              statusText: 'Request Timeout'
            });
          });
      })
    );
});

// Background sync for queued actions when offline (e.g., like tracks, follow artists)
sw.addEventListener('sync', (event: Event) => {
  if (event.tag === 'offlineActions') {
    event.waitUntil(syncOfflineActions());
  }
});

// Handle pending offline actions from IndexedDB
const syncOfflineActions = async () => {
  // Implementation would interact with IndexedDB to get pending actions
  // and send them to the server
  console.log('Syncing offline actions');
  return Promise.resolve(); // Return a promise to satisfy TypeScript
};

// Listen for push notifications
sw.addEventListener('push', (event) => {
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch (err) {
    data = {
      title: 'New notification',
      body: event.data.text()
    };
  }
  
  const options = {
    body: data.body || 'New notification from prettygood.music',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    sw.registration.showNotification(
      data.title || 'prettygood.music', 
      options
    )
  );
});

// Handle notification clicks
sw.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    sw.clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        return sw.clients.openWindow(url);
      })
      .catch(err => {
        console.error('Error handling notification click:', err);
      })
  );
});
