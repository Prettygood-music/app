<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let volume: number = 70;
	export let isMuted: boolean = false;
	export let showTooltip: boolean = true;
	export let maxWidth: string = '100%';

	// Runes
	let $isSliding = false;
	let $showVolumeTooltip = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		volumeChange: { volume: number };
		toggleMute: { isMuted: boolean };
	}>();

	// Get the appropriate volume icon based on current volume and mute state
	function getVolumeIconPath(): string {
		if (isMuted || volume === 0) {
			return 'M3 9v6h4l5 5V4L7 9H3z';
		} else if (volume < 50) {
			return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z';
		} else {
			return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
		}
	}

	// Handle volume change events
	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		volume = parseInt(target.value, 10);
		if (volume > 0 && isMuted) {
			isMuted = false;
		}
		dispatch('volumeChange', { volume });
	}

	// Toggle mute state
	function toggleMute() {
		isMuted = !isMuted;
		dispatch('toggleMute', { isMuted });
	}
</script>

<div class="volume-control" style="max-width: {maxWidth};">
	<button
		class="volume-icon"
		onclick={toggleMute}
		on:mouseenter={() => ($showVolumeTooltip = true)}
		on:mouseleave={() => ($showVolumeTooltip = false)}
	>
		<svg viewBox="0 0 24 24">
			<path d={getVolumeIconPath()} />
		</svg>

		{#if showTooltip && $showVolumeTooltip}
			<span class="tooltip">{isMuted ? 'Unmute' : 'Mute'}</span>
		{/if}
	</button>

	<input
		type="range"
		min="0"
		max="100"
		bind:value={volume}
		disabled={isMuted}
		class="volume-slider"
		class:muted={isMuted}
		on:input={handleVolumeChange}
		on:change={handleVolumeChange}
		on:mousedown={() => ($isSliding = true)}
		on:mouseup={() => ($isSliding = false)}
	/>

	{#if $isSliding}
		<div class="volume-value">{volume}%</div>
	{/if}
</div>

<style>
	.volume-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
	}

	.volume-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: var(--foreground);
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.2s ease;
		position: relative;
	}

	.volume-icon:hover {
		background-color: var(--secondary);
	}

	.volume-icon svg {
		width: 1.25rem;
		height: 1.25rem;
		fill: currentColor;
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 0.5rem;
		background-color: var(--popover);
		color: var(--popover-foreground);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius);
		font-size: 0.75rem;
		white-space: nowrap;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-width: 4px;
		border-style: solid;
		border-color: var(--popover) transparent transparent transparent;
	}

	.volume-slider {
		-webkit-appearance: none;
		width: 100%;
		height: 4px;
		background: var(--border);
		border-radius: 2px;
		outline: none;
		transition: opacity 0.2s;
	}

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--foreground);
		cursor: pointer;
		transition: transform 0.1s;
	}

	.volume-slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--foreground);
		cursor: pointer;
		transition: transform 0.1s;
		border: none;
	}

	.volume-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.volume-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
	}

	.volume-slider.muted {
		opacity: 0.5;
	}

	.volume-value {
		position: absolute;
		top: -20px;
		right: 0;
		background-color: var(--popover);
		color: var(--popover-foreground);
		padding: 2px 6px;
		border-radius: var(--radius);
		font-size: 0.75rem;
		pointer-events: none;
	}
</style>
