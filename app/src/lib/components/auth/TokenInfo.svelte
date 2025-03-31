<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    getAuthCookie, 
    decodeJwt, 
    validateJwt, 
    getTokenRemainingTime,
    tokenNeedsRefresh,
    refreshTokenIfNeeded
  } from '$lib/auth/jwt';
  
  // State
  let token = $state<string | null>(null);
  let payload = $state<any | null>(null);
  let isValid = $state(false);
  let remainingTime = $state<number>(0);
  let needsRefresh = $state(false);
  let refreshed = $state(false);
  let loading = $state(true);
  
  // Format time remaining as HH:MM:SS
  function formatTimeRemaining(ms: number): string {
    if (ms <= 0) return 'Expired';
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Load token information
  async function loadTokenInfo() {
    loading = true;
    
    try {
      token = getAuthCookie();
      
      if (token) {
        payload = await decodeJwt(token);
        isValid = await validateJwt(token);
        remainingTime = await getTokenRemainingTime(token);
        needsRefresh = await tokenNeedsRefresh(token);
      }
    } catch (error) {
      console.error('Error loading token info:', error);
    } finally {
      loading = false;
    }
  }
  
  // Refresh token
  async function handleRefresh() {
    try {
      refreshed = await refreshTokenIfNeeded();
      
      if (refreshed) {
        // Reload token info after refresh
        await loadTokenInfo();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }
  
  // Set up interval to update remaining time
  let timeInterval: ReturnType<typeof setInterval>;
  
  onMount(() => {
    loadTokenInfo();
    
    // Update remaining time every second
    timeInterval = setInterval(async () => {
      if (token) {
        remainingTime = await getTokenRemainingTime(token);
        needsRefresh = await tokenNeedsRefresh(token);
      }
    }, 1000);
    
    return () => {
      clearInterval(timeInterval);
    };
  });
</script>

<div class="token-info p-4 border rounded-lg bg-card">
  <h2 class="text-xl font-semibold mb-4">JWT Token Information</h2>
  
  {#if loading}
    <div class="flex items-center justify-center p-4">
      <span class="loading loading-spinner"></span>
      <span class="ml-2">Loading token info...</span>
    </div>
  {:else if !token}
    <div class="p-4 bg-muted rounded-md text-center">
      <p>No authentication token found.</p>
      <p class="text-sm text-muted-foreground mt-2">Please log in to see token details.</p>
    </div>
  {:else}
    <div class="space-y-4">
      <div class="grid grid-cols-[120px_1fr] gap-2">
        <span class="font-medium">Status:</span>
        <span class={isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {isValid ? 'Valid' : 'Invalid/Expired'}
        </span>
        
        <span class="font-medium">Expires in:</span>
        <span class={remainingTime < 900000 ? 'text-orange-600 dark:text-orange-400' : ''}>
          {formatTimeRemaining(remainingTime)}
        </span>
        
        <span class="font-medium">Needs refresh:</span>
        <span class={needsRefresh ? 'text-orange-600 dark:text-orange-400' : ''}>
          {needsRefresh ? 'Yes' : 'No'}
        </span>
      </div>
      
      {#if payload}
        <div class="mt-4">
          <h3 class="text-lg font-medium mb-2">Payload:</h3>
          <div class="bg-muted p-2 rounded-md overflow-auto max-h-60">
            <pre class="text-xs whitespace-pre-wrap break-all">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        </div>
      {/if}
      
      <div class="flex space-x-2 mt-4">
        <button 
          class="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90"
          on:click={loadTokenInfo}
        >
          Refresh Info
        </button>
        
        <button 
          class="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/90"
          on:click={handleRefresh}
          disabled={!token || !needsRefresh}
        >
          {#if refreshed}
            Token Refreshed
          {:else}
            Refresh Token
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
