<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { Track, User } from '$lib/types/player';

	import { page } from '$app/state';
	import ShareButton from '$lib/components/app/atoms/share-button/ShareButton.svelte';
	import { generateGradient, generateGradientDataURL } from '$lib/utils.js';
	import { EyeIcon, LockIcon } from 'lucide-svelte';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import MusicIcon from 'lucide-svelte/icons/music';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import PlayIcon from 'lucide-svelte/icons/play';
	import UserIcon from 'lucide-svelte/icons/user';
	import Card from './card.svelte';
	import { getPlayerContext } from '$lib/state/player.svelte';

	// Page data from load function
	let { data } = $props();

	// Get data from the load function
	let playlist = $derived(data.playlist);
	let creator = $derived<User>(data.creator);
	let tracks = $derived(data.tracks);
	let isOwner = $derived<boolean>(data.isOwner);

	let isLiked = $state(false);
	let totalDuration = $derived(tracks.reduce((total, track) => total + (track.duration || 0), 0));

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
	const playerState = getPlayerContext();
	let isCurrent = $derived(playerState.currentListId === playlist.id);
	let isPlaying = $derived(playerState.isListCurrentlyPlaying(playlist));
	// Handle play/pause for the whole playlist
	function togglePlay() {
		if (isPlaying) {
			playerState.pause();
		} else {
			if (isCurrent) {
				playerState.play();
			} else {
				let pl = {
					...playlist,
					tracks: (playlist.tracks || []).map((track) => ({
						...track,
						artist: { name: track.artist_name }
					}))
				};

				playerState.playList(pl);
			}
		}
	}

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
							src=${playlist.cover_url}
							alt=${playlist.name}
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
							<AvatarImage src={creator.avatar || ''} alt={creator.display_name} />
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
					<div class="text-muted-foreground">•</div>

					<div class="flex items-center gap-1">
						{#if playlist.is_public}
							<EyeIcon class="h-4 w-4" />
							<span>Public</span>
						{:else}
							<LockIcon class="h-4 w-4" />
							<span>Private</span>
						{/if}
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
				disabled={tracks.length === 0}
				class="flex h-14 w-14 items-center justify-center rounded-full p-0"
				onclick={togglePlay}
			>
				{#if isPlaying}
					<PauseIcon class="h-6 w-6" />
				{:else}
					<PlayIcon class="ml-1 h-6 w-6" />
				{/if}
			</Button>
			<!-- 
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
	-->
			<ShareButton
				content={{
					url: page.url.toString()
				}}
			></ShareButton>
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
						<Button variant="default" class="mt-4" disabled>Add Tracks</Button>
					{/if}
				</div>
			{/if}
		</div>

		{#if data.similarPlaylists && data.similarPlaylists.length > 0}
			<Separator class="my-8" />

			<!-- Similar Playlists -->
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold">Similar Playlists</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{#each data.similarPlaylists as playlist}
						<Card {playlist} tracks={playlist.tracks} creator={playlist.creator}></Card>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
