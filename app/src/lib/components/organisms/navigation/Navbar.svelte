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

	const user = getUserContext();

	let isConnected = $derived.by(() => user.user);
	let userInitials = $derived.by(() => {
		if (user.user) {
			const split = user.user.username.split(' ');

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

	const dropdownContent = [
		{
			title: 'Profile',
			icon: User,
			href: LINKS.PROFILE
		}
	];
	const isStandalone = browser
		? window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			(window.navigator as any).standalone === true
		: false;
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
			<Button size="icon" href={LINKS.HOME} variant="ghost" class="text-muted-foreground">
				<HomeIcon></HomeIcon>
			</Button>
			<EnhancedSearchBar showButton={false}></EnhancedSearchBar>
		</div>

		<!-- User Section -->
		<div class="flex items-center space-x-4">
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
							<DropdownMenu.Item onclick={() => console.log('disconnect')}
								>Disconnect</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button href={LINKS.LOGIN}>Connect</Button>
			{/if}
		</div>
	</div>
</header>
