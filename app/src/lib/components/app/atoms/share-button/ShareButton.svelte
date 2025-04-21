<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import ShareIcon from 'lucide-svelte/icons/share-2';

	let {
		content
	}: { content?: Partial<{ title: string; description: string } & { url?: string }> } = $props();

	function onShare() {
		navigator.share({
			url: content?.url || page.url.toString(),
			title: content?.title,
			text: content?.description
		});
	}
</script>

<Button
	size="icon"
	variant="ghost"
	class="bg-background/20 hover:bg-background/40 rounded-full"
	disabled
	onclick={() => onShare()}
>
	<ShareIcon class="h-5 w-5" />
</Button>
