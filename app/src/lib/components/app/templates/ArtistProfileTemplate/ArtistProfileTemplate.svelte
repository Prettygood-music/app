<script lang="ts">
	import { AlbumCard, ArtistCard, TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import type { Album, Artist, Track } from '$lib/types';

	import TipIcon from 'lucide-svelte/icons/coins';
	import GlobeIcon from 'lucide-svelte/icons/globe';
	import InstagramIcon from 'lucide-svelte/icons/instagram';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import TwitterIcon from 'lucide-svelte/icons/twitter';

	let {
		// Artist details
		artist = {
			id: 'artist-1',
			artist_name: 'Artist Name',
			cover_url: undefined,
			avatar_url: undefined,
			bio: 'Artist biography goes here with a detailed description of their career, style, and achievements.',
			tracks: [],
			albums: [],
			social_links: {
				website: 'https://example.com',
				twitter: 'artistname',
				instagram: 'artistname'
			},
			stats: {
				monthlyListeners: '25.4 Million',
				totalPlays: '127.8 Million',
				activeSince: '2018',
				origin: 'Berlin, Germany'
			},
			genres: ['Electronic', 'Ambient', 'Techno']
		},

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
	} = $props();

	// Using Svelte 5 runes for state management
	let isFollowing = $state(initialIsFollowing);
	let selectedTab = $state(initialSelectedTab);

	function toggleFollow() {
		isFollowing = !isFollowing;
		onToggleFollow(isFollowing);
	}
</script>

<svelte:head>
	{#if pageTitle}
		<title>{pageTitle}</title>
		{#if pageDescription}
			<meta name="description" content={pageDescription} />
		{/if}
	{/if}
</svelte:head>

<div class="flex flex-col overflow-y-auto">
	<!-- Artist Header with Cover Image -->
	<div class="relative min-h-80 w-full overflow-hidden">
		{#if artist.cover_url}
			<img
				src={artist.cover_url}
				alt={`${artist.artist_name} cover image`}
				class="h-full w-full object-cover"
			/>
		{:else}
			<div class="from-primary/20 to-primary/40 h-full w-full bg-gradient-to-r"></div>
		{/if}

		<div class="from-background absolute inset-0 bg-gradient-to-t to-transparent"></div>

		<div class="absolute inset-x-0 bottom-0">
			<div class="container flex w-full flex-col items-end gap-4 p-6 md:flex-row md:items-center">
				<Avatar class="border-background h-24 w-24 border-4 md:h-36 md:w-36">
					<AvatarImage src={artist?.avatar_url || ''} alt={artist.artist_name} />
					<AvatarFallback>{artist.artist_name.substring(0, 2)}</AvatarFallback>
				</Avatar>

				<div class="flex-1">
					<h1 class="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
						{artist.artist_name}
					</h1>
					<div class="mt-2 flex items-center gap-2">
						<Badge variant="secondary" class="text-xs">ARTIST</Badge>
						<span class="text-sm text-white/80"
							>{artist.stats?.monthlyListeners || '25.4M'} monthly listeners</span
						>
					</div>
				</div>

				<div class="flex gap-2">
					<Button
						size="icon"
						variant="ghost"
						class="bg-background/20 hover:bg-background/40 rounded-full"
						onclick={() => onShare(artist)}
					>
						<ShareIcon class="h-5 w-5" />
					</Button>
					<Button onclick={toggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
						{isFollowing ? 'Following' : 'Follow'}
					</Button>
					<Button variant="default" onclick={() => onTipArtist(artist)}>
						<TipIcon class="mr-2 h-4 w-4" />
						Tip Artist
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="container mx-auto px-4 py-6">
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
						{#each artist.tracks as track, i}
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
								<div class="flex space-x-4 pb-4">
									{#each artist.albums as album}
										<AlbumCard {album} size="default" />
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
											avatarUrl={similarArtist.avatar_url}
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
						<AlbumCard {album} />
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
	</div>
</div>
