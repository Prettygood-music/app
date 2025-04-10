<script lang="ts">
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { useConnectionStatus } from '$lib/hooks/connection-status.svelte';
	import Wifi from 'lucide-svelte/icons/wifi';
	import WifiOff from 'lucide-svelte/icons/wifi-off';

	const { isOnline, wasOffline } = useConnectionStatus();
</script>

{#if !isOnline}
	<Alert variant="destructive" class="fixed bottom-4 right-4 z-50 max-w-md">
		<WifiOff class="mr-2 h-4 w-4" />
		<AlertDescription>You are currently offline. Some features may be limited.</AlertDescription>
	</Alert>
{:else if wasOffline}
	<Alert variant="default" class="fixed bottom-4 right-4 z-50 max-w-md">
		<Wifi class="mr-2 h-4 w-4" />
		<AlertDescription>Your connection has been restored.</AlertDescription>
	</Alert>
{/if}
