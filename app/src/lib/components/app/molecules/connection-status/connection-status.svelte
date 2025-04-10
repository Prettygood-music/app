<script lang="ts">
  import { Alert, AlertDescription } from "$lib/components/ui/alert";
  import { useConnectionStatus } from "$lib/hooks/connection-status.svelte";
  import { Wifi, WifiOff } from "lucide-svelte";

  const { isOnline, wasOffline } = useConnectionStatus();
</script>

{#if !isOnline}
  <Alert variant="destructive" class="fixed bottom-4 right-4 max-w-md z-50">
    <WifiOff class="h-4 w-4 mr-2" />
    <AlertDescription>
      You are currently offline. Some features may be limited.
    </AlertDescription>
  </Alert>
{:else if wasOffline}
  <Alert variant="success" class="fixed bottom-4 right-4 max-w-md z-50">
    <Wifi class="h-4 w-4 mr-2" />
    <AlertDescription>
      Your connection has been restored.
    </AlertDescription>
  </Alert>
{/if}
