<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { AlbumCard } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import MoreHorizontalIcon from 'lucide-svelte/icons/more-horizontal';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import MusicIcon from 'lucide-svelte/icons/music';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import { getPlayerContext } from '$lib/state/player.svelte.js';
	import type { Album, Artist, Track } from '$lib/types/index.js';

	// Page data from load function
	let { data } = $props();
	const playerState = getPlayerContext();

	// Using Svelte 5 runes for state management
	let isPlaying = $state(false);
	let isLiked = $state(false);

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

	// Handle play/pause
	function togglePlay() {
		isPlaying = !isPlaying;
		// In a real app, this would trigger the audio player
		console.log(`${isPlaying ? 'Playing' : 'Paused'} track: ${data.track.title}`);
	}

	// Handle like
	function toggleLike() {
		isLiked = !isLiked;
		console.log(`${isLiked ? 'Liked' : 'Unliked'} track: ${data.track.title}`);
	}

	// Handle share
	function shareTrack() {
		console.log(`Sharing track: ${data.track.title}`);
	}

	// Handle more options
	function showMoreOptions() {
		console.log(`Showing more options for track: ${data.track.title}`);
	}

	console.log(data.track.id);
</script>

<svelte:head>
	<title>{data.track.title} by {data.artist.display_name} | prettygood.music</title>
	<meta
		name="description"
		content="Listen to {data.track.title} by {data.artist.display_name} on prettygood.music"
	/>
</svelte:head>

<div class=" overflow-y-auto">
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Track Artwork and Primary Actions -->
			<div class="flex flex-col items-center lg:items-start">
				<div class="mb-6 overflow-hidden shadow-xl">
					<img
						src={data.track.cover_url || '/images/default-track.jpg'}
						alt={data.track.title}
						class="aspect-square h-64 w-64 rounded-lg object-cover sm:h-80 sm:w-80"
						style="--view-transition-tag:track-image-{data.track.id};"
					/>
				</div>

				<div class="flex w-full items-center justify-center space-x-4 lg:justify-start">
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

					<Button
						variant={isLiked ? 'default' : 'ghost'}
						size="icon"
						class="rounded-full"
						onclick={toggleLike}
					>
						<HeartIcon class="h-5 w-5" />
					</Button>

					<Button variant="ghost" size="icon" class="rounded-full" onclick={shareTrack}>
						<ShareIcon class="h-5 w-5" />
					</Button>

					<Button variant="ghost" size="icon" class="rounded-full" onclick={showMoreOptions}>
						<MoreHorizontalIcon class="h-5 w-5" />
					</Button>
				</div>
			</div>

			<!-- Track Details -->
			<div class="lg:col-span-2">
				<div class="mb-6 space-y-2">
					<div class="space-y-1">
						<h1 class="text-3xl font-bold md:text-4xl">{data.track.title}</h1>
						<div class="flex items-center">
							<a href="/artist/{data.artist.id}" class="text-primary text-lg hover:underline">
								{data.artist.display_name}
							</a>
						</div>
					</div>

					<!-- Track Metadata -->
					<div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
						<div class="flex items-center gap-2">
							<ClockIcon class="text-muted-foreground h-4 w-4" />
							<span>{formatDuration(data.track.duration)}</span>
						</div>

						<div class="flex items-center gap-2">
							<CalendarIcon class="text-muted-foreground h-4 w-4" />
							<span>{formatDate(data.track.published_at)}</span>
						</div>

						<div class="flex items-center gap-2">
							<MusicIcon class="text-muted-foreground h-4 w-4" />
							<span>{data.track.play_count.toLocaleString()} plays</span>
						</div>
					</div>

					<!-- Genre Tags -->
					{#if data.track.genres && data.track.genres.length > 0}
						<div class="mt-4 flex flex-wrap gap-2">
							{#each data.track.genres as genre}
								<Badge variant="secondary">{genre}</Badge>
							{/each}
						</div>
					{/if}

					<!-- Album Section (if track belongs to an album) -->
					{#if data.album}
						<div class="mt-6">
							<h3 class="mb-3 text-lg font-medium">From the album</h3>
							<a
								href="/album/{data.album.id}"
								class="hover:bg-muted/50 group flex items-start gap-4 rounded-md p-2 transition-colors"
							>
								<div class="h-16 w-16 overflow-hidden rounded-md">
									<img
										src={data.album.cover_url || '/images/default-album.jpg'}
										alt={data.album.title}
										class="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h4 class="group-hover:text-primary font-medium group-hover:underline">
										{data.album.title}
									</h4>
									<p class="text-muted-foreground text-sm">
										{formatDate(data.album.release_date)} • {data.album.track_count} tracks
									</p>
								</div>
							</a>
						</div>
					{/if}

					<Separator class="my-6" />

					<!-- Artist Section -->
					<div>
						<h3 class="mb-4 text-lg font-medium">Artist</h3>
						<a
							href="/artist/{data.artist.id}"
							class="hover:bg-muted/50 group flex items-center gap-4 rounded-md p-2 transition-colors"
						>
							<Avatar class="h-16 w-16">
								<AvatarImage src={data.artist.avatar_url || ''} alt={data.artist.display_name} />
								<AvatarFallback>{data.artist.display_name.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div>
								<h4 class="group-hover:text-primary font-medium group-hover:underline">
									{data.artist.display_name}
								</h4>
								{#if data.artist.bio}
									<p class="text-muted-foreground line-clamp-2 max-w-md text-sm">
										{data.artist.bio}
									</p>
								{/if}
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Recommended Tracks Section -->
		{#if data.recommendedTracks && data.recommendedTracks.length > 0}
			<div class="mt-12">
				<h2 class="mb-6 text-2xl font-bold">You might also like</h2>
				<div class="space-y-1">
					{#each data.recommendedTracks as recTrack}
						<TrackItem track={recTrack} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
