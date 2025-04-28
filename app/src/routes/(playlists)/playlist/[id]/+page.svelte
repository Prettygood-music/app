<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
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
	//let playlist = $state<Playlist>(data.playlist);
	let playlist = $derived(data.playlist);
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
			return 'Today';
		} else if (diffDays === 1) {
			return 'Yesterday';
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
		console.log(`${isPlaying ? 'Playing' : 'Paused'} playlist: ${playlist.name}`);
	}

	// Handle shuffle play
	function shufflePlay() {
		console.log(`Shuffle playing playlist: ${playlist.name}`);
		isPlaying = true;
	}

	// Handle like
	function toggleLike() {
		isLiked = !isLiked;
		console.log(`${isLiked ? 'Liked' : 'Unliked'} playlist: ${playlist.name}`);
	}

	// Handle share
	function sharePlaylist() {
		console.log(`Sharing playlist: ${playlist.name}`);
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

	/**
	 * Generates a gradient image data URL from a string input
	 *
	 * @param title - The string to generate the gradient from
	 * @param width - Width of the generated image (default: 200)
	 * @param height - Height of the generated image (default: 200)
	 * @returns A data URL that can be used directly in an img src attribute
	 */
	function generateGradientDataURL(
		title: string,
		width: number = 200,
		height: number = 200
	): string {
		// Simple hash function to generate a consistent color from a string
		const hash = title.split('').reduce((acc, char) => {
			return char.charCodeAt(0) + ((acc << 5) - acc);
		}, 0);

		const h1 = Math.abs(hash % 360);
		const h2 = (h1 + 40) % 360;

		// Create an SVG with the gradient
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${h1}, 70%, 60%);stop-opacity:1" /><stop offset="100%" style="stop-color:hsl(${h2}, 70%, 50%);stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" /></svg>`;

		// URL-encode the SVG
		const encodedSVG = encodeURIComponent(svg);

		// Return as data URL
		return `data:image/svg+xml,${encodedSVG}`;
	}

	// Default cover image or gradient background

	let albumCover = $state(
		data.playlist.cover_url
			? `url(${data.playlist.cover_url})`
			: generateGradient(data.playlist.name)
	);

	let hasSuccessfullyLoadedCover = $derived.by(() => {
		if (cover && cover.complete) {
			if (cover.naturalWidth === 0) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	});

	let displayedCover = $derived.by(() => {
		if (cover && cover.complete) {
			if (cover.naturalWidth === 0) {
				return generateGradient(data.playlist.name);
			}
		} else {
			return albumCover;
		}
	});

	let coverBackground = $state(
		data.playlist.cover_url
			? `url(${data.playlist.cover_url})`
			: generateGradient(data.playlist.name)
	);

	let cover: HTMLImageElement = $state(null!);

	$effect(() => {
		if (cover && cover.complete) {
			if (cover.naturalWidth === 0) {
				console.log('Image failed to load, using gradient');
				coverBackground = generateGradient(playlist.name);
			} else {
				coverBackground = `url(${cover.src})`;
			}
		}
	});
</script>

<svelte:head>
	<title>{playlist.name} | prettygood.music</title>
	<meta name="description" content="Listen to {playlist.name} playlist on prettygood.music" />
</svelte:head>

<div class="pb-16">
	<!-- Playlist Header with Cover Image or Gradient -->
	<div class="relative min-h-[200px] overflow-hidden rounded-t md:min-h-[300px]">
		<div
			class="absolute inset-0 bg-cover bg-center"
			style="background-image: {coverBackground}; filter: blur(40px) opacity(0.6);"
		></div>
		<div class="to-background absolute inset-0 bg-gradient-to-b from-transparent"></div>

		<div
			class="container relative mx-auto flex flex-col items-center px-4 py-8 md:flex-row md:items-end"
		>
			<!-- Playlist Artwork -->
			<div class="mb-6 h-48 w-48 overflow-hidden rounded-lg shadow-xl md:mb-0 md:h-56 md:w-56">
				{#if playlist.cover_url}
					{@html `
						<img
							onerror="this.onerror=null;this.src='${generateGradientDataURL(playlist.name)}'"
							src={playlist.cover_url}
							alt={playlist.name}
							class="h-full w-full object-cover"
						/>
						`}
				{:else}
					<div
						class="flex h-full w-full items-center justify-center text-6xl font-bold text-white"
						style="background: {generateGradient(playlist.name)};"
					>
						{playlist.name.substring(0, 1).toUpperCase()}
					</div>
				{/if}
			</div>

			<!-- Playlist Info -->
			<div class="mb-4 text-center md:mb-0 md:ml-8 md:text-left">
				<div class="text-muted-foreground text-sm font-medium uppercase tracking-wider">
					Playlist
				</div>
				<h1 class="mt-1 text-3xl font-bold md:text-5xl">{playlist.name}</h1>

				{#if playlist.description}
					<p class="text-muted-foreground mt-2 max-w-2xl">
						{playlist.description}
					</p>
				{/if}

				<div
					class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:justify-start"
				>
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

	<div class="container mx-auto px-4 py-4">
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

			<Button variant="outline" size="sm" class="gap-2" onclick={shufflePlay}>
				<ShuffleIcon class="h-4 w-4" />
				Shuffle
			</Button>

			<Button
				variant={isLiked ? 'default' : 'ghost'}
				size="icon"
				class="rounded-full"
				onclick={toggleLike}
			>
				<HeartIcon class="h-5 w-5" />
			</Button>

			<Button variant="ghost" size="icon" class="rounded-full" onclick={sharePlaylist}>
				<ShareIcon class="h-5 w-5" />
			</Button>
		</div>

		<!-- Track List -->
		<div class="mb-8">
			{#if tracks.length > 0}
				<div class="space-y-1">
					{#each tracks as track, i}
						<TrackItem {track} index={i} />
					{/each}
				</div>
			{:else}
				<div
					class="flex h-48 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
				>
					<MusicIcon class="text-muted-foreground mb-4 h-12 w-12" />
					<h3 class="mb-1 text-lg font-medium">This playlist is empty</h3>
					<p class="text-muted-foreground text-sm">
						{isOwner
							? 'Add some tracks to get started!'
							: "The creator hasn't added any tracks yet."}
					</p>
					{#if isOwner}
						<Button variant="default" class="mt-4" onclick={editPlaylist}>Add Tracks</Button>
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
								<h3 class="group-hover:text-primary line-clamp-1 font-medium group-hover:underline">
									{similarPlaylist.title}
								</h3>
								<p class="text-muted-foreground text-xs">
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
