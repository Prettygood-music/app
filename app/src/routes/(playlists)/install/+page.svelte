<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import Music from 'lucide-svelte/icons/music';
	import Zap from 'lucide-svelte/icons/zap';
	import Laptop from 'lucide-svelte/icons/laptop';
	import WifiOff from 'lucide-svelte/icons/wifi-off';

	// State for installation
	let deferredPrompt = $state<any>(null);
	let installationInProgress = $state(false);
	let installationResult = $state<'success' | 'dismissed' | 'error' | null>(null);
	let isInstallable = $state(false);
	let isInstalled = $state(false);

	// Check if the app is already installed
	function checkIfInstalled() {
		if (!browser) return;

		if (
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			(window.navigator as any).standalone === true
		) {
			isInstalled = true;
		}
	}

	// Handle install button click
	async function handleInstall() {
		/*
		if (!deferredPrompt) return;

		installationInProgress = true;

		try {
			deferredPrompt.prompt();
			const choiceResult = await deferredPrompt.userChoice;

			if (choiceResult.outcome === 'accepted') {
				installationResult = 'success';
				deferredPrompt = null;
			} else {
				installationResult = 'dismissed';
			}
		} catch (error) {
			console.error('Installation error:', error);
			installationResult = 'error';
		} finally {
			installationInProgress = false;
		}*/
		window.deferredInstallPrompt?.prompt();
	}

	// Setup listeners
	$effect(() => {
		if (!browser) return;

		checkIfInstalled();

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			isInstallable = true;
		};

		const handleAppInstalled = () => {
			installationResult = 'success';
			isInstalled = true;
			deferredPrompt = null;
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	});
</script>

<div class="overflow-y-auto">
	<div class="container mx-auto max-w-2xl px-4 py-8">
		<div class="mb-8 text-center">
			<h1 class="mb-3 text-4xl font-bold">Install prettygood.music</h1>
			<p class="text-muted-foreground text-lg">Get the best music experience on your device</p>
		</div>

		{#if isInstalled}
			<Card class="border-primary mb-8 text-center ">
				<CardHeader>
					<CardTitle class="text-2xl">You've already installed prettygood.music!</CardTitle>
					<CardDescription class="text-lg">Enjoy your enhanced music experience</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="flex justify-center p-6">
						<Music size={64} class="text-primary" />
					</div>
					<p>You're currently using the installed version of our app with all its benefits.</p>
				</CardContent>
				<CardFooter class="justify-center">
					<Button href="/">Continue</Button>
				</CardFooter>
			</Card>
		{:else}
			<Button
				size="lg"
				onclick={handleInstall}
				disabled={installationInProgress}
				class="w-full px-8"
			>
				{#if installationInProgress}
					Installing...
				{:else}
					Install prettygood.music
				{/if}
			</Button>

			<div class="mt-12 space-y-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Card>
						<CardContent class="pt-6">
							<div class="flex items-start gap-4">
								<div class="bg-primary/10 rounded-full p-3">
									<Zap size={24} class="text-primary" />
								</div>
								<div>
									<h3 class="mb-1 text-lg font-semibold">Faster Experience</h3>
									<p class="text-muted-foreground">
										Enjoy faster load times and smoother performance when listening to your music.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="pt-6">
							<div class="flex items-start gap-4">
								<div class="bg-primary/10 rounded-full p-3">
									<WifiOff size={24} class="text-primary" />
								</div>
								<div>
									<h3 class="mb-1 text-lg font-semibold">Offline Access</h3>
									<p class="text-muted-foreground">
										Listen to your saved music even when you don't have an internet connection.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="pt-6">
							<div class="flex items-start gap-4">
								<div class="bg-primary/10 rounded-full p-3">
									<Laptop size={24} class="text-primary" />
								</div>
								<div>
									<h3 class="mb-1 text-lg font-semibold">App-Like Experience</h3>
									<p class="text-muted-foreground">
										Use prettygood.music like a native app with full-screen view and no browser
										controls.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="pt-6">
							<div class="flex items-start gap-4">
								<div class="bg-primary/10 rounded-full p-3">
									<Music size={24} class="text-primary" />
								</div>
								<div>
									<h3 class="mb-1 text-lg font-semibold">Quick Access</h3>
									<p class="text-muted-foreground">
										Launch directly from your home screen or app menu with just one tap.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		{/if}
	</div>
</div>
