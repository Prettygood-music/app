<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';

	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import { browser } from '$app/environment';
	import { PlayerState, setPlayerContext } from '$lib/state/player.svelte';
	import type { Track } from '$lib/types';
	import PlayerBar from '$lib/components/app/organisms/player-bar/player-bar.svelte';

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
	{@render children()}

	<!-- 
	<Drawer.Root>
		<Drawer.Trigger class="sticky bottom-0 h-[80px] w-full bg-red-500">Show music</Drawer.Trigger>
		<Drawer.Content>
			<div>
				<Drawer.Header>
					<Drawer.Title>Song name desu</Drawer.Title>
				</Drawer.Header>
				<div>
					Actual content

					<div>
						Player

						{#if isPlaying}
							<Button onclick={() => audio.pause()}>
								<PauseIcon></PauseIcon>
							</Button>
						{:else}
							<Button onclick={() => audio.play()}>
								<PlayIcon></PlayIcon>
							</Button>
						{/if}
					</div>
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
	 -->
	<PlayerBar></PlayerBar>
</ParaglideJS>
