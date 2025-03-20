export async function initializeApp() {
  if (typeof window === 'undefined') return false;

  try {
    // Test du localStorage
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');

    // Nettoyage des service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // Nettoyage du cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    return true;
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);
    return false;
  }
}