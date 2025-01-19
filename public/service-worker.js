self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install event');
    // Optionally, cache resources here
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate event');
    // Clean up old caches if necessary
  });
  
  self.addEventListener('fetch', (event) => {
    // Optionally, handle fetch requests
    console.log(`[Service Worker] Fetching: ${event.request.url}`);
  });
  