<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import { getUserContext } from '$lib/state/user/user.svelte';
	import type { Track } from '$lib/types';
	import { MinusIcon, PlusIcon } from 'lucide-svelte';

	const user = getUserContext();
	const playerState = getPlayerContext();

	let { track }: { track: Track } = $props();

	let trackID = $derived(track.id);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<PlusIcon class=" h-4 w-4" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => playerState.addToQueue(track)}>
				<PlusIcon class="h-4 w-4" />
				Add to Queue
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator></DropdownMenu.Separator>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Add to Playlist</DropdownMenu.GroupHeading>
			{#each user.playlists as playlist}
				{@const isInPlaylist = playlist.tracks.map((t) => t.id).includes(trackID)}
				<DropdownMenu.Item
					onclick={() =>
						isInPlaylist
							? user.removeTrackFromPlaylist(playlist.id, trackID)
							: user.addTrackToPlaylist(playlist.id, trackID)}
				>
					{#if isInPlaylist}
						<MinusIcon class="h-4 w-4" />
					{:else}
						<PlusIcon class="h-4 w-4" />
					{/if}
					{playlist.name}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
