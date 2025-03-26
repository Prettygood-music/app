<script>
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	// Define platforms
	const platforms = [
		{ id: 'ios', name: 'iOS' },
		{ id: 'android', name: 'Android' },
		{ id: 'desktop', name: 'Desktop' }
	];

	// State for deferredPrompt
	let deferredPrompt = $state(null);
	let installationInProgress = $state(false);
	let installationResult = $state(null);
	let isInstallable = $state(false);
	let isInstalled = $state(false);

	// Check if the app is already installed
	function checkIfInstalled() {
		if (!browser) return;

		// Check if app is installed (matches standalone or fullscreen display mode)
		if (
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches
		) {
			isInstalled = true;
		}
	}

	// Handle install button click
	async function handleInstall() {
		if (!deferredPrompt) return;

		installationInProgress = true;

		try {
			// Show the installation prompt
			deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
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
		}
	}

	// Setup listeners if in browser
	$effect(() => {
		if (!browser) return;

		checkIfInstalled();

		// Listen for beforeinstallprompt event
		const handleBeforeInstallPrompt = (e) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later
			deferredPrompt = e;
			isInstallable = true;
		};

		// Listen for app installed event
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

	// Detect platform for default tab
	let defaultTab = $state('ios');

	$effect(() => {
		if (!browser) return;

		const ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			defaultTab = 'ios';
		} else if (/android/.test(ua)) {
			defaultTab = 'android';
		} else {
			defaultTab = 'desktop';
		}
	});
</script>

