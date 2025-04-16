<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	import TipIcon from 'lucide-svelte/icons/coins';
	import ShareIcon from 'lucide-svelte/icons/share-2';

	let { children, data } = $props();
	let artist = $derived(data.artist);

	// TODO: track if user is following
	let isFollowing = $state(false);

	function toggleFollow() {
		isFollowing = !isFollowing;
		// TODO: implement follow toggle
		//onToggleFollow(isFollowing);
	}

	async function onShare(artist: typeof data.artist) {
		// TODO: Implement onShare
	}

	function onTipArtist(artist: typeof data.artist) {
		// This would integrate with the Sui wallet functionality
		console.log(`User wants to tip artist: ${artist.id}`);
		alert('Tipping functionality would integrate with Sui wallet');
	}
</script>

<div class="flex flex-col overflow-y-auto">
	<!-- Artist Header with Cover Image -->
	<div class="relative min-h-80 w-full overflow-hidden">
		{#if artist.cover_url}
			<img
				src={artist.cover_url}
				alt={`${artist.artist_name} cover image`}
				class="h-full w-full object-cover"
			/>
		{:else}
			<div class="from-primary/20 to-primary/40 h-full w-full bg-gradient-to-r"></div>
		{/if}

		<div class="from-background absolute inset-0 bg-gradient-to-t to-transparent"></div>

		<div class="absolute inset-x-0 bottom-0">
			<div class="container flex w-full flex-col items-end gap-4 p-6 md:flex-row md:items-center">
				<Avatar.Root class="border-background h-24 w-24 border-4 md:h-36 md:w-36">
					<Avatar.Image src={artist?.avatar_url || ''} alt={artist.artist_name} />
					<Avatar.Fallback>{artist.artist_name.substring(0, 2)}</Avatar.Fallback>
				</Avatar.Root>

				<div class="flex-1">
					<h1 class="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
						{artist.artist_name}
					</h1>
					<div class="mt-2 flex items-center gap-2">
						<Badge variant="secondary" class="text-xs">ARTIST</Badge>
						<span class="text-sm text-white/80"
							>{artist.stats?.monthlyListeners || '25.4M'} monthly listeners</span
						>
					</div>
				</div>

				<div class="flex gap-2">
					<Button
						size="icon"
						variant="ghost"
						class="bg-background/20 hover:bg-background/40 rounded-full"
						onclick={() => onShare(artist)}
					>
						<ShareIcon class="h-5 w-5" />
					</Button>
					<Button onclick={toggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
						{isFollowing ? 'Following' : 'Follow'}
					</Button>
					<Button variant="default" onclick={() => onTipArtist(artist)}>
						<TipIcon class="mr-2 h-4 w-4" />
						Tip Artist
					</Button>
				</div>
			</div>
		</div>
	</div>
	<div class="container mx-auto px-4 py-6">
		{@render children()}
	</div>
</div>
