<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
    import { cn } from '$lib/utils.js';
    
    // Props
    let { 
        id,
        name,
        avatarUrl,
        size = 'default',
        className = ''
    }: { 
        id: string;
        name: string;
        avatarUrl: string | null;
        size?: 'default' | 'sm' | 'lg';
        className?: string;
    } = $props();
    
    // Size configuration
    const sizes = {
        default: 'w-[160px]',
        sm: 'w-[120px]',
        lg: 'w-[200px]'
    };
    
    const avatarSizes = {
        default: 'h-32 w-32',
        sm: 'h-24 w-24',
        lg: 'h-40 w-40'
    };
    
    // Handle click
    function onArtistClick() {
        window.location.href = `/artist/${id}`;
    }
</script>

<div class={cn("text-center", sizes[size], className)}>
    <Avatar 
        class={cn("mx-auto mb-2 cursor-pointer", avatarSizes[size])}
        onclick={onArtistClick}
    >
        <AvatarImage 
            src={avatarUrl || ''} 
            alt={name} 
        />
        <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <h3 class="font-medium">{name}</h3>
    <p class="text-sm text-muted-foreground">Artist</p>
</div>