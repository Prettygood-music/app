<!-- Navbar.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import SearchBar from '$lib/components/molecules/SearchBar.svelte';
  
  // Define state for user
  let isDropdownOpen = $state(false);
  let walletConnected = $state(false);
  let userInitials = $state('');
  let searchValue = $state('');
  
  // Mock function for wallet connection - would be replaced with actual Sui wallet implementation
  function handleConnectWallet() {
    walletConnected = true;
    userInitials = 'PG'; // Example value - would be derived from actual user data
  }
  
  function handleSearch(query) {
    // Navigate to search page with query
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
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

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-14 items-center">
    <!-- Logo -->
    <a href="/" class="flex items-center space-x-2 mr-4">
      <span class="font-bold text-xl text-primary">prettygood.music</span>
    </a>
    
    <!-- Main Navigation -->
    <nav class="flex items-center space-x-4 lg:space-x-6 hidden md:flex">
      <a
        href="/home"
        class={`text-sm font-medium transition-colors hover:text-primary ${$page?.url?.pathname === '/home' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        Home
      </a>
      <a
        href="/library"
        class={`text-sm font-medium transition-colors hover:text-primary ${$page?.url?.pathname.startsWith('/library') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        Library
      </a>
      <a
        href="/artists"
        class={`text-sm font-medium transition-colors hover:text-primary ${$page?.url?.pathname.startsWith('/artists') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        Artists
      </a>
    </nav>
    
    <!-- Search -->
    <div class="flex-1 ml-auto mr-4">
      <div class="md:w-auto md:flex-1 md:max-w-sm">
        <SearchBar 
          placeholder="Search for music..." 
          bind:value={searchValue}
          onSubmit={handleSearch} 
        />
      </div>
    </div>
    
    <!-- User Section -->
    <div class="flex items-center space-x-4">
      {#if walletConnected}
        <!-- User Avatar -->
        <div class="relative user-dropdown">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
            on:click={toggleDropdown}
          >
            {userInitials}
          </button>
          
          {#if isDropdownOpen}
            <div class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border border-border">
              <div class="py-1 rounded-md bg-popover text-popover-foreground">
                <a href="/profile" class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                  Profile
                </a>
                <a href="/settings" class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                  Settings
                </a>
                <div class="border-t border-border my-1"></div>
                <button class="block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                  Disconnect Wallet
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- Connect Wallet Button -->
        <button
          on:click={handleConnectWallet}
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          Connect Wallet
        </button>
      {/if}
    </div>
  </div>
</header>