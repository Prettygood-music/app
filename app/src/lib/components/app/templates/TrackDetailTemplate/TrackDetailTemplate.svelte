<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { page } from '$app/state';
	import { getAnalyticsContext } from '$lib/services';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import type { Album, Artist, Track, TrackWithDetails } from '$lib/types';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import MusicIcon from 'lucide-svelte/icons/music';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import LikeButton from '../../atoms/like-button/LikeButton.svelte';
	import PlayTrack from '../../atoms/play-button/PlayTrack.svelte';
	import AddPlaylist from '../../molecules/add-playlist/add-playlist.svelte';
	import ImageFallback from '../../../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';

	let {
		// Track details
		track,
		artist,
		album,

		// Recommended tracks
		recommendedTracks = [],

		initialIsLiked = false
	}: {
		track: TrackWithDetails;
		artist: Artist;
		album: Album;
		recommendedTracks: Track[];
		initialIsLiked: boolean;
	} = $props();

	const analytics = getAnalyticsContext();

	// Function to format date in human-readable format
	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}).format(date);
		} catch (error) {
			return dateString;
		}
	}

	// Function to format duration in MM:SS format
	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Handle share
	async function shareTrack() {
		// onShare(track);
		analytics.onTrackShare(track.id);
		await navigator.share({
			url: page.url.toString(),
			title: page.state.title || undefined
		});
	}
</script>

<div class="overflow-y-auto">
	<div class="container mx-auto py-8 md:px-4">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Track Artwork and Primary Actions -->
			<div class="flex flex-col items-center lg:items-start">
				<div class="mb-6 overflow-hidden shadow-xl">
					
					<ImageFallback
						src={track.cover_url || album.cover_url}
						name={track.title!}
						class="h-64 w-64 rounded-lg border object-cover sm:h-80 sm:w-80"
						style="--view-transition-tag:track-image-{track.id};"
					></ImageFallback>
					<!-- 
					<img
						src={track.cover_url || '/images/default-track.jpg'}
						alt={track.title}
						class="aspect-square h-64 w-64 rounded-lg border object-cover sm:h-80 sm:w-80"
						style="--view-transition-tag:track-image-{track.id};"
					/>
					 -->
				</div>

				<div class="flex w-full items-center justify-center space-x-4 lg:justify-start">
					<PlayTrack {track} />
					<!-- 
					<Button
						variant={isLiked ? 'default' : 'ghost'}
						size="icon"
						class="rounded-full"
						onclick={toggleLike}
						disabled
					>
						<HeartIcon class="h-5 w-5" />
					</Button>
					 -->
					<LikeButton id={track.id} isLiked={initialIsLiked} kind="track"></LikeButton>

					<Button variant="ghost" size="icon" class="rounded-full" onclick={shareTrack}>
						<ShareIcon class="h-5 w-5" />
					</Button>
					<AddPlaylist {track}></AddPlaylist>

					<!-- 
						<Button variant="ghost" size="icon" class="rounded-full" onclick={showMoreOptions}>
							<MoreHorizontalIcon class="h-5 w-5" />
						</Button>
						-->
				</div>
			</div>

			<!-- Track Details -->
			<div class="lg:col-span-2">
				<div class="mb-6">
					<div class="space-y-1">
						<h1 class="text-3xl font-bold md:text-4xl">{track.title}</h1>
						<div class="flex items-center">
							<a href="/artist/{artist.id}" class="text-primary text-lg hover:underline">
								{artist.display_name || artist.artist_name}
							</a>
						</div>
					</div>

					<!-- Track Metadata -->
					<div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
						<div class="flex items-center gap-2">
							<ClockIcon class="text-muted-foreground h-4 w-4" />
							<span>{formatDuration(track.duration)}</span>
						</div>

						<div class="flex items-center gap-2">
							<CalendarIcon class="text-muted-foreground h-4 w-4" />
							<span>{formatDate(track.release_date)}</span>
						</div>

						<div class="flex items-center gap-2">
							<MusicIcon class="text-muted-foreground h-4 w-4" />
							<span>{(track.play_count || 0).toLocaleString()} plays</span>
						</div>
					</div>

					<!-- Genre Tags -->
					{#if track.genre && track.genre.length > 0}
						<div class="mt-4 flex flex-wrap gap-2">
							{#each track.genre as genre}
								<Badge variant="secondary">{genre}</Badge>
							{/each}
						</div>
					{/if}

					<!-- Album Section (if track belongs to an album) -->
					{#if album}
						<div class="mt-6">
							<h3 class="mb-3 text-lg font-medium">From the album</h3>
							<a
								href="/album/{album.id}"
								class="hover:bg-muted/50 group flex items-start gap-4 rounded-md p-2 transition-colors"
							>
								<div class="h-16 w-16 overflow-hidden rounded-md">
									<img
										src={album.cover_url || '/images/default-album.jpg'}
										alt={album.title}
										class="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h4 class="group-hover:text-primary font-medium group-hover:underline">
										{album.title}
									</h4>
									<p class="text-muted-foreground text-sm">
										{formatDate(album.release_date)} • {album.tracks?.length || 0} tracks
									</p>
								</div>
							</a>
						</div>
					{/if}

					<Separator class="my-6" />

					<!-- Artist Section -->
					<div>
						<h3 class="mb-3 text-lg font-medium">Artist</h3>
						<a
							href="/artist/{artist.id}"
							class="hover:bg-muted/50 group flex items-center gap-4 rounded-md p-2 transition-colors"
						>
							<Avatar class="h-16 w-16">
								<AvatarImage src={artist.avatar || ''} alt={artist.artist_name} />
								<AvatarFallback>{artist.artist_name.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div>
								<h4 class="group-hover:text-primary font-medium group-hover:underline">
									{artist.artist_name}
								</h4>
								{#if artist.bio}
									<p class="text-muted-foreground line-clamp-2 max-w-md text-sm">
										{artist.bio}
									</p>
								{/if}
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Recommended Tracks Section -->
		{#if recommendedTracks && recommendedTracks.length > 0}
			<div class="mt-8">
				<h2 class="mb-4 text-2xl font-bold">You might also like</h2>
				<div class="space-y-1">
					{#each recommendedTracks as recTrack}
						<TrackItem track={recTrack} coverFallback={album.cover_url} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
