<script lang="ts">
    import type { Album } from '$lib/types/player';
    import { cn } from '$lib/utils.js';
    import Thumbnail from '$lib/components/app/atoms/thumbnail/thumbnail.svelte';
    import PlayCircle from 'lucide-svelte/icons/play-circle';
    
    // Props
    let { 
        album, 
        size = 'default',
        aspectRatio = 'square',
        className = ''
    }: { 
        album: Album;
        size?: 'default' | 'sm' | 'lg'; 
        aspectRatio?: 'square' | 'portrait' | 'video';
        className?: string;
    } = $props();
    
    // Size configuration
    const thumbnailSizes = {
        default: '',
        sm: 'max-w-[150px]',
        lg: 'max-w-[250px]'
    };
    
    // Get formatted year
    const releaseYear = new Date(album.release_date).getFullYear();
    
    // Handle play click
    function onPlayClick() {
        console.log(`Playing album: ${album.title}`);
    }
</script>

<div class={cn("space-y-3", thumbnailSizes[size], className)}>
    <div class="overflow-hidden rounded-md">
        <div 
            class={cn(
                "overflow-hidden rounded-md cursor-pointer relative group",
                aspectRatio === "portrait" ? "aspect-[3/4]" : 
                aspectRatio === "video" ? "aspect-video" : 
                "aspect-square"
            )}
            onclick={onPlayClick}
        >
            {#if album.cover_url}
                <img 
                    src={album.cover_url} 
                    alt={album.title}
                    class="h-auto w-full object-cover transition-all group-hover:scale-105"
                />
            {:else}
                <div class="h-full w-full bg-muted flex items-center justify-center">
                    <PlayCircle class="h-10 w-10 text-muted-foreground" />
                </div>
            {/if}
            
            <!-- Play overlay -->
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle class="h-12 w-12 text-white" />
            </div>
        </div>
    </div>
    
    <a href="/album/{album.id}" class="block group">
        <h3 class="font-medium truncate group-hover:text-primary">{album.title}</h3>
        <p class="text-sm text-muted-foreground">{releaseYear} • {album.track_count} tracks</p>
    </a>
</div>