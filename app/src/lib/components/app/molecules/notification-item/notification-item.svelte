<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	// Notification type definition
	export interface NotificationAction {
		label: string;
		action: string;
	}

	// Props
	export let id: string;
	export let image: string;
	export let text: string;
	export let time: string;
	export let read: boolean = false;
	export let action: NotificationAction | null = null;
	export let autoHide: boolean = false;
	export let hideAfter: number = 5000; // ms

	// Runes
	let $isHovered = false;
	let $isVisible = true;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		view: { id: string };
		action: { id: string; action: string };
		dismiss: { id: string };
	}>();

	// Handle notification click
	function handleClick() {
		if (!read) {
			markAsRead();
		}
		dispatch('view', { id });
	}

	// Handle notification action click
	function handleActionClick() {
		if (action) {
			dispatch('action', { id, action: action.action });
		}
	}

	// Mark notification as read
	function markAsRead() {
		read = true;
	}

	// Dismiss notification
	function dismiss() {
		$isVisible = false;
		dispatch('dismiss', { id });
	}

	// Auto hide setup (if enabled)
	onMount(() => {
		if (autoHide) {
			setTimeout(() => {
				dismiss();
			}, hideAfter);
		}
	});
</script>

{#if $isVisible}
	<div
		class="notification-item"
		class:read
		class:hovered={$isHovered}
		on:mouseenter={() => {
			$isHovered = true;
			markAsRead();
		}}
		on:mouseleave={() => ($isHovered = false)}
		onclick={handleClick}
	>
		<img class="notification-image" src={image} alt="Notification" />

		<div class="notification-content">
			<span class="notification-text">{@html text}</span>
			<span class="notification-time">{time}</span>
		</div>

		{#if action}
			<button class="notification-action" onclick|stopPropagation={handleActionClick}>
				{action.label}
			</button>
		{/if}

		<button class="notification-dismiss" onclick|stopPropagation={dismiss}>
			<svg viewBox="0 0 24 24" width="16" height="16">
				<path
					d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
				/>
			</svg>
		</button>
	</div>
{/if}

<style>
	.notification-item {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--background);
		border-radius: var(--radius);
		border-left: 3px solid var(--primary);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
	}

	.notification-item.read {
		border-left-color: var(--muted);
		opacity: 0.8;
	}

	.notification-item.hovered {
		background: var(--secondary);
	}

	.notification-image {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.notification-content {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.notification-text {
		font-size: 0.875rem;
		line-height: 1.4;
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.notification-time {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-top: 0.25rem;
	}

	.notification-action {
		background-color: var(--primary);
		color: var(--primary-foreground);
		border: none;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
		white-space: nowrap;
	}

	.notification-action:hover {
		background-color: color-mix(in srgb, var(--primary) 90%, black);
	}

	.notification-dismiss {
		background: none;
		border: none;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--muted-foreground);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.notification-dismiss:hover {
		background-color: var(--muted);
		color: var(--foreground);
	}

	.notification-dismiss svg {
		fill: currentColor;
	}
</style>
