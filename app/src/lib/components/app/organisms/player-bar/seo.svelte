<script lang="ts">
	import { getPlayerContext } from '$lib/state/player.svelte';

	const playerState = getPlayerContext();

	let currentTrack = $derived.by(() => {
		if (playerState && playerState.isPlaying && playerState.currentTrack) {
			return playerState.currentTrack;
		} else {
			return null;
		}
	});

	$effect(() => {
		if (currentTrack) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: currentTrack.title,
					artist: currentTrack.artist_id,
					album: currentTrack.album_id || undefined,
					artwork: currentTrack.cover_url
						? [{ src: currentTrack.cover_url, sizes: '512x512', type: 'image/png' }]
						: []
				});
			}
		}
	});
</script>

<svelte:head>
	{#if currentTrack}
		<title>{currentTrack.title}</title>
	{/if}
</svelte:head>
