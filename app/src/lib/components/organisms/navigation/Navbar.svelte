<!-- Navbar.svelte -->
<script>
	import { onMount } from 'svelte';
	import EnhancedSearchBar from '$lib/components/search/EnhancedSearchBar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { HomeIcon, Download, DownloadIcon } from 'lucide-svelte';
	import { useInstallPrompt } from '$lib/hooks/use-install-prompt.svelte';

	// Define state for user
	let isDropdownOpen = $state(false);
	let walletConnected = $state(false);
	let userInitials = $state('');

	// Get installation hook
	const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

	// Mock function for wallet connection - would be replaced with actual Sui wallet implementation
	function handleConnectWallet() {
		walletConnected = true;
		userInitials = 'PG'; // Example value - would be derived from actual user data
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	// Handle install click from dropdown
	async function handleInstallClick() {
		isDropdownOpen = false;
		await promptInstall();
	}

	// Close dropdown when clicking outside
	onMount(() => {
		const handleClickOutside = (event) => {
			if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
				isDropdownOpen = false;
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="bg-background w-full border-b" style="view-transition-name: none;">
	<div class="container flex h-14 items-center justify-between">
		<!-- Logo -->
		<a href="/" class="mr-4 flex items-center space-x-2">
			<img src="/favicon.svg" width="32" height="32" alt="prettygood.music logo" />
			<!-- <span class="text-primary text-xl font-bold">prettygood.music</span> -->
		</a>

		<!-- Search -->
		<div class="flex w-full items-center md:max-w-sm md:flex-1">
			<Button size="icon" href="/" variant="ghost" class="text-muted-foreground">
				<HomeIcon></HomeIcon>
			</Button>
			<EnhancedSearchBar showButton={false} fullWidth={true}></EnhancedSearchBar>
		</div>

		<!-- User Section -->
		<div class="flex items-center space-x-4">
			<!-- TODO: don't show if already installed -->
			<Button href="/install" size="sm" variant="ghost" class="text-muted-foreground">
				<DownloadIcon></DownloadIcon>
				Install App</Button
			>
			{#if !isInstalled && isInstallable}
				<Button variant="outline" size="sm" class="hidden md:flex" on:click={handleInstallClick}>
					<Download size={16} class="mr-2" /> Install App
				</Button>
			{/if}

			{#if walletConnected}
				<!-- User Avatar -->
				<div class="user-dropdown relative">
					<button
						class="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full"
						onclick={() => toggleDropdown()}
					>
						{userInitials}
					</button>

					{#if isDropdownOpen}
						<div
							class="bg-popover border-border absolute right-0 mt-2 w-56 rounded-md border shadow-lg"
						>
							<div class="bg-popover text-popover-foreground rounded-md py-1">
								<a
									href="/profile"
									class="hover:bg-accent hover:text-accent-foreground block px-4 py-2 text-sm"
								>
									Profile
								</a>
								<a
									href="/settings"
									class="hover:bg-accent hover:text-accent-foreground block px-4 py-2 text-sm"
								>
									Settings
								</a>

								{#if !isInstalled}
									<a
										href="/install"
										class="hover:bg-accent hover:text-accent-foreground flex items-center px-4 py-2 text-sm"
									>
										<Download size={16} class="mr-2" /> Install App
									</a>
								{/if}

								<div class="border-border my-1 border-t"></div>
								<button
									class="hover:bg-accent hover:text-accent-foreground block w-full px-4 py-2 text-left text-sm"
								>
									Disconnect Wallet
								</button>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Connect Wallet Button -->
				<button
					onclick={() => handleConnectWallet()}
					class="focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1"
				>
					Connect Wallet
				</button>
			{/if}
		</div>
	</div>
</header>
