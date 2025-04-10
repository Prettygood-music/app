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
	import { page } from '$app/state';

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
			//token = getAuthCookie();
			token = page.data.token;

			console.dir(page.data);
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

<div class="token-info bg-card rounded-lg border p-4">
	<h2 class="mb-4 text-xl font-semibold">JWT Token Information</h2>

	{#if loading}
		<div class="flex items-center justify-center p-4">
			<span class="loading loading-spinner"></span>
			<span class="ml-2">Loading token info...</span>
		</div>
	{:else if !token}
		<div class="bg-muted rounded-md p-4 text-center">
			<p>No authentication token found.</p>
			<p class="text-muted-foreground mt-2 text-sm">Please log in to see token details.</p>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="grid grid-cols-[120px_1fr] gap-2">
				<span class="font-medium">Status:</span>
				<span
					class={isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
				>
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
					<h3 class="mb-2 text-lg font-medium">Payload:</h3>
					<div class="bg-muted max-h-60 overflow-auto rounded-md p-2">
						<pre class="whitespace-pre-wrap break-all text-xs">{JSON.stringify(
								payload,
								null,
								2
							)}</pre>
					</div>
				</div>
			{/if}

			<div class="mt-4 flex space-x-2">
				<button
					class="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm"
					onclick={loadTokenInfo}
				>
					Refresh Info
				</button>

				<button
					class="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded px-3 py-1 text-sm"
					onclick={handleRefresh}
          >
					<!-- disabled={!token || !needsRefresh} -->
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
