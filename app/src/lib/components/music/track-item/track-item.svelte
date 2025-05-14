<script lang="ts">
	import LikeButton from '$lib/components/app/atoms/like-button/LikeButton.svelte';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import type { TrackWithDetails } from '$lib/types/player';
	import { formatDuration } from '$lib/utils';
	import PlayCircle from 'lucide-svelte/icons/play-circle';
	import ImageFallback from '../../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';

	// Props
	let {
		track,
		index,
		coverFallback,
		showIndex = true
	}: {
		track: TrackWithDetails;
		index?: number;
		showIndex?: boolean;
		coverFallback?: string | null;
	} = $props();

	// Function to format play count numbers
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		} else {
			return num.toString();
		}
	}

	const playerState = getPlayerContext();

	console.log(track);
</script>

<div
	class="hover:bg-muted/50 group flex items-center justify-between rounded-md p-2 transition-colors"
>
	<div class="flex items-center gap-3">
		{#if showIndex && index !== undefined}
			<div class="text-muted-foreground flex w-8 items-center justify-center">
				<span class="group-hover:hidden">{index + 1}</span>
				<PlayCircle
					class="text-primary hidden h-6 w-6 cursor-pointer group-hover:block"
					onclick={() => playerState.playTrack({ ...track, artist: { name: track.artist_name } })}
				/>
			</div>
		{/if}

		<ImageFallback
			src={track.cover_url}
			class="h-12 w-12 rounded-md"
			style="--view-transition-tag:track-image-{track.id};"
			name={track.title!}
		></ImageFallback>
		<div>
			<a
				href="/track/{track.id}"
				class="hover:text-primary max-w-[200px] truncate font-medium hover:underline md:max-w-md"
			>
				{track.title}
			</a>
			<p class="text-muted-foreground text-sm">{formatNumber(track?.play_count || 0)} plays</p>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<div class="hidden group-hover:block">
			<LikeButton id={track.id} kind={'track'}></LikeButton>
		</div>
		<!-- 
		<Button
			size="icon"
			variant="ghost"
			class="hidden h-8 w-8 rounded-full group-hover:flex"
			onclick={onLikeClick}
		>
			<HeartIcon class="h-4 w-4" />
		</Button>
		 -->
		<span class="text-muted-foreground w-12 text-right text-sm">
			{formatDuration(track.duration)}
		</span>
	</div>
</div>
