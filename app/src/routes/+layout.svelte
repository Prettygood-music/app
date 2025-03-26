<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';

	import { browser } from '$app/environment';
	import MobilePlayerBar from '$lib/components/app/organisms/player-bar/mobile-player-bar.svelte';
	import PlayerBar from '$lib/components/app/organisms/player-bar/player-bar.svelte';
	import ConnectionStatus from '$lib/components/app/molecules/connection-status/connection-status.svelte';
	import InstallPrompt from '$lib/components/app/molecules/install-prompt/install-prompt.svelte';
	import { PlayerState, setPlayerContext } from '$lib/state/player.svelte';
	import type { Track } from '$lib/types';
	import Navbar from '$lib/components/organisms/navigation/Navbar.svelte';

	import { makeClient } from '$lib/api';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	// TODO: we'll want a context for this
	const client = browser ? makeClient(window.fetch) : null!;

	let { children } = $props();

	// Don't show install prompt on the install page itself
	const showInstallPrompt = $derived(browser && page.route.id !== '/install');

	if (browser) {
		const playerState = new PlayerState();
		const track: Track = {
			id: '1',
			title: 'Song name desu',
			artist_id: 'john-fella',
			artist_name: 'John Fella',
			playback_url: '/media/audio/placeholder.mp3',
			// TODO: we need to store the actual duration of the song somewhere
			duration: 200,
			genres: ['electronic', 'heavy metal'],
			play_count: 10,
			published_at: '2023-01-01T00:00:00Z',
			album_id: null,
			album_name: 'Meteora',
			cover_url: 'https://i.scdn.co/image/ab67616d000048515f1f51d14e8bea89484ecd1b'
		};

		playerState.currentTrack = track;
		//playerState.playTrack(track);
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
</script>

<ParaglideJS {i18n}>
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
			<InstallPrompt variant="floating" />
			{/if}
			-->
	{/if}
</ParaglideJS>

<style global>
</style>
