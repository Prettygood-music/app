<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	import { browser } from '$app/environment';
	import MobilePlayerBar from '$lib/components/app/organisms/player-bar/mobile-player-bar.svelte';
	import PlayerBar from '$lib/components/app/organisms/player-bar/player-bar.svelte';
	import ConnectionStatus from '$lib/components/app/molecules/connection-status/connection-status.svelte';
	import { PlayerState, setPlayerContext } from '$lib/state/player.svelte';
	import Navbar from '$lib/components/organisms/navigation/Navbar.svelte';

	import { onNavigate } from '$app/navigation';
	import Seo from '$lib/components/app/organisms/player-bar/seo.svelte';
	import { setContext } from 'svelte';
	import { setUserContext, UserState } from '$lib/state/user/user.svelte';

	let { children, data } = $props();

	const userState = new UserState(data.user);
	setUserContext(userState);

	// Don't show install prompt on the install page itself
	if (browser) {
		const playerState = new PlayerState();

		setPlayerContext(playerState);
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect(() => {
		userState.onAuthChange(data.user);
	});
</script>

<Seo></Seo>

<ParaglideJS {i18n}>
	<Toaster />

	<div class="bg-background flex h-screen flex-col" id="content">
		<Navbar />
		<main class="flex flex-1 flex-col overflow-y-hidden">
			{@render children()}
		</main>
		<div class="shrink-0">
			<PlayerBar></PlayerBar>
		</div>
	</div>

	{#if browser}
		<ConnectionStatus />
		<!-- 
			{#if showInstallPrompt}
			<InstallPrompt variant="banner" />
			{/if}
			-->
	{/if}
</ParaglideJS>

<style global>
</style>
