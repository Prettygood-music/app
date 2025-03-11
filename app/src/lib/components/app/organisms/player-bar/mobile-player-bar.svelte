<script lang="ts">
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import SkipBackIcon from 'lucide-svelte/icons/skip-back';
	import SkipForwardIcon from 'lucide-svelte/icons/skip-forward';
	import ShuffleIcon from 'lucide-svelte/icons/shuffle';
	import RepeatIcon from 'lucide-svelte/icons/repeat-1';

	import PlaylistIcon from 'lucide-svelte/icons/list-music';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import VolumeIcon from '../../atoms/volume-icon/volume-icon.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Thumbnail from '../../atoms/thumbnail/thumbnail.svelte';
	import ProgressIndicator from '../../atoms/progress-indicator/progress-indicator.svelte';

	const playerState = getPlayerContext();
</script>

{#if playerState && playerState.currentTrack}
	{@const currentTrack = playerState.currentTrack}

	<div class="bg-background fixed bottom-1 z-10 w-full rounded border px-2 pt-2 lg:hidden">
		<div class="flex items-center">
			<Thumbnail coverURL={currentTrack.cover_url}></Thumbnail>
			<div class="ml-2 flex-1">
				<div class="text-sm">
					{currentTrack.title}
				</div>
				<a
					href="/artist/{currentTrack.artist_id}"
					class="text-muted-foreground mt-0.5 text-xs hover:underline"
				>
					{currentTrack.artist_name}
				</a>
			</div>

			<div>
				<Button size="icon" onclick={() => playerState.togglePlayPause()}>
					{#if playerState.isPlaying}
						<PauseIcon></PauseIcon>
					{:else}
						<PlayIcon></PlayIcon>
					{/if}
				</Button>
			</div>
		</div>

		<div class="mt-1">
			<ProgressIndicator progress={playerState.progress}></ProgressIndicator>
		</div>
	</div>
{/if}
