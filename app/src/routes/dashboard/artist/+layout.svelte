<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { LINKS } from '$lib/constants';
	import { cn } from '$lib/utils';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	const makeLink = (path: string) => {
		return `/dashboard/artist${path}`;
	};
	// Navigation items
	const navItems = [
		{ href: makeLink(''), label: 'Overview', exact: true },
		{ href: makeLink('/stats'), label: 'Stats & Analytics' },
		{ href: makeLink('/earnings'), label: 'Earnings & Payments' },
		{ href: makeLink('/uploads'), label: 'Content Management' },
		{ href: makeLink('/nfts'), label: 'NFTs (Coming Soon)' }
	];

	// Check if current page matches nav item
	function isActive(href: string, exact = false) {
		if (exact) {
			return $page.url.pathname === href;
		}
		return $page.url.pathname.startsWith(href);
	}

	let { children } = $props();
	let isMobileNavOpen = $state(false);

	function toggleMobileNav() {
		isMobileNavOpen = !isMobileNavOpen;
	}
</script>

<div class=" flex overflow-y-hidden">
	<aside class="bg-card hidden h-screen w-64 flex-col border-r md:flex">
		<div class="p-4">
			<h1 class="text-xl font-semibold">Artist Dashboard</h1>
			<a
				href={LINKS.PROFILE}
				class="text-muted-foreground hover:text-foreground mt-1 flex items-center text-xs"
			>
				<ArrowLeft size={14}></ArrowLeft>
				Back to dashboard</a
			>
		</div>
		<Separator />
		<nav class="flex-1 space-y-1 p-4">
			{#each navItems as item}
				<a
					href={item.href}
					class={cn(
						'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
						isActive(item.href, item.exact)
							? 'bg-primary text-primary-foreground'
							: 'hover:bg-muted'
					)}
					aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main content -->
	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Mobile header -->
		<header class="flex items-center justify-between border-b p-4 md:hidden">
			<h1 class="text-lg font-medium">Artist Dashboard</h1>
			<Button variant="outline" size="sm" onclick={toggleMobileNav}>
				<span class="sr-only">Toggle navigation</span>
				{#if isMobileNavOpen}
					<!-- X icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<path d="M18 6 6 18" /><path d="m6 6 12 12" />
					</svg>
				{:else}
					<!-- Menu icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
							x1="4"
							x2="20"
							y1="18"
							y2="18"
						/>
					</svg>
				{/if}
			</Button>
		</header>

		<!-- Mobile navigation drawer -->
		{#if isMobileNavOpen}
			<button
				class="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm md:hidden"
				onclick={toggleMobileNav}
			>
				<div class="bg-card fixed inset-y-0 left-0 w-3/4 max-w-sm p-6 shadow-lg">
					<nav class="space-y-2">
						{#each navItems as item}
							<a
								href={item.href}
								class={cn(
									'block rounded-md px-3 py-2 text-base transition-colors',
									isActive(item.href, item.exact)
										? 'bg-primary text-primary-foreground'
										: 'hover:bg-muted'
								)}
								aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
								onclick={toggleMobileNav}
							>
								{item.label}
							</a>
						{/each}
					</nav>
				</div>
			</button>
		{/if}

		<!-- Page content -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6">
			{@render children()}
		</main>
	</div>
</div>
