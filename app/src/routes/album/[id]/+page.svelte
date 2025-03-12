<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import type { Album, Artist, Track } from '$lib/types/player';
	
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import MoreHorizontalIcon from 'lucide-svelte/icons/more-horizontal';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import MusicIcon from 'lucide-svelte/icons/music';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import ShuffleIcon from 'lucide-svelte/icons/shuffle';
	
	// Page data from load function
	let { data } = $props();
	
	// Get data from the load function
	let album = $state<Album>(data.album);
	let artist = $state<Artist>(data.artist);
	let tracks = $state<Track[]>(data.tracks);
	let relatedAlbums = $state<Album[]>(data.relatedAlbums);
	
	// Using Svelte 5 runes for state management
	let isPlaying = $state(false);
	let isLiked = $state(false);
	let totalDuration = $derived(tracks.reduce((total, track) => total + track.duration, 0));
	
	// Function to format date in human-readable format
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		}).format(date);
	}
	
	// Function to format total duration in hours and minutes
	function formatTotalDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		
		if (hours > 0) {
			return `${hours} hr ${minutes} min`;
		} else {
			return `${minutes} min`;
		}
	}
	
	// Format individual track duration
	function formatTrackDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
	
	// Handle play/pause for the whole album
	function togglePlay() {
		isPlaying = !isPlaying;
		// In a real app, this would trigger the audio player
		console.log(`${isPlaying ? 'Playing' : 'Paused'} album: ${album.title}`);
	}
	
	// Handle shuffle play
	function shufflePlay() {
		console.log(`Shuffle playing album: ${album.title}`);
		isPlaying = true;
	}
	
	// Handle like
	function toggleLike() {
		isLiked = !isLiked;
		console.log(`${isLiked ? 'Liked' : 'Unliked'} album: ${album.title}`);
	}
	
	// Handle share
	function shareAlbum() {
		console.log(`Sharing album: ${album.title}`);
	}
	
	// Handle more options
	function showMoreOptions() {
		console.log(`Showing more options for album: ${album.title}`);
	}
</script>

<svelte:head>
	<title>{album.title} by {artist.artist_name} | prettygood.music</title>
	<meta
		name="description"
		content="Listen to {album.title} by {artist.artist_name} on prettygood.music"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Album Artwork and Primary Actions -->
		<div class="flex flex-col items-center lg:items-start">
			<div class="mb-6 overflow-hidden rounded-lg shadow-xl">
				<img
					src={album.cover_url || '/images/default-album.jpg'}
					alt={album.title}
					class="aspect-square h-64 w-64 object-cover sm:h-80 sm:w-80"
				/>
			</div>
			
			<div class="mb-6 w-full text-center lg:text-left">
				<h1 class="mb-1 text-2xl font-bold md:text-3xl">{album.title}</h1>
				<div class="flex flex-col items-center lg:flex-row lg:items-center lg:gap-2">
					<a
						href="/artist/{artist.id}"
						class="text-lg text-primary hover:underline"
					>
						{artist.artist_name}
					</a>
					<div class="hidden text-muted-foreground lg:block">•</div>
					<div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground lg:mt-0">
						<CalendarIcon class="h-4 w-4" />
						<span>{formatDate(album.release_date)}</span>
					</div>
				</div>
				
				<div class="mt-2 flex items-center justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
					<div class="flex items-center gap-1">
						<MusicIcon class="h-4 w-4" />
						<span>{album.track_count} tracks</span>
					</div>
					<div>•</div>
					<div class="flex items-center gap-1">
						<ClockIcon class="h-4 w-4" />
						<span>{formatTotalDuration(totalDuration)}</span>
					</div>
				</div>
			</div>
			
			<div class="mb-8 flex w-full items-center justify-center space-x-4 lg:justify-start">
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
					variant="outline"
					size="sm"
					class="gap-2"
					onclick={shufflePlay}
				>
					<ShuffleIcon class="h-4 w-4" />
					Shuffle
				</Button>
				
				<Button
					variant={isLiked ? "default" : "ghost"}
					size="icon"
					class="rounded-full"
					onclick={toggleLike}
				>
					<HeartIcon class="h-5 w-5" />
				</Button>
				
				<Button
					variant="ghost"
					size="icon"
					class="rounded-full"
					onclick={shareAlbum}
				>
					<ShareIcon class="h-5 w-5" />
				</Button>
				
				<Button
					variant="ghost"
					size="icon"
					class="rounded-full"
					onclick={showMoreOptions}
				>
					<MoreHorizontalIcon class="h-5 w-5" />
				</Button>
			</div>
			
			<!-- Album Release Information -->
			<div class="w-full rounded-md bg-muted/30 p-4">
				<h3 class="mb-2 font-medium">About this album</h3>
				<div class="grid gap-2 text-sm">
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground">Released</span>
						<span>{formatDate(album.release_date)}</span>
					</div>
					
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground">Tracks</span>
						<span>{album.track_count}</span>
					</div>
					
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground">Duration</span>
						<span>{formatTotalDuration(totalDuration)}</span>
					</div>
					
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground">Label</span>
						<span>Bytecode Records</span>
					</div>
					
					{#if album.genres && album.genres.length > 0}
						<div class="mt-2 flex flex-wrap gap-2">
							{#each album.genres as genre}
								<Badge variant="secondary" class="text-xs">{genre}</Badge>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		
		<!-- Track List and Artist Info -->
		<div class="lg:col-span-2">
			<!-- Track List -->
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold">Tracks</h2>
				<div class="space-y-1">
					{#each tracks as track, i}
						<TrackItem track={track} index={i} />
					{/each}
				</div>
			</div>
			
			<Separator class="my-8" />
			
			<!-- Artist Section -->
			<div>
				<h2 class="mb-4 text-xl font-bold">Artist</h2>
				<a
					href="/artist/{artist.id}"
					class="group flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-muted/50"
				>
					<Avatar class="h-16 w-16">
						<AvatarImage src={artist.avatar_url || ''} alt={artist.artist_name} />
						<AvatarFallback>{artist.artist_name.substring(0, 2)}</AvatarFallback>
					</Avatar>
					<div>
						<h4 class="font-medium group-hover:text-primary group-hover:underline">
							{artist.artist_name}
						</h4>
						{#if artist.bio}
							<p class="line-clamp-2 max-w-md text-sm text-muted-foreground">
								{artist.bio}
							</p>
						{/if}
					</div>
				</a>
			</div>
			
			<!-- More Albums by Artist -->
			{#if relatedAlbums && relatedAlbums.length > 0}
				<div class="mt-8">
					<h2 class="mb-4 text-xl font-bold">More from {artist.artist_name}</h2>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{#each relatedAlbums as relatedAlbum}
							<a href="/album/{relatedAlbum.id}" class="group">
								<div class="overflow-hidden rounded-md">
									<img 
										src={relatedAlbum.cover_url || '/images/default-album.jpg'} 
										alt={relatedAlbum.title}
										class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
									/>
								</div>
								<div class="mt-2">
									<h3 class="font-medium group-hover:text-primary group-hover:underline">{relatedAlbum.title}</h3>
									<p class="text-xs text-muted-foreground">
										{new Date(relatedAlbum.release_date).getFullYear()} • {relatedAlbum.track_count} tracks
									</p>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
