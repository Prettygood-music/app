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

	// Page data from load function
	let { data } = $props();

	// Using Svelte 5 runes for state management
	let isFollowing = $state(false);
	let selectedTab = $state('overview');

	function toggleFollow() {
		isFollowing = !isFollowing;
	}

	function tipArtist() {
		// This would integrate with the Sui wallet functionality
		alert('Tipping functionality would integrate with Sui wallet');
	}

	function share() {
		alert(`Sharing artist: ${data.artist.display_name}`);
	}
</script>

<svelte:head>
	<title>{data.artist.display_name} | prettygood.music</title>
	<meta
		name="description"
		content={data.artist.bio?.substring(0, 160) || `Music by ${data.artist.display_name}`}
	/>
</svelte:head>

<div class="flex flex-col overflow-y-auto">
	<!-- Artist Header with Cover Image -->
	<div class="relative min-h-80 w-full overflow-hidden">
		{#if data.artist.cover_url}
			<img
				src={data.artist.cover_url}
				alt={`${data.artist.display_name} cover image`}
				class="h-full w-full object-cover"
			/>
		{:else}
			<div class="from-primary/20 to-primary/40 h-full w-full bg-gradient-to-r"></div>
		{/if}

		<div class="from-background absolute inset-0 bg-gradient-to-t to-transparent"></div>

		<div class="absolute bottom-0 inset-x-0">
			<div class="container flex w-full flex-col items-end gap-4 p-6 md:flex-row md:items-center">
				<Avatar class="border-background h-24 w-24 border-4 md:h-36 md:w-36">
					<AvatarImage src={data.artist.avatar_url || ''} alt={data.artist.display_name} />
					<AvatarFallback>{data.artist.display_name.substring(0, 2)}</AvatarFallback>
				</Avatar>

				<div class="flex-1">
					<h1 class="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
						{data.artist.display_name}
					</h1>
					<div class="mt-2 flex items-center gap-2">
						<Badge variant="secondary" class="text-xs">ARTIST</Badge>
						<span class="text-sm text-white/80">25.4M monthly listeners</span>
					</div>
				</div>

				<div class="flex gap-2">
					<Button
						size="icon"
						variant="ghost"
						class="bg-background/20 hover:bg-background/40 rounded-full"
						onclick={share}
					>
						<ShareIcon class="h-5 w-5" />
					</Button>
					<Button onclick={toggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
						{isFollowing ? 'Following' : 'Follow'}
					</Button>
					<Button variant="default" onclick={tipArtist}>
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
						<Button variant="link">See All</Button>
					</div>

					<div class="space-y-2">
						{#each data.topTracks as track, i}
							<TrackItem {track} index={i} />
						{/each}
					</div>
				</section>

				<!-- Albums Section -->
				<section>
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-2xl font-bold">Albums</h2>
						<Button variant="link" href="/artist/{data.artist.id}/albums">See All</Button>
					</div>

					<div class="relative">
						<ScrollArea orientation="both">
							<div class="flex space-x-4 pb-4">
								{#each data.albums as album}
									<AlbumCard {album} size="default" />
								{/each}
							</div>
						</ScrollArea>
					</div>
				</section>

				<!-- Similar Artists Section -->
				<section>
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-2xl font-bold">Fans Also Like</h2>
						<Button variant="link">See All</Button>
					</div>

					<div class="relative">
						<ScrollArea orientation="both">
							<div class="flex space-x-4 pb-4">
								{#each data.similarArtists as artist}
									<ArtistCard
										id={artist.id}
										name={artist.display_name}
										avatarUrl={artist.avatar_url}
									/>
								{/each}
							</div>
						</ScrollArea>
					</div>
				</section>
			</TabsContent>

			<!-- Albums Tab -->
			<TabsContent value="albums" class="space-y-8">
				<h2 class="mb-4 text-2xl font-bold">Albums</h2>

				<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each data.albums as album}
						<AlbumCard {album} />
					{/each}
				</div>
			</TabsContent>

			<!-- About Tab -->
			<TabsContent value="about" class="max-w-3xl space-y-8">
				<section>
					<h2 class="mb-4 text-2xl font-bold">Biography</h2>
					<div class="prose prose-sm md:prose-base dark:prose-invert">
						<p>{data.artist?.bio || 'bio'}</p>

						<p class="mt-4">
							Nina's journey began in the underground clubs of Berlin, where she honed her craft as
							both a DJ and producer. Her breakthrough album "Async Awakenings" topped electronic
							charts worldwide, establishing her as a pioneer in the audio-visual electronic scene.
						</p>

						<p class="mt-4">
							When not producing music, Nina teaches sound design at the Berlin University of the
							Arts and contributes to open-source audio software projects. Her performances are
							known for their immersive visualizations that synchronize with her music to create
							multisensory experiences.
						</p>
					</div>
				</section>

				<Separator />

				{#if data.artist.socials}
					<section>
						<h2 class="mb-4 text-xl font-bold">Social Links</h2>
						<div class="space-y-2">
							{#if data.artist.socials.website}
								<a
									href={data.artist.socials.website}
									target="_blank"
									rel="noopener noreferrer"
									class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
								>
									<GlobeIcon class="h-5 w-5" />
									<span>{data.artist.socials.website}</span>
								</a>
							{/if}

							{#if data.artist.socials.twitter}
								<a
									href={`https://twitter.com/${data.artist.socials.twitter}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
								>
									<TwitterIcon class="h-5 w-5" />
									<span>@{data.artist.socials.twitter}</span>
								</a>
							{/if}

							{#if data.artist.socials.instagram}
								<a
									href={`https://instagram.com/${data.artist.socials.instagram}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
								>
									<InstagramIcon class="h-5 w-5" />
									<span>@{data.artist.socials.instagram}</span>
								</a>
							{/if}
						</div>
					</section>
				{/if}

				<Separator />

				<section>
					<h2 class="mb-2 text-xl font-bold">Artist Information</h2>
					<dl class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
						<div>
							<dt class="text-muted-foreground text-sm">Monthly Listeners</dt>
							<dd>25.4 Million</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Total Plays</dt>
							<dd>127.8 Million</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Active Since</dt>
							<dd>2018</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Origin</dt>
							<dd>Berlin, Germany</dd>
						</div>
					</dl>
				</section>

				<section>
					<h2 class="mb-2 text-xl font-bold">Genres</h2>
					<div class="flex flex-wrap gap-2">
						{#each ['Electronic', 'Ambient', 'Techno', 'IDM', 'Glitch', 'Downtempo'] as genre}
							<Badge variant="secondary">{genre}</Badge>
						{/each}
					</div>
				</section>
			</TabsContent>
		</Tabs>
	</div>
</div>
