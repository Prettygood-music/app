<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	// Props
	export let progress: number = 0;
	export let total: number = 100;
	export let showText: boolean = true;
	export let textFormat: 'percentage' | 'fraction' | 'custom' = 'percentage';
	export let customText: string = '';
	export let height: string = '0.5rem';
	export let animated: boolean = true;
	export let color: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'primary';
	export let interactive: boolean = false;
	export let rounded: boolean = true;

	// Runes
	let $progressPercentage = 0;
	let $progressElement: HTMLDivElement | null = null;
	let $isHovered = false;
	let $hoverPosition = 0;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		change: { progress: number; percentage: number };
		complete: { progress: number };
	}>();

	// Calculate percentage value
	$: {
		$progressPercentage = Math.min(100, Math.max(0, (progress / total) * 100));

		// Dispatch complete event when progress reaches total
		if (progress === total && total > 0) {
			dispatch('complete', { progress });
		}
	}

	// Color map for different states
	const colorMap = {
		default: 'var(--muted-foreground)',
		primary: 'var(--primary)',
		success: 'var(--success, #10b981)',
		warning: 'var(--warning, #f59e0b)',
		danger: 'var(--destructive)'
	};

	// Format progress text based on selected format
	function formatProgressText(): string {
		if (customText) return customText;

		switch (textFormat) {
			case 'percentage':
				return `${Math.round($progressPercentage)}%`;
			case 'fraction':
				return `${progress}/${total}`;
			default:
				return `${Math.round($progressPercentage)}%`;
		}
	}

	// Handle click on the progress bar (for interactive mode)
	function handleClick(event: MouseEvent) {
		if (!interactive || !$progressElement) return;

		const rect = $progressElement.getBoundingClientRect();
		const clickPosition = event.clientX - rect.left;
		const percentage = (clickPosition / rect.width) * 100;
		const newProgress = Math.round((percentage / 100) * total);

		progress = Math.min(total, Math.max(0, newProgress));
		dispatch('change', { progress, percentage: $progressPercentage });
	}

	// Handle mouse move for interactive hover effect
	function handleMouseMove(event: MouseEvent) {
		if (!interactive || !$progressElement) return;

		const rect = $progressElement.getBoundingClientRect();
		$hoverPosition = ((event.clientX - rect.left) / rect.width) * 100;
	}
</script>

<div class="progress-indicator" class:interactive class:rounded>
	<div
		class="progress-container"
		class:rounded
		style="height: {height};"
		bind:this={$progressElement}
		on:click={handleClick}
		on:mousemove={handleMouseMove}
		on:mouseenter={() => ($isHovered = true)}
		on:mouseleave={() => ($isHovered = false)}
	>
		<div
			class="progress-bar {color}"
			class:animated
			style="width: {$progressPercentage}%; --progress-color: {colorMap[color]};"
		></div>

		{#if interactive && $isHovered}
			<div class="hover-indicator" style="left: {$hoverPosition}%;"></div>
		{/if}
	</div>

	{#if showText}
		<div class="progress-text">{formatProgressText()}</div>
	{/if}
</div>

<style>
	.progress-indicator {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-container {
		position: relative;
		width: 100%;
		background-color: var(--secondary);
		overflow: hidden;
	}

	.progress-container.rounded {
		border-radius: 9999px;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--progress-color, var(--primary));
		transition: width 0.3s ease;
	}

	.progress-bar.animated {
		position: relative;
		overflow: hidden;
	}

	.progress-bar.animated::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: shine 1.5s infinite linear;
		transform: translateX(-100%);
	}

	@keyframes shine {
		to {
			transform: translateX(100%);
		}
	}

	.progress-text {
		font-size: 0.875rem;
		color: var(--foreground);
		text-align: center;
	}

	.interactive .progress-container {
		cursor: pointer;
	}

	.hover-indicator {
		position: absolute;
		top: 0;
		width: 2px;
		height: 100%;
		background-color: var(--foreground);
		opacity: 0.5;
		pointer-events: none;
		transform: translateX(-50%);
	}

	.progress-bar.default {
		background-color: var(--muted-foreground);
	}

	.progress-bar.primary {
		background-color: var(--primary);
	}

	.progress-bar.success {
		background-color: var(--success, #10b981);
	}

	.progress-bar.warning {
		background-color: var(--warning, #f59e0b);
	}

	.progress-bar.danger {
		background-color: var(--destructive);
	}
</style>
