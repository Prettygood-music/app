<script lang="ts">
	import ShareButton from '$lib/components/app/atoms/share-button/ShareButton.svelte';
	import FollowButton from '$lib/components/app/molecules/follow-button/follow-button.svelte';
	import TipButton from '$lib/components/app/molecules/tip-button/TipButton.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { getAnalyticsContext } from '$lib/services/analytics/analytics.svelte.js';
	import ImageFallback from '../../playlist/[id]/imageFallback.svelte';

	let { children, data } = $props();
	let artist = $derived(data.artist);
	const analytics = getAnalyticsContext();
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
			<div class="from-primary/20 to-primary/80 h-full w-full bg-gradient-to-r"></div>
		{/if}

		<div class="from-muted/70 absolute inset-0 bg-gradient-to-b rounded-t-md to-transparent"></div>

		<div class="absolute inset-x-0 bottom-0">
			<div class="container flex w-full flex-col items-end gap-4 p-6 md:flex-row md:items-center">
				<ImageFallback
					src={artist.avatar}
					name={artist.artist_name}
					class="h-24 w-24 rounded-full border-4 md:h-36 md:w-36"
				></ImageFallback>

				<div class="flex-1">
					<h1 class="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
						{artist.artist_name}
					</h1>
					<div class="mt-2 flex items-center gap-2">
						<Badge variant="secondary" class="text-xs">ARTIST</Badge>
						<!-- TODO: fix monthly listeners count -->
						<span class="text-sm text-white/80"
							>{artist.stats?.monthlyListeners || '25.4M'} monthly listeners</span
						>
					</div>
				</div>

				<div class="flex gap-2">
					<ShareButton cb={() => analytics.onArtistShare(artist.id)}></ShareButton>
					<FollowButton isFollowing={data.isUserFollowing} artistID={artist.id}></FollowButton>

					{#if data.artist.payout_address.wallet_address}
						<TipButton recipient={data.artist.payout_address.wallet_address}></TipButton>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="container mx-auto px-4 py-6">
		{@render children()}
	</div>
</div>
