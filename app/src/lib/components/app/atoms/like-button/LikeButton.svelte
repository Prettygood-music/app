<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { getAnalyticsContext } from '$lib/services';
	import HeartIcon from 'lucide-svelte/icons/heart';

	// Props
	let { isLiked = false }: { isLiked?: boolean } = $props();

	// Handle like button click
	function onLikeClick() {
		console.log(`Album liked: ${isLiked}`);
	}

	// Handle share button click
	function onShareClick() {
		console.log('Album shared');
	}

	const analytics = getAnalyticsContext();
</script>

<Button variant={isLiked ? 'default' : 'ghost'} size="icon" class="rounded-full" disabled>
	<HeartIcon class="h-5 w-5" />
</Button>
