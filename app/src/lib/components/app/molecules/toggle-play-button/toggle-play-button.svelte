<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import { getPlayerContext } from '$lib/state/player.svelte';

	const playerState = getPlayerContext();
</script>

<Button
	variant="default"
	size="lg"
	class="flex h-14 w-14 items-center justify-center rounded-full p-0"
	onclick={() => playerState.togglePlayPause()}
>
	{#if playerState.isPlaying}
		<PauseIcon class="h-6 w-6" />
	{:else}
		<PlayIcon class="ml-1 h-6 w-6" />
	{/if}
</Button>
