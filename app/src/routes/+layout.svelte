<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';

	import { browser } from '$app/environment';
	import MobilePlayerBar from '$lib/components/app/organisms/player-bar/mobile-player-bar.svelte';
	import PlayerBar from '$lib/components/app/organisms/player-bar/player-bar.svelte';
	import { PlayerState, setPlayerContext } from '$lib/state/player.svelte';
	import type { Track } from '$lib/types';
	import Navbar from '$lib/components/organisms/navigation/Navbar.svelte';

	let { children } = $props();

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
			album_name: "Meteora",
			cover_url: "https://i.scdn.co/image/ab67616d000048515f1f51d14e8bea89484ecd1b"
		};

		playerState.currentTrack = track;
		//playerState.playTrack(track);
		setPlayerContext(playerState);
	}
</script>

<ParaglideJS {i18n}>
	<div class="flex flex-col min-h-screen">
		<Navbar />
		<main class="flex-1">
			{@render children()}
		</main>
		<PlayerBar></PlayerBar>
		<MobilePlayerBar></MobilePlayerBar>
	</div>
</ParaglideJS>