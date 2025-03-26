import { browser } from '$app/environment';

export function useConnectionStatus() {
  // Initialize with the current online status, defaulting to true if not in browser
  let isOnline = $state(browser ? navigator.onLine : true);
  let wasOffline = $state(false);

  // Handle online/offline events
  $effect(() => {
    if (!browser) return;
    
    const handleOnline = () => {
      if (!isOnline) {
        wasOffline = true;
        isOnline = true;
      }
    };

    const handleOffline = () => {
      isOnline = false;
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  // Reset the wasOffline state after a delay
  $effect(() => {
    if (!browser) return;
    
    if (wasOffline && isOnline) {
      const timer = setTimeout(() => {
        wasOffline = false;
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  });

  return {
    get isOnline() { return isOnline; },
    get wasOffline() { return wasOffline; },
    
    // Add method to manually check connection
    checkConnection() {
      if (!browser) return true;
      
      // Try to update the connection status - just returning the current value
      // For a more robust check, we could attempt a network request
      isOnline = navigator.onLine;
      return isOnline;
    }
  };
}
