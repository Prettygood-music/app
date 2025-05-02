<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	import { getAnalyticsContext } from '$lib/services';
	let {} = $props();

	let isFollowing = $state(false);
	async function toggleFollow() {
		isFollowing = !isFollowing;
	}
</script>

<Button onclick={toggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
	{isFollowing ? 'Following' : 'Follow'}
</Button>
