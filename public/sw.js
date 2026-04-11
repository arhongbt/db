// Service Worker for Sista Resan PWA
const CACHE_NAME = 'sistaresan-v2';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/uppgifter',
  '/delagare',
  '/dokument',
  '/fullmakt',
  '/kallelse',
  '/avsluta-konton',
  '/arvskifte',
  '/kostnader',
  '/tidslinje',
  '/nodbroms',
  '/faq',
  '/bodelning',
  '/dodsboanmalan',
  '/losore',
  '/konflikt',
  '/ordlista',
  '/internationellt',
  '/foretag-i-dodsbo',
  '/juridisk-hjalp',
  '/bouppteckning',
  '/tillgangar',
  '/forsakringar',
  '/arvskalkylator',
  '/skanner',
  '/exportera',
  '/bank-guide',
  '/delagare-portal',
  '/paminelser',
  '/installningar',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install — cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Fetch — network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests and Supabase API calls
  if (request.method !== 'GET') return;
  if (request.url.includes('supabase.co')) return;
  if (request.url.includes('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return the cached home page
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
