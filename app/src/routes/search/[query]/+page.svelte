<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { EnhancedSearchBar } from '$lib/components/search';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Search, Music, Mic, Disc, Play } from 'lucide-svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let activeTab = 'all';
  
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
</script>

<svelte:head>
  <title>Search: {data.query} - prettygood.music</title>
</svelte:head>

<div class="overflow-y-auto">

<div class="container max-w-5xl mx-auto py-6 px-4">
  <div class="mb-8">
    <EnhancedSearchBar initialValue={data.query} />
  </div>
  
  <h1 class="text-3xl font-bold mb-6">Results for "{data.query}"</h1>
  
  <Tabs value={activeTab} class="w-full" onValueChange={(v) => activeTab = v}>
    <TabsList class="grid grid-cols-4 w-full max-w-md mb-6">
      <TabsTrigger value="all" class="flex items-center gap-2">
        <Search class="h-4 w-4" />
        <span>All</span>
      </TabsTrigger>
      <TabsTrigger value="tracks" class="flex items-center gap-2">
        <Music class="h-4 w-4" />
        <span>Tracks</span>
      </TabsTrigger>
      <TabsTrigger value="artists" class="flex items-center gap-2">
        <Mic class="h-4 w-4" />
        <span>Artists</span>
      </TabsTrigger>
      <TabsTrigger value="albums" class="flex items-center gap-2">
        <Disc class="h-4 w-4" />
        <span>Albums</span>
      </TabsTrigger>
    </TabsList>
    
    <TabsContent value="all" class="space-y-10">
      <!-- Tracks Section -->
      {#if data.results.tracks.length > 0}
        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Tracks</h2>
            {#if data.results.tracks.length > 5}
              <Button variant="ghost" on:click={() => activeTab = 'tracks'}>View All</Button>
            {/if}
          </div>
          
          <div class="bg-card rounded-lg overflow-hidden">
            <table class="w-full table-auto">
              <thead class="bg-muted/50">
                <tr>
                  <th class="px-4 py-3 text-left">#</th>
                  <th class="px-4 py-3 text-left">Title</th>
                  <th class="px-4 py-3 text-left">Artist</th>
                  <th class="px-4 py-3 text-left">Duration</th>
                  <th class="px-4 py-3 text-left sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each data.results.tracks.slice(0, 5) as track, i}
                  <tr class="border-b border-muted hover:bg-muted/20 group">
                    <td class="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td class="px-4 py-3 font-medium">
                      <a href={`/track/${track.id}`} class="hover:underline flex items-center gap-2">
                        {#if track.cover_url}
                          <img src={track.cover_url} alt={track.title} class="w-10 h-10 rounded" />
                        {:else}
                          <div class="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Music class="w-5 h-5 text-muted-foreground" />
                          </div>
                        {/if}
                        <span>{track.title}</span>
                      </a>
                    </td>
                    <td class="px-4 py-3">
                      <a href={`/artist/${track.artist?.id}`} class="hover:underline text-muted-foreground">
                        {track.artist?.artist_name || 'Unknown Artist'}
                      </a>
                    </td>
                    <td class="px-4 py-3 text-muted-foreground">{formatDuration(track.duration)}</td>
                    <td class="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" class="opacity-0 group-hover:opacity-100">
                        <Play class="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </section>
      {/if}
      
      <!-- Artists Section -->
      {#if data.results.artists.length > 0}
        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Artists</h2>
            {#if data.results.artists.length > 4}
              <Button variant="ghost" on:click={() => activeTab = 'artists'}>View All</Button>
            {/if}
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each data.results.artists.slice(0, 4) as artist}
              <a href={`/artist/${artist.id}`} class="group">
                <div class="aspect-square relative rounded-full overflow-hidden bg-muted mb-3">
                  {#if artist.profile_url}
                    <img src={artist.profile_url} alt={artist.artist_name} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center">
                      <Mic class="w-1/4 h-1/4 text-muted-foreground" />
                    </div>
                  {/if}
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button variant="secondary" size="icon" class="rounded-full">
                      <Play class="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <h3 class="font-medium text-center">{artist.artist_name}</h3>
                <p class="text-sm text-muted-foreground text-center">Artist</p>
              </a>
            {/each}
          </div>
        </section>
      {/if}
      
      <!-- Albums Section -->
      {#if data.results.albums.length > 0}
        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Albums</h2>
            {#if data.results.albums.length > 4}
              <Button variant="ghost" on:click={() => activeTab = 'albums'}>View All</Button>
            {/if}
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each data.results.albums.slice(0, 4) as album}
              <a href={`/album/${album.id}`} class="group">
                <div class="aspect-square relative rounded-md overflow-hidden bg-muted mb-3">
                  {#if album.cover_url}
                    <img src={album.cover_url} alt={album.title} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center">
                      <Disc class="w-1/4 h-1/4 text-muted-foreground" />
                    </div>
                  {/if}
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button variant="secondary" size="icon" class="rounded-full">
                      <Play class="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <h3 class="font-medium">{album.title}</h3>
                <p class="text-sm text-muted-foreground">
                  {album.artist?.artist_name || 'Unknown Artist'}
                </p>
              </a>
            {/each}
          </div>
        </section>
      {/if}
      
      {#if data.results.tracks.length === 0 && data.results.artists.length === 0 && data.results.albums.length === 0}
        <div class="text-center py-12">
          <h2 class="text-2xl font-semibold mb-2">No results found</h2>
          <p class="text-muted-foreground mb-8">We couldn't find any matches for "{data.query}"</p>
          <div class="max-w-md mx-auto">
            <h3 class="font-medium mb-2">Try:</h3>
            <ul class="list-disc text-left ml-8 space-y-1">
              <li>Checking your spelling</li>
              <li>Using fewer or different keywords</li>
              <li>Searching for a different artist or song</li>
              <li>Browsing genres instead</li>
            </ul>
          </div>
        </div>
      {/if}
    </TabsContent>
    
    <TabsContent value="tracks">
      <h2 class="text-2xl font-semibold mb-4">Tracks</h2>
      {#if data.results.tracks.length > 0}
        <div class="bg-card rounded-lg overflow-hidden">
          <table class="w-full table-auto">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-3 text-left">#</th>
                <th class="px-4 py-3 text-left">Title</th>
                <th class="px-4 py-3 text-left">Artist</th>
                <th class="px-4 py-3 text-left">Album</th>
                <th class="px-4 py-3 text-left">Duration</th>
                <th class="px-4 py-3 text-left sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each data.results.tracks as track, i}
                <tr class="border-b border-muted hover:bg-muted/20 group">
                  <td class="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td class="px-4 py-3 font-medium">
                    <a href={`/track/${track.id}`} class="hover:underline flex items-center gap-2">
                      {#if track.cover_url}
                        <img src={track.cover_url} alt={track.title} class="w-10 h-10 rounded" />
                      {:else}
                        <div class="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <Music class="w-5 h-5 text-muted-foreground" />
                        </div>
                      {/if}
                      <span>{track.title}</span>
                    </a>
                  </td>
                  <td class="px-4 py-3">
                    <a href={`/artist/${track.artist?.id}`} class="hover:underline text-muted-foreground">
                      {track.artist?.artist_name || 'Unknown Artist'}
                    </a>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">
                    {#if track.album_id}
                      <a href={`/album/${track.album_id}`} class="hover:underline">
                        Album
                      </a>
                    {:else}
                      Single
                    {/if}
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{formatDuration(track.duration)}</td>
                  <td class="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" class="opacity-0 group-hover:opacity-100">
                      <Play class="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="text-center py-8 bg-card rounded-lg">
          <p class="text-muted-foreground">No tracks found for "{data.query}"</p>
        </div>
      {/if}
    </TabsContent>
    
    <TabsContent value="artists">
      <h2 class="text-2xl font-semibold mb-4">Artists</h2>
      {#if data.results.artists.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {#each data.results.artists as artist}
            <a href={`/artist/${artist.id}`} class="group">
              <div class="aspect-square relative rounded-full overflow-hidden bg-muted mb-3">
                {#if artist.profile_url}
                  <img src={artist.profile_url} alt={artist.artist_name} class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full flex items-center justify-center">
                    <Mic class="w-1/4 h-1/4 text-muted-foreground" />
                  </div>
                {/if}
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="secondary" size="icon" class="rounded-full">
                    <Play class="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <h3 class="font-medium text-center">{artist.artist_name}</h3>
              <p class="text-sm text-muted-foreground text-center">Artist</p>
            </a>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 bg-card rounded-lg">
          <p class="text-muted-foreground">No artists found for "{data.query}"</p>
        </div>
      {/if}
    </TabsContent>
    
    <TabsContent value="albums">
      <h2 class="text-2xl font-semibold mb-4">Albums</h2>
      {#if data.results.albums.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {#each data.results.albums as album}
            <a href={`/album/${album.id}`} class="group">
              <div class="aspect-square relative rounded-md overflow-hidden bg-muted mb-3">
                {#if album.cover_url}
                  <img src={album.cover_url} alt={album.title} class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full flex items-center justify-center">
                    <Disc class="w-1/4 h-1/4 text-muted-foreground" />
                  </div>
                {/if}
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="secondary" size="icon" class="rounded-full">
                    <Play class="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <h3 class="font-medium">{album.title}</h3>
              <p class="text-sm text-muted-foreground">
                {album.artist?.artist_name || 'Unknown Artist'} • 
                {album.type || 'Album'}
              </p>
            </a>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 bg-card rounded-lg">
          <p class="text-muted-foreground">No albums found for "{data.query}"</p>
        </div>
      {/if}
    </TabsContent>
  </Tabs>
</div>
</div>
