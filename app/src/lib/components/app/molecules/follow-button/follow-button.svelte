<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	import { getAnalyticsContext } from '$lib/services';
	let { isFollowing = $bindable(false), artistID }: { isFollowing: boolean; artistID: string } =
		$props();
	const analytics = getAnalyticsContext();

	async function toggleFollow() {
		if (isFollowing) {
			analytics.onArtistUnfollow(artistID);
		} else {
			analytics.onArtistFollow(artistID);
		}
		isFollowing = !isFollowing;
	}
</script>

<Button onclick={toggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
	{isFollowing ? 'Following' : 'Follow'}
</Button>
