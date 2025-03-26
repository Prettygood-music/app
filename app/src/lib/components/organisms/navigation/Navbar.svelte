<!-- Navbar.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { CompactSearchBar } from '$lib/components/search';
	import EnhancedSearchBar from '$lib/components/search/EnhancedSearchBar.svelte';

	// Define state for user
	let isDropdownOpen = $state(false);
	let walletConnected = $state(false);
	let userInitials = $state('');

	// Mock function for wallet connection - would be replaced with actual Sui wallet implementation
	function handleConnectWallet() {
		walletConnected = true;
		userInitials = 'PG'; // Example value - would be derived from actual user data
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
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
			<span class="text-primary text-xl font-bold">prettygood.music</span>
		</a>

		<!-- Main Navigation -->
		<!-- 
		<nav class="flex items-center space-x-4 lg:space-x-6">
			<a
				href="/"
				class={`hover:text-primary text-sm font-medium transition-colors ${$page?.url?.pathname === '/home' ? 'text-primary' : 'text-muted-foreground'}`}
			>
				Home
			</a>
			<a
				href="/library"
				class={`hover:text-primary text-sm font-medium transition-colors ${$page?.url?.pathname.startsWith('/library') ? 'text-primary' : 'text-muted-foreground'}`}
			>
				Library
			</a>
			<a
				href="/artists"
				class={`hover:text-primary text-sm font-medium transition-colors ${$page?.url?.pathname.startsWith('/artists') ? 'text-primary' : 'text-muted-foreground'}`}
			>
				Artists
			</a>
		</nav>
 -->
		<!-- Search -->
		<div class="w-full md:max-w-sm md:flex-1">
			<!-- 
					<CompactSearchBar placeholder="Search for music..." />
					-->
			<EnhancedSearchBar showButton={false} fullWidth={true}></EnhancedSearchBar>
		</div>

		<!-- User Section -->
		<div class="flex items-center space-x-4">
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
