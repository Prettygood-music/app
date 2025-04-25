<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
	import type { Playlist, Track, User } from '$lib/types/player';
	
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import MoreHorizontalIcon from 'lucide-svelte/icons/more-horizontal';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import MusicIcon from 'lucide-svelte/icons/music';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import ShuffleIcon from 'lucide-svelte/icons/shuffle';
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import UserIcon from 'lucide-svelte/icons/user';
	
	// Page data from load function
	let { data } = $props();
	
	// Get data from the load function
	let playlist = $state<Playlist>(data.playlist);
	let creator = $state<User>(data.creator);
	let tracks = $state<Track[]>(data.tracks);
	let isOwner = $state<boolean>(data.isOwner);
	let similarPlaylists = $state<Playlist[]>(data.similarPlaylists);
	
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
	
	// Function to format relative time (e.g., "2 days ago")
	function formatRelativeTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) {
			return "Today";
		} else if (diffDays === 1) {
			return "Yesterday";
		} else if (diffDays < 30) {
			return `${diffDays} days ago`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return `${months} ${months === 1 ? 'month' : 'months'} ago`;
		} else {
			const years = Math.floor(diffDays / 365);
			return `${years} ${years === 1 ? 'year' : 'years'} ago`;
		}
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
	
	// Handle play/pause for the whole playlist
	function togglePlay() {
		isPlaying = !isPlaying;
		// In a real app, this would trigger the audio player
		console.log(`${isPlaying ? 'Playing' : 'Paused'} playlist: ${playlist.title}`);
	}
	
	// Handle shuffle play
	function shufflePlay() {
		console.log(`Shuffle playing playlist: ${playlist.title}`);
		isPlaying = true;
	}
	
	// Handle like
	function toggleLike() {
		isLiked = !isLiked;
		console.log(`${isLiked ? 'Liked' : 'Unliked'} playlist: ${playlist.title}`);
	}
	
	// Handle share
	function sharePlaylist() {
		console.log(`Sharing playlist: ${playlist.title}`);
	}
	
	// Handle edit playlist
	function editPlaylist() {
		window.location.href = `/playlist/${playlist.id}/edit`;
	}
	
	// Generate a gradient background based on the playlist title
	function generateGradient(title: string): string {
		// Simple hash function to generate a consistent color from a string
		const hash = title.split('').reduce((acc, char) => {
			return char.charCodeAt(0) + ((acc << 5) - acc);
		}, 0);
		
		const h1 = Math.abs(hash % 360);
		const h2 = (h1 + 40) % 360;
		
		return `linear-gradient(135deg, hsl(${h1}, 70%, 60%), hsl(${h2}, 70%, 50%))`;
	}
	
	// Default cover image or gradient background
	let coverBackground = $derived(
		playlist.cover_url 
		? `url(${playlist.cover_url})` 
		: generateGradient(playlist.title)
	);
</script>

<svelte:head>
	<title>{playlist.title} | prettygood.music</title>
	<meta
		name="description"
		content="Listen to {playlist.title} playlist on prettygood.music"
	/>
</svelte:head>

