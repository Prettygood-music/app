<script lang="ts">
  import type { Genre } from '$lib/services/genres';
  import GenreCard from './GenreCard.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton';
  
  // Props
  let { 
    genres = [], 
    isLoading = false, 
    error = null,
    columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    size = 'medium'
  } = $props<{
    genres: Genre[];
    isLoading?: boolean;
    error?: Error | null;
    columns?: string;
    size?: 'small' | 'medium' | 'large';
  }>();
</script>

<div class="w-full">
  {#if isLoading}
    <div class="grid {columns} gap-4">
      {#each Array(10) as _}
        <Skeleton class={size === 'large' ? 'h-48' : size === 'small' ? 'h-24' : 'h-36'} />
      {/each}
    </div>
  {:else if error}
    <div class="p-4 bg-destructive/10 text-destructive rounded-md">
      <p>Error loading genres: {error.message}</p>
    </div>
  {:else if genres.length === 0}
    <div class="p-4 bg-muted rounded-md text-center">
      <p>No genres found</p>
    </div>
  {:else}
    <div class="grid {columns} gap-4">
      {#each genres as genre (genre.id)}
        <GenreCard {genre} {size} />
      {/each}
    </div>
  {/if}
</div>
