<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	/*
  import { TrackList } from '$lib/components/tracks';
	import { ArtistGrid } from '$lib/components/artists';
	import { AlbumGrid } from '$lib/components/albums';
*/
	import { TrackItem } from '$lib/components/music';

	import { GenreGrid } from '$lib/components/genres';
	import { Button } from '$lib/components/ui/button';

	// Page data
	let { data } = $props();

	// State
	let isLoading = $state(false);
	let currentTab = $state('tracks');

	// Derived data
	let genre = $derived.by(() => data.genreWithContent?.genre);
	let tracks = $derived.by(() => data.genreWithContent?.tracks || []);
	let artists = $derived.by(() => data.genreWithContent?.artists || []);
	let albums = $derived.by(() => data.genreWithContent?.albums || []);
	let relatedGenres = $derived.by(() => data.genreWithContent?.relatedGenres || []);

	// Calculate total duration of all tracks
	let totalDuration = $derived.by(() => {
		if (!tracks.length) return 0;
		return tracks.reduce((total, track) => total + (track.duration || 0), 0);
	});

	// Format the total duration
	let formattedTotalDuration = $derived.by(() => {
		const hours = Math.floor(totalDuration / 3600);
		const minutes = Math.floor((totalDuration % 3600) / 60);

		if (hours > 0) {
			return `${hours} hr ${minutes} min`;
		}
		return `${minutes} min`;
	});
</script>

<svelte:head>
	<title>{genre?.name || 'Genre'} - prettygood.music</title>
	<meta name="description" content="Explore {genre?.name} music - tracks, albums, and artists" />
</svelte:head>

{#if data.status === 'error'}
	<div class="container mx-auto max-w-5xl px-4 py-8">
		<div class="bg-destructive/10 text-destructive rounded-md p-6">
			<h1 class="mb-2 text-2xl font-bold">Error Loading Genre</h1>
			<p>{data.error || 'Unknown error occurred'}</p>
			<Button class="mt-4" variant="outline" href={'/genres'}>Back to Genres</Button>
		</div>
	</div>
{:else if !genre}
	<div class="container mx-auto max-w-5xl px-4 py-8">
		<div class="bg-muted rounded-md p-6 text-center">
			<h1 class="mb-2 text-2xl font-bold">Genre Not Found</h1>
			<p>The genre you're looking for doesn't exist or has been removed.</p>
			<Button class="mt-4" variant="outline" href={'/genres'}>Browse All Genres</Button>
		</div>
	</div>
{:else}
	<!-- Genre header -->
	<div
		class="relative w-full px-4 py-12"
		style={genre.image_url
			? `background-image: url(${genre.image_url}); background-size: cover; background-position: center;`
			: `background-color: ${genre.color || '#374151'};`}
	>
		<!-- Gradient overlay -->
		<div
			class="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
		></div>
		<div class="bg-background/50 absolute inset-0"></div>

		<!-- Content -->
		<div class="container relative mx-auto max-w-5xl">
			<div class="flex flex-col gap-4">
				<h1 class="text-4xl font-bold md:text-5xl">{genre.name}</h1>

				{#if genre.description}
					<p class="text-foreground/80 max-w-3xl text-lg">{genre.description}</p>
				{/if}

				<div class="mt-2 flex flex-wrap items-center gap-4">
					<div class="text-foreground/70 text-sm">
						{tracks.length} tracks • {artists.length} artists • {albums.length} albums
						{#if tracks.length > 0}
							• {formattedTotalDuration}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content tabs -->
	<div class="container mx-auto max-w-5xl px-4 py-8">
		<Tabs value={currentTab} onValueChange={(value) => (currentTab = value)}>
			<TabsList>
				<TabsTrigger value="tracks">Tracks</TabsTrigger>
				<TabsTrigger value="artists">Artists</TabsTrigger>
				<TabsTrigger value="albums">Albums</TabsTrigger>
				{#if relatedGenres.length > 0}
					<TabsTrigger value="related">Related Genres</TabsTrigger>
				{/if}
			</TabsList>

			<TabsContent value="tracks" class="pt-6">
				{#each tracks as track, index}
					<!-- 
        <TrackList
					{tracks}
					isLoading={isLoading && currentTab === 'tracks'}
					showArtist={true}
					showAlbum={true}
				/>
         -->
					<TrackItem {track} {index}></TrackItem>
				{/each}
			</TabsContent>
			<!-- 
			<TabsContent value="artists" class="pt-6">
				<ArtistGrid
					{artists}
					isLoading={isLoading && currentTab === 'artists'}
					columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
				/>
			</TabsContent>

			<TabsContent value="albums" class="pt-6">
				<AlbumGrid
					{albums}
					isLoading={isLoading && currentTab === 'albums'}
					columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
				/>
			</TabsContent>
       -->

			{#if relatedGenres.length > 0}
				<TabsContent value="related" class="pt-6">
					<GenreGrid
						genres={relatedGenres}
						isLoading={isLoading && currentTab === 'related'}
						size="medium"
						columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
					/>
				</TabsContent>
			{/if}
		</Tabs>
	</div>
{/if}
