<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import type { Genre } from '$lib/services/genres';
  
  // Props
  let { genre, size = 'medium' } = $props<{
    genre: Genre;
    size?: 'small' | 'medium' | 'large';
  }>();
  
  // Generate background style
  let backgroundStyle = $derived(() => {
    if (genre.image_url) {
      return `background-image: url(${genre.image_url}); background-size: cover; background-position: center;`;
    }
    return `background-color: ${genre.color || '#374151'};`;
  });
  
  // Determine card size classes
  let sizeClasses = $derived(() => {
    switch (size) {
      case 'small':
        return 'h-24 p-3';
      case 'large':
        return 'h-48 p-6';
      case 'medium':
      default:
        return 'h-36 p-4';
    }
  });
  
  // Generate link URL
  let href = $derived(() => {
    if (genre.slug) {
      return `/genres/${genre.slug}`;
    }
    return `/genres/${genre.id}`;
  });
</script>

<a {href} class="block transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  <Card 
    class="group relative overflow-hidden {sizeClasses} w-full flex flex-col justify-end"
    style={backgroundStyle}
  >
    <!-- Optional gradient overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- Content -->
    <div class="relative z-10 text-white">
      <h3 class="font-bold text-lg md:text-xl">{genre.name}</h3>
      
      {#if genre.track_count || genre.artist_count}
        <div class="text-xs text-white/80 mt-1">
          {#if genre.track_count}
            <span>{genre.track_count} tracks</span>
          {/if}
          
          {#if genre.track_count && genre.artist_count}
            <span class="mx-1">•</span>
          {/if}
          
          {#if genre.artist_count}
            <span>{genre.artist_count} artists</span>
          {/if}
        </div>
      {/if}
    </div>
  </Card>
</a>
