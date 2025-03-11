<script lang="ts">
    import type { Track } from '$lib/types/player';
    import { Button } from '$lib/components/ui/button';
    import Thumbnail from '$lib/components/app/atoms/thumbnail/thumbnail.svelte';
    import HeartIcon from 'lucide-svelte/icons/heart';
    import PlayCircle from 'lucide-svelte/icons/play-circle';
    
    // Props
    let { 
        track, 
        index, 
        showIndex = true 
    }: { 
        track: Track; 
        index?: number; 
        showIndex?: boolean 
    } = $props();
    
    // Function to format play count numbers
    function formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }
    
    // Function to format duration
    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Handle play button click
    function onPlayClick() {
        // In a real app, this would trigger the audio player
        console.log(`Playing track: ${track.title}`);
    }
    
    // Handle like button click
    function onLikeClick() {
        console.log(`Liked track: ${track.title}`);
    }
</script>

<div class="group flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
    <div class="flex items-center gap-3">
        {#if showIndex && index !== undefined}
            <div class="flex items-center justify-center w-8 text-muted-foreground">
                <span class="group-hover:hidden">{index + 1}</span>
                <PlayCircle 
                    class="hidden group-hover:block h-6 w-6 text-primary cursor-pointer" 
                    onclick={onPlayClick}
                />
            </div>
        {/if}
        
        <Thumbnail coverURL={track.cover_url} />
        
        <div>
            <p class="font-medium truncate max-w-[200px] md:max-w-md">{track.title}</p>
            <p class="text-sm text-muted-foreground">{formatNumber(track.play_count)} plays</p>
        </div>
    </div>
    
    <div class="flex items-center gap-3">
        <Button 
            size="icon" 
            variant="ghost" 
            class="hidden group-hover:flex h-8 w-8 rounded-full"
            onclick={onLikeClick}
        >
            <HeartIcon class="h-4 w-4" />
        </Button>
        <span class="text-sm text-muted-foreground w-12 text-right">
            {formatDuration(track.duration)}
        </span>
    </div>
</div>