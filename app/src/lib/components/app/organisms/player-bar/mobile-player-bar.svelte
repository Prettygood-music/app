<script lang="ts">
	import PauseIcon from 'lucide-svelte/icons/pause';
	import PlayIcon from 'lucide-svelte/icons/play';

	import Button from '$lib/components/ui/button/button.svelte';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import ProgressIndicator from '../../atoms/progress-indicator/progress-indicator.svelte';
	import Thumbnail from '../../atoms/thumbnail/thumbnail.svelte';

	const playerState = getPlayerContext();
</script>

{#if playerState && playerState.currentTrack}
	{@const currentTrack = playerState.currentTrack}

	<div class="bg-background fixed bottom-0 z-10 w-full rounded border px-2 pt-2 lg:hidden">
		<div class="flex items-center">
			
			<Thumbnail coverURL={currentTrack.cover_url} name={currentTrack.title} ></Thumbnail>
			<div class="ml-2 flex-1">
				<div class="text-sm">
					{currentTrack.title}
				</div>
				<a
					href="/artist/{currentTrack.artist_id}"
					class="text-muted-foreground mt-0.5 text-xs hover:underline"
				>
					{currentTrack.artist.name}
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
