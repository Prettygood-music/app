<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { cn } from '$lib/utils';
    
    // Navigation items
    const navItems = [
        { href: '/artist-dashboard', label: 'Overview', exact: true },
        { href: '/artist-dashboard/stats', label: 'Stats & Analytics' },
        { href: '/artist-dashboard/earnings', label: 'Earnings & Payments' },
        { href: '/artist-dashboard/uploads', label: 'Content Management' },
        { href: '/artist-dashboard/token', label: 'Wallet' },
        { href: '/artist-dashboard/nfts', label: 'NFTs (Coming Soon)' },
    ];

    // Check if current page matches nav item
    function isActive(href: string, exact = false) {
        if (exact) {
            return $page.url.pathname === href;
        }
        return $page.url.pathname.startsWith(href);
    }
    
    let {children} = $props();
    let isMobileNavOpen = $state(false);

    function toggleMobileNav() {
        isMobileNavOpen = !isMobileNavOpen;
    }
</script>

<div class="flex min-h-screen bg-background">
    <!-- Sidebar (desktop) -->
    <aside class="hidden md:flex w-64 flex-col border-r bg-card">
        <div class="p-4">
            <h1 class="text-xl font-semibold">Artist Dashboard</h1>
        </div>
        <Separator />
        <nav class="flex-1 p-4 space-y-1">
            {#each navItems as item}
                <a 
                    href={item.href}
                    class={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isActive(item.href, item.exact) 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                    )}
                    aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                >
                    {item.label}
                </a>
            {/each}
        </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Mobile header -->
        <header class="flex md:hidden items-center justify-between p-4 border-b">
            <h1 class="text-lg font-medium">Artist Dashboard</h1>
            <Button variant="outline" size="sm" on:click={toggleMobileNav}>
                <span class="sr-only">Toggle navigation</span>
                {#if isMobileNavOpen}
                    <!-- X icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                {:else}
                    <!-- Menu icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                        <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                    </svg>
                {/if}
            </Button>
        </header>

        <!-- Mobile navigation drawer -->
        {#if isMobileNavOpen}
            <div class="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" on:click={toggleMobileNav}>
                <div class="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card shadow-lg p-6" on:click|stopPropagation>
                    <nav class="space-y-2">
                        {#each navItems as item}
                            <a 
                                href={item.href}
                                class={cn(
                                    "block px-3 py-2 text-base rounded-md transition-colors",
                                    isActive(item.href, item.exact) 
                                        ? "bg-primary text-primary-foreground" 
                                        : "hover:bg-muted"
                                )}
                                aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                                on:click={toggleMobileNav}
                            >
                                {item.label}
                            </a>
                        {/each}
                    </nav>
                </div>
            </div>
        {/if}

        <!-- Page content -->
        <main class="flex-1 p-4 md:p-6 overflow-auto">
            {@render children()}
        </main>
    </div>
</div>