<div class="overflow-y-auto">
	<div class="container mx-auto max-w-3xl px-4 py-8">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold">Install prettygood.music</h1>
			<p class="text-muted-foreground">Install our app for the best listening experience</p>
		</div>

		{#if isInstalled}
			<Card class="mb-8">
				<CardHeader>
					<CardTitle>You've already installed prettygood.music</CardTitle>
					<CardDescription>Enjoy the app experience!</CardDescription>
				</CardHeader>
				<CardContent>
					<p>
						You're currently using the installed version of our app. Enjoy the full experience with
						faster loading times and offline access to your music.
					</p>
				</CardContent>
				<CardFooter>
					<Button variant="outline" on:click={() => (window.location.href = '/')}>Go to Home</Button
					>
				</CardFooter>
			</Card>
		{:else}
			{#if isInstallable && deferredPrompt}
				<Card class="mb-8">
					<CardHeader>
						<CardTitle>Install with one click</CardTitle>
						<CardDescription>Your browser supports direct installation</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="mb-4">
							Install prettygood.music directly to your device for the best experience, including:
						</p>
						<ul class="mb-4 list-disc space-y-1 pl-5">
							<li>Faster access to your music</li>
							<li>Listen offline</li>
							<li>No browser navigation controls</li>
							<li>More screen space for your content</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							on:click={handleInstall}
							disabled={installationInProgress}
							class="w-full sm:w-auto"
						>
							{#if installationInProgress}
								Installing...
							{:else}
								Install Now
							{/if}
						</Button>
					</CardFooter>
				</Card>

				{#if installationResult}
					<div
						class="mb-8 rounded-md p-4 {installationResult === 'success'
							? 'bg-green-100 dark:bg-green-900/20'
							: 'bg-amber-100 dark:bg-amber-900/20'}"
					>
						{#if installationResult === 'success'}
							<p>
								Successfully installed! You can now access prettygood.music from your home screen or
								app launcher.
							</p>
						{:else if installationResult === 'dismissed'}
							<p>Installation was dismissed. You can try again whenever you're ready.</p>
						{:else}
							<p>
								There was an error during installation. Please try again or follow the manual
								instructions below.
							</p>
						{/if}
					</div>
				{/if}
			{/if}

			<div class="mb-4">
				<h2 class="mb-2 text-xl font-semibold">Manual Installation</h2>
				<p class="text-muted-foreground mb-4">
					Follow these steps to install prettygood.music on your device:
				</p>
			</div>

			<Tabs value={defaultTab} class="w-full">
				<TabsList class="mb-4 grid grid-cols-3">
					{#each platforms as platform}
						<TabsTrigger value={platform.id}>{platform.name}</TabsTrigger>
					{/each}
				</TabsList>

				<TabsContent value="ios" class="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Install on iPhone or iPad</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">1</span>
								</div>
								<div>
									<h3 class="font-medium">Open in Safari</h3>
									<p class="text-muted-foreground text-sm">
										This installation method only works in Safari browser.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">2</span>
								</div>
								<div>
									<h3 class="font-medium">Tap the Share icon</h3>
									<p class="text-muted-foreground text-sm">
										Look for the share icon (box with arrow) at the bottom of the screen.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">3</span>
								</div>
								<div>
									<h3 class="font-medium">Select "Add to Home Screen"</h3>
									<p class="text-muted-foreground text-sm">
										Scroll down in the share menu if needed.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">4</span>
								</div>
								<div>
									<h3 class="font-medium">Tap "Add"</h3>
									<p class="text-muted-foreground text-sm">
										You can customize the name before adding.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="android" class="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Install on Android</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">1</span>
								</div>
								<div>
									<h3 class="font-medium">Open in Chrome</h3>
									<p class="text-muted-foreground text-sm">
										The installation works best in Chrome browser.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">2</span>
								</div>
								<div>
									<h3 class="font-medium">Tap the menu icon (three dots)</h3>
									<p class="text-muted-foreground text-sm">
										This is usually in the top-right corner.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">3</span>
								</div>
								<div>
									<h3 class="font-medium">Select "Install app" or "Add to Home screen"</h3>
									<p class="text-muted-foreground text-sm">
										The wording may vary based on your device.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">4</span>
								</div>
								<div>
									<h3 class="font-medium">Follow the prompts</h3>
									<p class="text-muted-foreground text-sm">Tap "Add" or "Install" when prompted.</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="desktop" class="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Install on Desktop</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">1</span>
								</div>
								<div>
									<h3 class="font-medium">Open in Chrome, Edge, or other Chromium browser</h3>
									<p class="text-muted-foreground text-sm">
										Firefox and some other browsers don't support installation.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">2</span>
								</div>
								<div>
									<h3 class="font-medium">Look for the install icon in the address bar</h3>
									<p class="text-muted-foreground text-sm">
										It looks like a computer monitor with a down arrow.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">3</span>
								</div>
								<div>
									<h3 class="font-medium">Alternative: Use Chrome menu</h3>
									<p class="text-muted-foreground text-sm">
										Click the three dots menu in the top right, then "Install prettygood.music..."
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="bg-primary/10 mt-1 rounded-full p-2">
									<span class="font-bold">4</span>
								</div>
								<div>
									<h3 class="font-medium">Click "Install"</h3>
									<p class="text-muted-foreground text-sm">The app will open in its own window.</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		{/if}

		<div class="mt-8 space-y-4">
			<h2 class="text-xl font-semibold">Why Install the App?</h2>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader class="pb-2">
						<CardTitle class="text-lg">Offline Access</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-sm">Listen to your saved music even without an internet connection.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader class="pb-2">
						<CardTitle class="text-lg">Better Performance</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-sm">Faster loading times and smoother playback experience.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader class="pb-2">
						<CardTitle class="text-lg">Home Screen Access</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-sm">Launch directly from your home screen like any other app.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader class="pb-2">
						<CardTitle class="text-lg">Full Screen Experience</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-sm">No browser controls taking up precious space for your music.</p>
					</CardContent>
				</Card>
			</div>
		</div>

		<div class="mt-6 text-center">
			<Button variant="outline" on:click={() => (window.location.href = '/')}>
				Continue to Web App
			</Button>
		</div>
	</div>
</div>
