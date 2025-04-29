<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { getAnalyticsContext } from '$lib/services';
	import HeartIcon from 'lucide-svelte/icons/heart';

	// Props
	let {
		isLiked = false,
		kind,
		id
	}: { isLiked?: boolean; kind: 'album' | 'track' | 'playlist'; id: string } = $props();

	async function onClick() {
		console.log(`Album liked: ${isLiked}`);
		let cb: VoidFunction | null = null;
		switch (kind) {
			case 'album':
				cb = isLiked ? () => analytics.onAlbumUnlike(id) : () => analytics.onAlbumLike(id);
				break;
			case 'track':
				// Handle track like
				cb = isLiked ? () => analytics.onTrackUnlike(id) : () => analytics.onTrackLike(id);
				break;
			case 'playlist':
				// TODO: Implement album like
				//await analytics.onAlbonumLike(id);
				break;

			default:
				console.error('Unknown kind');
				return;
		}
		cb?.();
		isLiked = !isLiked;
	}

	const analytics = getAnalyticsContext();
</script>

<Button
	variant={isLiked ? 'default' : 'ghost'}
	size="icon"
	class="rounded-full"
	disabled={!analytics.isAuthenticated}
	onclick={() => onClick()}
>
	<HeartIcon class="h-5 w-5" />
</Button>
