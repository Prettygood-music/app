<script lang="ts">
	import { ArtistCard, TrackItem } from '$lib/components/music';
	import AlbumCard from './AlbumCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';

	import GlobeIcon from 'lucide-svelte/icons/globe';
	import InstagramIcon from 'lucide-svelte/icons/instagram';
	import TwitterIcon from 'lucide-svelte/icons/twitter';
	import type { Album, Artist, TrackWithDetails } from '$lib/types';

	let {
		// Artist details
		artist,
		tracks,

		// Similar artists
		similarArtists = [],

		// Initial state
		initialIsFollowing = false,
		initialSelectedTab = 'overview',

		// Event handlers
		onToggleFollow = () => {},
		onTipArtist = () => {},
		onShare = () => {},
		onSeeAllTracks = () => {},
		onSeeAllAlbums = () => {},
		onSeeAllSimilarArtists = () => {},

		// Page title
		pageTitle = undefined,
		pageDescription = undefined
	}: {
		artist: Artist & { albums: Album[] };
		tracks: TrackWithDetails;
	} = $props();

	// Using Svelte 5 runes for state management
	let selectedTab = $state(initialSelectedTab);
</script>

<svelte:head>
	{#if pageTitle}
		<title>{pageTitle}</title>
		{#if pageDescription}
			<meta name="description" content={pageDescription} />
		{/if}
	{/if}
</svelte:head>

<Tabs value={selectedTab} onValueChange={(value) => (selectedTab = value)} class="w-full">
	<TabsList class="grid w-full grid-cols-3 md:flex md:w-auto">
		<TabsTrigger value="overview">Overview</TabsTrigger>
		<TabsTrigger value="albums">Albums</TabsTrigger>
		<TabsTrigger value="about">About</TabsTrigger>
	</TabsList>

	<!-- Overview Tab -->
	<TabsContent value="overview" class="space-y-8">
		<!-- Top Tracks Section -->
		<section>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-2xl font-bold">Top Tracks</h2>
				<Button variant="link" onclick={() => onSeeAllTracks(artist)}>See All</Button>
			</div>

			<div class="space-y-2">
				{#each tracks as track, i}
					<TrackItem {track} index={i} />
				{/each}
			</div>
		</section>

		<!-- Albums Section -->
		{#if artist.albums && artist.albums.length > 0}
			<section>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-2xl font-bold">Albums</h2>
					<Button variant="link" onclick={() => onSeeAllAlbums(artist)}>See All</Button>
				</div>

				<div class="relative">
					<ScrollArea orientation="both">
						<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{#each artist.albums as album}
								<!-- <AlbumCard {album} size="default" /> -->
								<AlbumCard
									{album}
									tracks={album.tracks}
									date={new Date(album.release_date).getFullYear()}
								></AlbumCard>
							{/each}
						</div>
					</ScrollArea>
				</div>
			</section>
		{/if}

		<!-- Similar Artists Section -->
		{#if similarArtists && similarArtists.length > 0}
			<section>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-2xl font-bold">Fans Also Like</h2>
					<Button variant="link" onclick={onSeeAllSimilarArtists}>See All</Button>
				</div>

				<div class="relative">
					<ScrollArea orientation="both">
						<div class="flex space-x-4 pb-4">
							{#each similarArtists as similarArtist}
								<ArtistCard
									id={similarArtist.id}
									name={similarArtist.display_name || similarArtist.artist_name}
									avatarUrl={similarArtist.avatar}
								/>
							{/each}
						</div>
					</ScrollArea>
				</div>
			</section>
		{/if}
	</TabsContent>

	<!-- Albums Tab -->
	<TabsContent value="albums" class="space-y-8">
		<h2 class="mb-4 text-2xl font-bold">Albums</h2>

		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each artist.albums || [] as album}
				<!-- <AlbumCard {album} /> -->
				<AlbumCard {album} tracks={album.tracks} date={new Date(album.release_date).getFullYear()}
				></AlbumCard>
			{/each}
		</div>
	</TabsContent>

	<!-- About Tab -->
	<TabsContent value="about" class="max-w-3xl space-y-8">
		<section>
			<h2 class="mb-4 text-2xl font-bold">Biography</h2>
			<div class="prose prose-sm md:prose-base dark:prose-invert">
				<p>{artist?.bio || "Artist doesn't have a biography yet"}</p>
			</div>
		</section>

		<Separator />

		{#if artist.social_links}
			{@const socials = artist.social_links as Record<string, string>}
			<section>
				<h2 class="mb-4 text-xl font-bold">Social Links</h2>
				<div class="space-y-2">
					{#if 'website' in socials && socials.website}
						<a
							href={socials.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
						>
							<GlobeIcon class="h-5 w-5" />
							<span>{socials.website}</span>
						</a>
					{/if}

					{#if socials.twitter}
						<a
							href={`https://twitter.com/${socials.twitter}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
						>
							<TwitterIcon class="h-5 w-5" />
							<span>@{socials.twitter}</span>
						</a>
					{/if}

					{#if socials.instagram}
						<a
							href={`https://instagram.com/${socials.instagram}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
						>
							<InstagramIcon class="h-5 w-5" />
							<span>@{socials.instagram}</span>
						</a>
					{/if}
				</div>
			</section>
		{/if}

		<Separator />

		<section>
			<h2 class="mb-2 text-xl font-bold">Artist Information</h2>
			<dl class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
				{#if artist.stats?.monthlyListeners}
					<div>
						<dt class="text-muted-foreground text-sm">Monthly Listeners</dt>
						<dd>{artist.stats.monthlyListeners}</dd>
					</div>
				{/if}
				{#if artist.stats?.totalPlays}
					<div>
						<dt class="text-muted-foreground text-sm">Total Plays</dt>
						<dd>{artist.stats.totalPlays}</dd>
					</div>
				{/if}
				{#if artist.stats?.activeSince}
					<div>
						<dt class="text-muted-foreground text-sm">Active Since</dt>
						<dd>{artist.stats.activeSince}</dd>
					</div>
				{/if}
				{#if artist.stats?.origin}
					<div>
						<dt class="text-muted-foreground text-sm">Origin</dt>
						<dd>{artist.stats.origin}</dd>
					</div>
				{/if}
			</dl>
		</section>

		{#if artist.genres && artist.genres.length > 0}
			<section>
				<h2 class="mb-2 text-xl font-bold">Genres</h2>
				<div class="flex flex-wrap gap-2">
					{#each artist.genres as genre}
						<Badge variant="secondary">{genre}</Badge>
					{/each}
				</div>
			</section>
		{/if}
	</TabsContent>
</Tabs>
