<script lang="ts">
	import { useInstallPrompt } from '$lib/hooks/use-install-prompt.svelte';
	import { goto } from '$app/navigation';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import Download from 'lucide-svelte/icons/download';
	import X from 'lucide-svelte/icons/x';

	// Export props
	let { variant = 'banner' } = $props<{
		variant?: 'banner' | 'inline' | 'floating';
	}>();

	// Get the installation hook
	let { isInstallable, hasPrompt, promptInstall, shouldPromptInstall } = useInstallPrompt();
	$effect(() => {
		console.log(isInstallable, hasPrompt, promptInstall, shouldPromptInstall);
	});
	// State
	let showPrompt = $state(false);
	let installInProgress = $state(false);

	// Show the prompt if conditions are met
	$effect(() => {
		// Only show if the app is installable and we haven't dismissed it
		if (isInstallable && hasPrompt && shouldPromptInstall()) {
			console.log('showing prompt');
			showPrompt = true;
		}
	});

	// Handle install click
	async function handleInstall() {
		installInProgress = true;

		try {
			const result = await promptInstall();

			if (result.outcome === 'accepted') {
				// Successfully installed, hide the prompt
				showPrompt = false;
			}
		} catch (error) {
			console.error('Installation error:', error);
			// If there's an error, redirect to the install page
			goto('/install');
		} finally {
			installInProgress = false;
		}
	}

	// Handle the "Learn more" click
	function handleLearnMore() {
		goto('/install');
	}

	// Dismiss the prompt
	function handleDismiss() {
		showPrompt = false;
		// Store in local storage to prevent showing again too soon
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('install_prompt_dismissed', Date.now().toString());
		}
	}
</script>

{#if showPrompt}
	{#if variant === 'banner'}
		<Alert class="fixed bottom-0 left-10 right-10 z-50 rounded-none border-t">
			<div class="container mx-auto flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Download size={20} class="text-primary" />
					<div>
						<AlertTitle>Install prettygood.music</AlertTitle>
						<AlertDescription>Get the full app experience and offline access.</AlertDescription>
					</div>
				</div>
				<div class="flex gap-2">
					<Button variant="outline" size="sm" onclick={handleDismiss}>
						<X size={16} class="mr-1" /> Dismiss
					</Button>
					<Button size="sm" onclick={handleInstall} disabled={installInProgress}>
						{#if installInProgress}
							Installing...
						{:else}
							Install Now
						{/if}
					</Button>
				</div>
			</div>
		</Alert>
	{:else if variant === 'inline'}
		<div class="bg-card text-card-foreground my-4 rounded-lg border p-4 shadow-sm">
			<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div class="flex items-center gap-3">
					<div class="bg-primary/10 rounded-full p-2">
						<Download size={18} class="text-primary" />
					</div>
					<div>
						<h3 class="font-semibold">Install prettygood.music</h3>
						<p class="text-muted-foreground text-sm">
							Install our app for offline listening and better performance.
						</p>
					</div>
				</div>
				<div class="flex w-full gap-2 sm:w-auto">
					<Button
						variant="outline"
						class="flex-1 sm:flex-initial"
						size="sm"
						onclick={handleLearnMore}
					>
						Learn More
					</Button>
					<Button
						class="flex-1 sm:flex-initial"
						size="sm"
						onclick={handleInstall}
						disabled={installInProgress}
					>
						{#if installInProgress}
							Installing...
						{:else}
							Install Now
						{/if}
					</Button>
				</div>
			</div>
		</div>
	{:else if variant === 'floating'}
		<div class="fixed bottom-4 right-4 z-50 w-full max-w-xs">
			<Alert class="border shadow-lg">
				<div class="flex items-start justify-between">
					<div class="flex gap-2">
						<Download size={20} class="text-primary mt-0.5" />
						<div>
							<AlertTitle>Install App</AlertTitle>
							<AlertDescription class="text-sm"
								>Add to your home screen for the best experience.</AlertDescription
							>
							<div class="mt-2 flex gap-2">
								<Button size="sm" variant="outline" onclick={handleLearnMore}>Learn More</Button>
								<Button size="sm" onclick={handleInstall} disabled={installInProgress}>
									{#if installInProgress}
										Installing...
									{:else}
										Install
									{/if}
								</Button>
							</div>
						</div>
					</div>
					<button
						class="text-muted-foreground hover:text-foreground transition-colors"
						onclick={handleDismiss}
						aria-label="Dismiss"
					>
						<X size={18} />
					</button>
				</div>
			</Alert>
		</div>
	{/if}
{/if}
