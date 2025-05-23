<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import EnhancedSearchBar from '$lib/components/search/EnhancedSearchBar.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import HomeIcon from 'lucide-svelte/icons/home';
	import DownloadIcon from 'lucide-svelte/icons/download';

	import { getUserContext } from '$lib/state/user/user.svelte';
	import User from 'lucide-svelte/icons/user';
	import { cn } from '$lib/utils';
	import { LINKS } from '$lib/constants';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Music_2 from 'lucide-svelte/icons/music-2';
	import Disc_3 from 'lucide-svelte/icons/disc-3';
	import { CircleIcon, CircleUserIcon } from 'lucide-svelte';

	const user = getUserContext();

	let isConnected = $derived.by(() => user.user);
	let userInitials = $derived.by(() => {
		if (user.user) {
			// TODO: got to fix user info, we're not getting the "user" we need here
			const split = user.user.username?.split(' ') || user.user.email?.split('@');

			if (split.length > 1) {
				return split
					.slice(0, 1)
					.map((s) => s[0])
					.join();
			} else {
				return split[0].substring(0, 2);
			}
		} else {
			return '';
		}
	});

	const dropdownContent = $derived([
		{
			title: 'Profile',
			icon: User,
			href: user.user ? LINKS.USERS.ID(user.user!.id) : null
		},
		{
			title: 'Artist Dashboard',
			icon: Disc_3,
			href: LINKS.ARTIST_DASHBOARD
		}
	]);
	const isStandalone = browser
		? window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			(window.navigator as any).standalone === true ||
			!('deferredInstallPrompt' in navigator)
		: false;

	let { onDisconnect }: { onDisconnect?: VoidFunction } = $props();
</script>

<header class="bg-background w-full border-b" style="view-transition-name: none;">
	<div class="flex h-14 items-center justify-between px-4">
		<!-- Logo -->
		<a href="/" class="mr-4 flex items-center">
			<img src="/favicon.svg" width="32" height="32" alt="prettygood.music logo" />
		</a>

		<div class="flex w-full items-center md:max-w-sm md:flex-1">
			<EnhancedSearchBar showButton={false}></EnhancedSearchBar>
		</div>

		<!-- User Section -->
		<div class="ml-2 flex items-center space-x-4">
			<!-- TODO: don't show if already installed -->
			{#if !isStandalone}
				<Button href={LINKS.INSTALL} size="sm" variant="ghost" class="text-muted-foreground">
					<DownloadIcon></DownloadIcon>
					Install App</Button
				>
			{/if}

			{#if isConnected}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={cn(buttonVariants({ size: 'icon' }), 'rounded-full')}>
						{userInitials}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="end">
						<DropdownMenu.Group>
							{#each dropdownContent as link}
								<DropdownMenu.Item>
									<a href={link.href} class="flex w-full items-center">
										<link.icon class="mr-2 size-4" />
										<span>{link.title}</span>
									</a>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item
								onclick={async () => {
									onDisconnect?.();
								}}>Disconnect</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button href={LINKS.LOGIN} class="hidden md:block">Connect</Button>
				<Button href={LINKS.LOGIN} class="md:hidden" size="icon">
					<CircleUserIcon></CircleUserIcon>
				</Button>
			{/if}
		</div>
	</div>
</header>
