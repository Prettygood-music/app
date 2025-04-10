<script lang="ts">
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import { Music, Mic, Disc, Search } from 'lucide-svelte';
  
  let {
    query = '',
    visible = false,
    recentSearches = [],
    suggestionArtists = [],
    suggestionTracks = [],
    suggestionAlbums = [],
    loading = false
  } = $props<{
    query?: string;
    visible?: boolean;
    recentSearches?: string[];
    suggestionArtists?: Array<{ id: string, artist_name: string }>;
    suggestionTracks?: Array<{ id: string, title: string, artist?: { artist_name: string } }>;
    suggestionAlbums?: Array<{ id: string, title: string, artist?: { artist_name: string } }>;
    loading?: boolean;
  }>();
  
  const dispatch = createEventDispatcher();
  
  function handleSelectSuggestion(suggestion: string) {
    dispatch('select', suggestion);
    goto(`/search/${encodeURIComponent(suggestion)}`);
  }
  
  function handleNavigate(path: string) {
    dispatch('close');
    goto(path);
  }
</script>

{#if visible && query.length > 0}
  <div class="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-96 overflow-y-auto">
    {#if loading}
      <div class="p-4 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-sm text-muted-foreground mt-2">Searching...</p>
      </div>
    {:else}
      <div class="p-2">
        <!-- Direct search suggestion -->
        <button 
          class="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
          onclick={() => handleSelectSuggestion(query)}
        >
          <Search class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span>Search for "<strong>{query}</strong>"</span>
        </button>
        
        <!-- Track suggestions -->
        {#if suggestionTracks.length > 0}
          <div class="mt-2 pt-2 border-t border-border">
            <p class="text-xs text-muted-foreground px-2 mb-1">TRACKS</p>
            {#each suggestionTracks as track}
              <button 
                class="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
                onclick={() => handleNavigate(`/track/${track.id}`)}
              >
                <Music class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div class="overflow-hidden">
                  <p class="truncate">{track.title}</p>
                  {#if track.artist}
                    <p class="text-xs text-muted-foreground truncate">
                      {track.artist.artist_name}
                    </p>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
        
        <!-- Artist suggestions -->
        {#if suggestionArtists.length > 0}
          <div class="mt-2 pt-2 border-t border-border">
            <p class="text-xs text-muted-foreground px-2 mb-1">ARTISTS</p>
            {#each suggestionArtists as artist}
              <button 
                class="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
                onclick={() => handleNavigate(`/artist/${artist.id}`)}
              >
                <Mic class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div class="overflow-hidden">
                  <p class="truncate">{artist.artist_name}</p>
                </div>
              </button>
            {/each}
          </div>
        {/if}
        
        <!-- Album suggestions -->
        {#if suggestionAlbums.length > 0}
          <div class="mt-2 pt-2 border-t border-border">
            <p class="text-xs text-muted-foreground px-2 mb-1">ALBUMS</p>
            {#each suggestionAlbums as album}
              <button 
                class="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
                onclick={() => handleNavigate(`/album/${album.id}`)}
              >
                <Disc class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div class="overflow-hidden">
                  <p class="truncate">{album.title}</p>
                  {#if album.artist}
                    <p class="text-xs text-muted-foreground truncate">
                      {album.artist.artist_name}
                    </p>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
        
        <!-- Recent searches -->
        {#if recentSearches.length > 0 && query.length < 2}
          <div class="mt-2 pt-2 border-t border-border">
            <p class="text-xs text-muted-foreground px-2 mb-1">RECENT SEARCHES</p>
            {#each recentSearches as search}
              <button 
                class="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
                onclick={() => handleSelectSuggestion(search)}
              >
                <Search class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span>{search}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
