<script>
  import { Button } from '$lib/components/ui/button';
</script>

<div class="h-full flex flex-col items-center justify-center px-4 py-12 text-center gap-6">
  <div class="space-y-4">
    <h1 class="text-3xl font-bold">You're offline</h1>
    <p class="text-muted-foreground">
      It looks like you're not connected to the internet right now. Some features may be limited.
    </p>
  </div>
  
  <div class="max-w-md mx-auto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-32 h-32 mx-auto text-primary mb-6">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
      <path d="M8 15h8"></path>
      <path d="M9 10h.01"></path>
      <path d="M15 10h.01"></path>
    </svg>
    
    <div class="space-y-4">
      <p class="text-sm">
        You can still listen to tracks that were previously cached while you wait for your connection to return.
      </p>
      
      <div class="flex flex-col gap-2">
        <Button onclick={() => window.location.href = '/library'}>
          Go to Your Library
        </Button>
        <Button variant="outline" onclick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  </div>
</div>
