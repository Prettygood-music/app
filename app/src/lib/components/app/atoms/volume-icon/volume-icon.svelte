<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import NoVolumeIcon from 'lucide-svelte/icons/volume';
	import LowVolumeIcon from 'lucide-svelte/icons/volume-1';
	import HighVolumeIcon from 'lucide-svelte/icons/volume-2';
	import MutedVolumeIcon from 'lucide-svelte/icons/volume-off';

	let { volume, muted } = $props();

	const playerState = getPlayerContext();
</script>

<Button size="icon" variant="ghost" onclick={() => playerState.toggleMute()}>
	<div>
		{#if muted}
			<MutedVolumeIcon></MutedVolumeIcon>
		{:else if volume === 0}
			<NoVolumeIcon></NoVolumeIcon>
		{:else if volume < 0.5}
			<LowVolumeIcon></LowVolumeIcon>
		{:else}
			<HighVolumeIcon></HighVolumeIcon>
		{/if}
	</div>
</Button>
