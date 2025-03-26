<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { EnhancedSearchBar } from '$lib/components/search';
  import { Search } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Search - prettygood.music</title>
</svelte:head>

<div class="container max-w-5xl mx-auto py-8 px-4">
  <h1 class="text-3xl font-bold mb-6">Search Music</h1>
  
  <div class="mb-8">
    <EnhancedSearchBar />
  </div>
  
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold mb-4">Popular Searches</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {#each ['Hip Hop', 'Electronic', 'Rock', 'Jazz', 'Pop', 'Indie', 'R&B', 'Classical'] as genre}
          <Button 
            variant="outline" 
            class="h-auto py-3 text-left justify-start"
            on:click={() => goto(`/search/${encodeURIComponent(genre)}`)}
          >
            {genre}
          </Button>
        {/each}
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Browse Categories</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {#each [
          { name: 'New Releases', icon: '🆕' },
          { name: 'Top Charts', icon: '📊' },
          { name: 'Podcasts', icon: '🎙️' },
          { name: 'Live Events', icon: '🎫' },
          { name: 'Mood', icon: '😊' },
          { name: 'Workout', icon: '💪' },
          { name: 'Focus', icon: '🧠' },
          { name: 'Sleep', icon: '😴' }
        ] as category}
          <div 
            class="bg-card p-4 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
            on:click={() => goto(`/search/${encodeURIComponent(category.name)}`)}
          >
            <div class="text-3xl mb-2">{category.icon}</div>
            <div class="font-medium">{category.name}</div>
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>
