<script lang="ts">
  import type { PageData } from './$types';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { TrackList } from '$lib/components/tracks';
  import { ArtistGrid } from '$lib/components/artists';
  import { AlbumGrid } from '$lib/components/albums';
  import { GenreGrid } from '$lib/components/genres';
  import { formatDuration } from '$lib/services/genres';
  import { Play } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  
  // Page data
  let { data } = $props<{ data: PageData }>();
  
  // State
  let isLoading = $state(false);
  let currentTab = $state('tracks');
  
  // Derived data
  let genre = $derived(() => data.genreWithContent?.genre);
  let tracks = $derived(() => data.genreWithContent?.tracks || []);
  let artists = $derived(() => data.genreWithContent?.artists || []);
  let albums = $derived(() => data.genreWithContent?.albums || []);
  let relatedGenres = $derived(() => data.genreWithContent?.relatedGenres || []);
  
  // Calculate total duration of all tracks
  let totalDuration = $derived(() => {
    if (!tracks.length) return 0;
    return tracks.reduce((total, track) => total + (track.duration || 0), 0);
  });
  
  // Format the total duration
  let formattedTotalDuration = $derived(() => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  });
  
  // Handle play all action
  function playAll() {
    // This would typically add all tracks to the queue and start playback
    // For now, we'll just navigate to the first track
    if (tracks.length > 0) {
      goto(`/tracks/${tracks[0].id}`);
    }
  }
</script>

<svelte:head>
  <title>{genre?.name || 'Genre'} - prettygood.music</title>
  <meta name="description" content="Explore {genre?.name} music - tracks, albums, and artists" />
</svelte:head>

{#if data.status === 'error'}
  <div class="container max-w-5xl mx-auto py-8 px-4">
    <div class="p-6 bg-destructive/10 text-destructive rounded-md">
      <h1 class="text-2xl font-bold mb-2">Error Loading Genre</h1>
      <p>{data.error || 'Unknown error occurred'}</p>
      <Button class="mt-4" variant="outline" onclick={() => goto('/genres')}>
        Back to Genres
      </Button>
    </div>
  </div>
{:else if !genre}
  <div class="container max-w-5xl mx-auto py-8 px-4">
    <div class="p-6 bg-muted rounded-md text-center">
      <h1 class="text-2xl font-bold mb-2">Genre Not Found</h1>
      <p>The genre you're looking for doesn't exist or has been removed.</p>
      <Button class="mt-4" variant="outline" onclick={() => goto('/genres')}>
        Browse All Genres
      </Button>
    </div>
  </div>
{:else}
  <!-- Genre header -->
  <div 
    class="w-full py-12 px-4 relative"
    style={genre.image_url ? 
      `background-image: url(${genre.image_url}); background-size: cover; background-position: center;` :
      `background-color: ${genre.color || '#374151'};`
    }
  >
    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
    <div class="absolute inset-0 bg-background/50"></div>
    
    <!-- Content -->
    <div class="container max-w-5xl mx-auto relative">
      <div class="flex flex-col gap-4">
        <h1 class="text-4xl md:text-5xl font-bold">{genre.name}</h1>
        
        {#if genre.description}
          <p class="text-lg max-w-3xl text-foreground/80">{genre.description}</p>
        {/if}
        
        <div class="flex flex-wrap gap-4 items-center mt-2">
          <div class="text-sm text-foreground/70">
            {tracks.length} tracks • {artists.length} artists • {albums.length} albums
            {#if tracks.length > 0}
              • {formattedTotalDuration}
            {/if}
          </div>
          
          {#if tracks.length > 0}
            <Button size="sm" onclick={playAll}>
              <Play class="h-4 w-4 mr-2" />
              Play All
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Content tabs -->
  <div class="container max-w-5xl mx-auto py-8 px-4">
    <Tabs value={currentTab} onValueChange={(value) => currentTab = value}>
      <TabsList>
        <TabsTrigger value="tracks">Tracks</TabsTrigger>
        <TabsTrigger value="artists">Artists</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        {#if relatedGenres.length > 0}
          <TabsTrigger value="related">Related Genres</TabsTrigger>
        {/if}
      </TabsList>
      
      <TabsContent value="tracks" class="pt-6">
        <TrackList 
          tracks={tracks} 
          isLoading={isLoading && currentTab === 'tracks'} 
          showArtist={true}
          showAlbum={true}
        />
      </TabsContent>
      
      <TabsContent value="artists" class="pt-6">
        <ArtistGrid 
          artists={artists} 
          isLoading={isLoading && currentTab === 'artists'} 
          columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      </TabsContent>
      
      <TabsContent value="albums" class="pt-6">
        <AlbumGrid 
          albums={albums} 
          isLoading={isLoading && currentTab === 'albums'}
          columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        />
      </TabsContent>
      
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
