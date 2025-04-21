<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import type { Track } from '$lib/types';
	import { getAnalyticsContext } from '$lib/services';

	let { track }: { track: Track } = $props();

	const playerState = getPlayerContext();
	const analytics = getAnalyticsContext();
    
	const isCurrentTrack = $derived.by(() => {
		const playerTrack = playerState.currentTrack;
		return playerTrack && playerTrack.id === track.id;
	});
	let isPlaying = $derived.by(() => {
		return isCurrentTrack && playerState.isPlaying;
	});

	function togglePlay() {
		analytics.onTrackPlay(track.id);
		if (isCurrentTrack) {
			playerState.togglePlayPause();
		} else {
			playerState.playTrack(track);
		}
	}
</script>

<Button
	variant="default"
	size="lg"
	class="flex h-14 w-14 items-center justify-center rounded-full p-0"
	onclick={togglePlay}
>
	{#if isPlaying}
		<PauseIcon class="h-6 w-6" />
	{:else}
		<PlayIcon class="ml-1 h-6 w-6" />
	{/if}
</Button>
