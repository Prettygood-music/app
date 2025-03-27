import { browser } from '$app/environment';

// The BeforeInstallPromptEvent is not in standard TypeScript types yet
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	prompt(): Promise<void>;
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
}

// Return types for the hook functions
type InstallPromptResult =
	| { outcome: 'accepted' | 'dismissed' }
	| { outcome: 'unavailable' }
	| { outcome: 'error'; error: any };

export function useInstallPrompt() {
	// State for installation prompt
	let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let isInstallable = $state(false);
	let isInstalled = $state(false);
	let hasPrompted = $state(false);

	// Check if the app is already installed as a PWA
	function checkIfInstalled(): boolean {
		if (!browser) return false;

		try {
			const isStandalone =
				window.matchMedia('(display-mode: standalone)').matches ||
				window.matchMedia('(display-mode: fullscreen)').matches ||
				(window.navigator as any).standalone === true;

			isInstalled = isStandalone;
			return isStandalone;
		} catch (err) {
			console.error('Error checking installation status:', err);
			return false;
		}
	}

	// Prompt the user to install the app
	async function promptInstall(): Promise<InstallPromptResult> {
		if (!deferredPrompt) return { outcome: 'unavailable' };

		try {
			// Show the installation prompt
			await deferredPrompt.prompt();
			hasPrompted = true;

			// Wait for the user's choice
			const choiceResult = await deferredPrompt.userChoice;

			// Reset the deferred prompt variable, as it can only be used once
			deferredPrompt = null;

			return { outcome: choiceResult.outcome };
		} catch (error) {
			console.error('Error attempting to prompt installation:', error);
			return { outcome: 'error', error };
		}
	}

	// Should we show the install prompt based on certain conditions?
	function shouldPromptInstall(options = { minVisits: 2, minTime: 120000 }): boolean {
		if (!isInstallable || isInstalled || hasPrompted) return false;

		// Check stored values for visits and time spent
		if (browser) {
			try {
				const visits = parseInt(localStorage.getItem('app_visit_count') || '0', 10);
				const firstVisit = parseInt(
					localStorage.getItem('app_first_visit') || Date.now().toString(),
					10
				);
				const timeSpent = Date.now() - firstVisit;

				// If user previously dismissed the prompt recently, don't show again
				const lastDismissed = localStorage.getItem('install_prompt_dismissed');
				if (lastDismissed) {
					const dismissedTime = parseInt(lastDismissed, 10);
					const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);

					// If dismissed less than 24 hours ago, don't show
					if (hoursSinceDismissed < 24) {
						return false;
					}
				}

				return visits >= options.minVisits && timeSpent >= options.minTime;
			} catch (err) {
				console.error('Error checking prompt conditions:', err);
				return false;
			}
		}

		return false;
	}

	// Show installation hint in the UI (e.g., a small banner)
	function showInstallHint(): void {
		if (!browser) return;
		try {
			localStorage.setItem('install_hint_shown', 'true');
		} catch (err) {
			console.error('Error saving install hint state:', err);
		}
	}

	// Track app usage to determine when to show installation prompt
	function trackAppUsage(): void {
		if (!browser) return;

		try {
			// Record first visit time if not already set
			if (!localStorage.getItem('app_first_visit')) {
				localStorage.setItem('app_first_visit', Date.now().toString());
			}

			// Increment visit count
			const visits = parseInt(localStorage.getItem('app_visit_count') || '0', 10);
			localStorage.setItem('app_visit_count', (visits + 1).toString());
		} catch (err) {
			console.error('Error tracking app usage:', err);
		}
	}

	// Reset tracking data (useful for testing)
	function resetAppUsageTracking(): void {
		if (!browser) return;

		try {
			localStorage.removeItem('app_first_visit');
			localStorage.removeItem('app_visit_count');
			localStorage.removeItem('install_hint_shown');
			localStorage.removeItem('install_prompt_dismissed');
		} catch (err) {
			console.error('Error resetting usage tracking:', err);
		}
	}

	// Set up event listeners
	$effect(() => {
		if (!browser) return;

		// Check if already installed
		checkIfInstalled();

		// Track this visit
		trackAppUsage();

		// Handler function for beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			console.log('beforeinstall prompt');

			// Store the event for later use
			deferredPrompt = e as BeforeInstallPromptEvent;
			isInstallable = true;
		};

		// Handler function for appinstalled event
		const handleAppInstalled = () => {
			isInstalled = true;
			deferredPrompt = null;
			console.log('PWA was installed');

			// Optionally track successful installation
			try {
				localStorage.setItem('app_installed', 'true');
				localStorage.setItem('app_installed_date', Date.now().toString());
			} catch (err) {
				console.error('Error saving installation state:', err);
			}
		};

		// Set up the event listeners
		console.log("setting install events")
		//window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		//window.addEventListener('appinstalled', handleAppInstalled);

		// Clean up when component is destroyed
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	});

	return {
		get isInstallable() {
			return isInstallable;
		},
		get isInstalled() {
			return isInstalled;
		},
		get hasPrompt() {
			return !!deferredPrompt;
		},
		promptInstall,
		shouldPromptInstall,
		showInstallHint,
		resetAppUsageTracking,
		checkIfInstalled
	};
}
