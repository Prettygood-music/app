<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { getPlayerContext, PlayerState } from '$lib/state/player.svelte';
	import PlaylistIcon from 'lucide-svelte/icons/list-music';
	import ImageFallback from '../../../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';
	import { PlayIcon } from 'lucide-svelte';

	let { queue }: { queue: PlayerState['queue'] } = $props();
	const playerState = getPlayerContext();
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>
		<PlaylistIcon></PlaylistIcon>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Current tracks</Sheet.Title>
			<Sheet.Description>
				See all queued tracks.
			</Sheet.Description>
		</Sheet.Header>
		<div class="mt-6 grid gap-4 py-4">
			<h3 class="text-lg font-medium">Upcoming</h3>
			{#each queue as track}
				<button
					class="group flex items-center space-x-2 text-left"
					onclick={() => playerState.playTrack(track)}
				>
					<div class="relative ">
						<ImageFallback
							src={track.cover_url}
							name={track.title}
							class="aspect-square h-14 w-14 flex-shrink rounded-md border"
						></ImageFallback>
						<div class="absolute inset-0 group-hover:bg-muted/60 duration-300 flex items-center  justify-center">
							<PlayIcon class="hidden group-hover:block duration-300 transition-all"></PlayIcon>
						</div>
					</div>

					<div>
						<div>
							{track.title}
						</div>
						<div class="text-muted-foreground text-xs">
							{track.artist_id}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>