<div class="pb-16">
	<!-- Playlist Header with Cover Image or Gradient -->
	<div class="relative min-h-[200px] md:min-h-[300px] overflow-hidden">
		<div 
			class="absolute inset-0 bg-cover bg-center" 
			style="background-image: {coverBackground}; filter: blur(40px) opacity(0.6);"
		></div>
		<div class="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
		
		<div class="container relative mx-auto flex flex-col items-center px-4 py-8 md:flex-row md:items-end">
			<!-- Playlist Artwork -->
			<div class="mb-6 h-48 w-48 overflow-hidden rounded-lg shadow-xl md:mb-0 md:h-56 md:w-56">
				{#if playlist.cover_url}
					<img
						src={playlist.cover_url}
						alt={playlist.title}
						class="h-full w-full object-cover"
					/>
				{:else}
					<div 
						class="flex h-full w-full items-center justify-center text-6xl font-bold text-white" 
						style="background: {generateGradient(playlist.title)};"
					>
						{playlist.title.substring(0, 1).toUpperCase()}
					</div>
				{/if}
			</div>
			
			<!-- Playlist Info -->
			<div class="mb-4 text-center md:mb-0 md:ml-8 md:text-left">
				<div class="text-sm font-medium uppercase tracking-wider text-muted-foreground">Playlist</div>
				<h1 class="mt-1 text-3xl font-bold md:text-5xl">{playlist.title}</h1>
				
				{#if playlist.description}
					<p class="mt-2 max-w-2xl text-muted-foreground">
						{playlist.description}
					</p>
				{/if}
				
				<div class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:justify-start">
					<div class="flex items-center">
						<Avatar class="mr-2 h-6 w-6">
							<AvatarImage src={creator.avatar_url || ''} alt={creator.display_name} />
							<AvatarFallback><UserIcon class="h-3 w-3" /></AvatarFallback>
						</Avatar>
						<a href="/user/{creator.id}" class="hover:text-primary hover:underline">
							{creator.display_name}
						</a>
					</div>
					
					<div class="text-muted-foreground">•</div>
					
					<div class="flex items-center gap-1">
						<MusicIcon class="h-4 w-4" />
						<span>{tracks.length} songs</span>
					</div>
					
					<div class="text-muted-foreground">•</div>
					
					<div class="flex items-center gap-1">
						<ClockIcon class="h-4 w-4" />
						<span>{formatTotalDuration(totalDuration)}</span>
					</div>
					
					<div class="text-muted-foreground">•</div>
					
					<div class="flex items-center gap-1">
						<CalendarIcon class="h-4 w-4" />
						<span>Updated {formatRelativeTime(playlist.updated_at)}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="container mx-auto px-4 py-4 ">
		<!-- Action Buttons -->
		<div class="mb-8 flex items-center gap-4">
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
				onclick={sharePlaylist}
			>
				<ShareIcon class="h-5 w-5" />
			</Button>
			
			{#if isOwner}
				<Button
					variant="ghost"
					size="sm"
					class="gap-2"
					onclick={editPlaylist}
				>
					<PencilIcon class="h-4 w-4" />
					Edit
				</Button>
			{/if}
			
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" class="rounded-full">
						<MoreHorizontalIcon class="h-5 w-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onclick={() => window.open(`/user/${creator.id}`, '_blank')}>
						View Creator Profile
					</DropdownMenuItem>
					<DropdownMenuItem onclick={sharePlaylist}>Share Playlist</DropdownMenuItem>
					{#if isOwner}
						<DropdownMenuItem onclick={editPlaylist}>Edit Playlist</DropdownMenuItem>
					{/if}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		
		<!-- Track List -->
		<div class="mb-8">
			{#if tracks.length > 0}
				<div class="space-y-1">
					{#each tracks as track, i}
						<TrackItem track={track} index={i} />
					{/each}
				</div>
			{:else}
				<div class="flex h-48 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
					<MusicIcon class="mb-4 h-12 w-12 text-muted-foreground" />
					<h3 class="mb-1 text-lg font-medium">This playlist is empty</h3>
					<p class="text-sm text-muted-foreground">
						{isOwner 
							? 'Add some tracks to get started!'
							: 'The creator hasn\'t added any tracks yet.'
						}
					</p>
					{#if isOwner}
						<Button variant="default" class="mt-4" onclick={editPlaylist}>
							Add Tracks
						</Button>
					{/if}
				</div>
			{/if}
		</div>
		
		<Separator class="my-8" />
		
		<!-- Similar Playlists -->
		{#if similarPlaylists && similarPlaylists.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold">Similar Playlists</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{#each similarPlaylists as similarPlaylist}
						<a href="/playlist/{similarPlaylist.id}" class="group">
							<div class="overflow-hidden rounded-md">
								{#if similarPlaylist.cover_url}
									<img 
										src={similarPlaylist.cover_url} 
										alt={similarPlaylist.title}
										class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
									/>
								{:else}
									<div 
										class="flex aspect-square w-full items-center justify-center text-4xl font-bold text-white transition-transform group-hover:scale-105" 
										style="background: {generateGradient(similarPlaylist.title)};"
									>
										{similarPlaylist.title.substring(0, 1).toUpperCase()}
									</div>
								{/if}
							</div>
							<div class="mt-2">
								<h3 class="font-medium group-hover:text-primary group-hover:underline line-clamp-1">
									{similarPlaylist.title}
								</h3>
								<p class="text-xs text-muted-foreground">
									By {similarPlaylist.creator_name} • {similarPlaylist.track_count} tracks
								</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
