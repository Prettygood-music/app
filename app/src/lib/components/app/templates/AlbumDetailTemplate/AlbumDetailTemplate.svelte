<script lang="ts">
	import { TrackItem } from '$lib/components/music';
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
	import ShuffleIcon from 'lucide-svelte/icons/shuffle';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import type { Track } from '$lib/types';

	type Album = {
		id: string;
		title: string;
		cover_url?: string;
		release_date: string;
		genre: string[];
		tracks: Track[];
		description?: string;
		label?: string;
	};
	let {
		// Album details
		album = {
			id: 'album-1',
			title: 'Album Title',
			cover_url: undefined,
			release_date: new Date().toISOString(),
			genre: [],
			tracks: [],
			description: undefined,
			label: 'Record Label'
		},

		// Artist details
		artist = {
			id: 'artist-1',
			artist_name: 'Artist Name',
			avatar_url: undefined,
			bio: undefined
		},


		// Related albums
		relatedAlbums = [],

		// Initial state
		initialIsLiked = false,

		// Event handlers
		onTogglePlay = () => {},
		onShufflePlay = () => {},
		onToggleLike = () => {},
		onShare = () => {},
		onMoreOptions = () => {}
	}: {
		album: Album;
		relatedAlbums: Album[];
	} = $props();

	const playerState = getPlayerContext();

	let isPlaying = $derived(playerState.isListCurrentlyPlaying(album));

	// TODO: wire up
	let isLiked = $state(initialIsLiked);

	// Calculate total duration of all tracks
	let totalDuration = $derived(album.tracks.reduce((total, track) => total + track.duration, 0));

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

	// Handle play/pause for the whole album
	function togglePlay() {
		onTogglePlay(isPlaying, album);
	}

	// Handle shuffle play
	function shufflePlay() {
		playerState.toggleShuffle();
		onShufflePlay(album);
	}

	// Handle like
	function toggleLike() {
		isLiked = !isLiked;
		onToggleLike(isLiked, album);
	}

	// Handle share
	function shareAlbum() {
		onShare(album);
	}

	// Handle more options
	function showMoreOptions() {
		onMoreOptions(album);
	}
</script>

<div class="overflow-y-auto">
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
						<a href="/artist/{artist.id}" class="text-primary text-lg hover:underline">
							{artist.artist_name}
						</a>
						<div class="text-muted-foreground hidden lg:block">•</div>
						<div class="text-muted-foreground mt-1 flex items-center gap-2 text-sm lg:mt-0">
							<CalendarIcon class="h-4 w-4" />
							<span>{formatDate(album.release_date)}</span>
						</div>
					</div>

					<div
						class="text-muted-foreground mt-2 flex items-center justify-center gap-3 text-sm lg:justify-start"
					>
						<div class="flex items-center gap-1">
							<MusicIcon class="h-4 w-4" />
							<span>{album.tracks.length} tracks</span>
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

					<Button variant="ghost" size="icon" class="rounded-full" onclick={shareAlbum}>
						<ShareIcon class="h-5 w-5" />
					</Button>

					<Button variant="ghost" size="icon" class="rounded-full" onclick={showMoreOptions}>
						<MoreHorizontalIcon class="h-5 w-5" />
					</Button>
				</div>

				<!-- Album Release Information -->
				<div class="bg-muted/30 w-full rounded-md p-4">
					<h3 class="mb-2 font-medium">About this album</h3>
					<div class="grid gap-2 text-sm">
						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Released</span>
							<span>{formatDate(album.release_date)}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Tracks</span>
							<span>{album.tracks.length}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Duration</span>
							<span>{formatTotalDuration(totalDuration)}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Label</span>
							<span>{album.label || 'Independent'}</span>
						</div>

						{#if album.description}
							<div class="text-muted-foreground mt-2 text-sm">
								<p class="line-clamp-4">{album.description}</p>
							</div>
						{/if}

						{#if album.genre && album.genre.length > 0}
							<div class="mt-2 flex flex-wrap gap-2">
								{#each album.genre as genre}
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
						{#each album.tracks as track, i}
							<TrackItem {track} index={i} />
						{/each}
					</div>
				</div>

				<Separator class="my-8" />

				<!-- Artist Section -->
				<div>
					<h2 class="mb-4 text-xl font-bold">Artist</h2>
					<a
						href="/artist/{artist.id}"
						class="hover:bg-muted/50 group flex items-center gap-4 rounded-md p-2 transition-colors"
					>
						<Avatar class="h-16 w-16">
							<AvatarImage src={artist.avatar_url || ''} alt={artist.artist_name} />
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
										<h3 class="group-hover:text-primary font-medium group-hover:underline">
											{relatedAlbum.title}
										</h3>
										<p class="text-muted-foreground text-xs">
											{new Date(relatedAlbum.release_date).getFullYear()} • {relatedAlbum.tracks
												?.length || 0}
											tracks
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
</div>
