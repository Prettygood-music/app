<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let isPlaying: boolean = false;
	export let showAlways: boolean = false;
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let itemId: string;
	export let disabled: boolean = false;

	// Runes
	let $isHovered = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		play: { id: string };
		pause: { id: string };
	}>();

	// Size mappings for the button
	const sizeMap = {
		small: {
			button: '2.5rem',
			icon: '1rem'
		},
		medium: {
			button: '3.5rem',
			icon: '1.5rem'
		},
		large: {
			button: '4.5rem',
			icon: '2rem'
		}
	};

	// Handle play/pause toggle
	function togglePlayPause() {
		if (disabled) return;

		if (isPlaying) {
			dispatch('pause', { id: itemId });
		} else {
			dispatch('play', { id: itemId });
		}
	}
</script>

<div
	class="play-button-overlay {size}"
	class:visible={showAlways || $isHovered || isPlaying}
	class:playing={isPlaying}
	class:disabled
	on:mouseenter={() => ($isHovered = true)}
	on:mouseleave={() => ($isHovered = false)}
>
	<button
		class="play-button"
		onclick={togglePlayPause}
		{disabled}
		style="--button-size: {sizeMap[size].button}; --icon-size: {sizeMap[size].icon};"
	>
		{#if isPlaying}
			<svg class="pause-icon" viewBox="0 0 24 24">
				<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
			</svg>
		{:else}
			<svg class="play-icon" viewBox="0 0 24 24">
				<path d="M8 5v14l11-7z" />
			</svg>
		{/if}
	</button>
</div>

<style>
	.play-button-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.3);
		opacity: 0;
		transition: opacity 0.2s ease;
		border-radius: inherit;
	}

	.play-button-overlay.visible {
		opacity: 1;
	}

	.play-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--button-size);
		height: var(--button-size);
		border-radius: 50%;
		background-color: var(--primary);
		color: var(--primary-foreground);
		border: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background-color 0.2s ease;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.play-button:hover {
		transform: scale(1.1);
		background-color: color-mix(in srgb, var(--primary) 90%, black);
	}

	.play-button:active {
		transform: scale(0.95);
	}

	.play-icon,
	.pause-icon {
		width: var(--icon-size);
		height: var(--icon-size);
		fill: currentColor;
	}

	.play-icon {
		margin-left: 2px; /* Optical centering for the play icon */
	}

	.disabled {
		cursor: not-allowed;
	}

	.disabled .play-button {
		background-color: var(--muted);
		cursor: not-allowed;
		transform: none;
	}

	.disabled .play-button:hover {
		transform: none;
		background-color: var(--muted);
	}
</style>
