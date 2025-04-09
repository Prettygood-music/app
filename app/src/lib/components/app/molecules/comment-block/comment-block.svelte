<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Comment interface
	export interface Comment {
		id: string;
		userId: string;
		username: string;
		avatar: string;
		text: string;
		timestamp: string | Date;
		likes: number;
		isLiked: boolean;
		replies?: Comment[];
	}

	// Props
	export let comment: Comment;
	export let level: number = 0;
	export let maxLevel: number = 3;
	export let showReplies: boolean = true;
	export let compact: boolean = false;

	// Runes
	let $isReplying = false;
	let $replyText = '';
	let $showRepliesList = false;
	let $isHovered = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		like: { id: string; liked: boolean };
		reply: { id: string; text: string };
		delete: { id: string };
		report: { id: string };
		userClick: { userId: string };
	}>();

	// Format timestamp
	function formatTimestamp(timestamp: string | Date): string {
		if (!timestamp) return '';

		const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSecs = Math.floor(diffMs / 1000);
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffSecs < 60) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString();
	}

	// Handle like button click
	function handleLike() {
		dispatch('like', { id: comment.id, liked: !comment.isLiked });
	}

	// Handle reply button click
	function handleReplyClick() {
		$isReplying = !$isReplying;
		if (!$isReplying) $replyText = '';
	}

	// Handle reply submit
	function handleReplySubmit() {
		if (!$replyText.trim()) return;

		dispatch('reply', { id: comment.id, text: $replyText });
		$replyText = '';
		$isReplying = false;
	}

	// Toggle showing replies
	function toggleReplies() {
		$showRepliesList = !$showRepliesList;
	}

	// Handle user avatar or name click
	function handleUserClick() {
		dispatch('userClick', { userId: comment.userId });
	}

	// Handle comment menu actions
	function handleDelete() {
		dispatch('delete', { id: comment.id });
	}

	function handleReport() {
		dispatch('report', { id: comment.id });
	}
</script>

<div
	class="comment-block"
	class:compact
	class:hovered={$isHovered}
	style="--indent: {level * 1.5}rem;"
	on:mouseenter={() => ($isHovered = true)}
	on:mouseleave={() => ($isHovered = false)}
>
	<div class="comment-container">
		<button class="commenter-avatar" onclick={handleUserClick}>
			<img src={comment.avatar} alt={`${comment.username}'s avatar`} />
		</button>

		<div class="comment-content">
			<div class="commenter-info">
				<button class="commenter-name" onclick={handleUserClick}>{comment.username}</button>
				<span class="comment-time">{formatTimestamp(comment.timestamp)}</span>
			</div>

			<div class="comment-text">{comment.text}</div>

			<div class="comment-actions">
				<button
					class="action-button like-comment"
					class:liked={comment.isLiked}
					onclick={handleLike}
				>
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path
							d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
						/>
					</svg>
					<span
						>{comment.isLiked ? 'Liked' : 'Like'}
						{comment.likes > 0 ? `(${comment.likes})` : ''}</span
					>
				</button>

				{#if level < maxLevel}
					<button class="action-button reply-comment" onclick={handleReplyClick}>
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
						</svg>
						<span>Reply</span>
					</button>
				{/if}

				<div class="menu-container">
					<button class="action-button more-options">
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
							/>
						</svg>
					</button>

					<div class="comment-menu">
						<button class="menu-item" onclick={handleReport}>
							<svg viewBox="0 0 24 24" width="16" height="16">
								<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
							</svg>
							<span>Report</span>
						</button>

						{#if comment.userId === 'current-user-id'}
							<!-- Replace with actual current user check -->
							<button class="menu-item delete" onclick={handleDelete}>
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
									/>
								</svg>
								<span>Delete</span>
							</button>
						{/if}
					</div>
				</div>
			</div>

			{#if $isReplying}
				<div class="reply-form">
					<textarea bind:value={$replyText} placeholder="Write a reply..." rows="2"></textarea>
					<div class="reply-actions">
						<button class="cancel-reply" onclick={handleReplyClick}>Cancel</button>
						<button class="submit-reply" onclick={handleReplySubmit} disabled={!$replyText.trim()}>
							Reply
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if showReplies && comment.replies && comment.replies.length > 0}
		<div class="replies-section">
			{#if comment.replies.length > 3 && !$showRepliesList}
				<button class="show-replies" onclick={toggleReplies}>
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
					</svg>
					<span>Show {comment.replies.length} replies</span>
				</button>
			{:else}
				<div class="replies-list">
					{#each comment.replies as reply}
						<svelte:self comment={reply} level={level + 1} {maxLevel} {showReplies} {compact} />
					{/each}

					{#if comment.replies.length > 3 && $showRepliesList}
						<button class="hide-replies" onclick={toggleReplies}>
							<svg viewBox="0 0 24 24" width="16" height="16">
								<path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
							</svg>
							<span>Hide replies</span>
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.comment-block {
		position: relative;
		margin-left: var(--indent, 0);
		padding: 0.75rem 0;
		transition: background-color 0.2s ease;
	}

	.comment-block:not(:last-child) {
		border-bottom: 1px solid var(--border);
	}

	.comment-block.hovered {
		background-color: var(--secondary);
	}

	.comment-container {
		display: flex;
		gap: 0.75rem;
	}

	.commenter-avatar {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.commenter-avatar img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.comment-block.compact .commenter-avatar img {
		width: 2rem;
		height: 2rem;
	}

	.comment-content {
		flex: 1;
		min-width: 0;
	}

	.commenter-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.commenter-name {
		font-weight: 500;
		color: var(--foreground);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.commenter-name:hover {
		color: var(--primary);
	}

	.comment-time {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.comment-text {
		font-size: 0.9375rem;
		line-height: 1.5;
		margin-bottom: 0.5rem;
		word-wrap: break-word;
	}

	.comment-block.compact .comment-text {
		font-size: 0.875rem;
	}

	.comment-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: none;
		border: none;
		padding: 0;
		font-size: 0.75rem;
		color: var(--muted-foreground);
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.action-button:hover {
		color: var(--foreground);
	}

	.action-button svg {
		fill: currentColor;
	}

	.like-comment.liked {
		color: var(--primary);
	}

	.menu-container {
		position: relative;
		margin-left: auto;
	}

	.comment-menu {
		position: absolute;
		right: 0;
		top: 100%;
		margin-top: 0.25rem;
		background-color: var(--card);
		border-radius: var(--radius);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border);
		z-index: 10;
		min-width: 150px;
		overflow: hidden;
		display: none;
	}

	.menu-container:hover .comment-menu,
	.menu-container:focus-within .comment-menu {
		display: block;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		font-size: 0.875rem;
		color: var(--foreground);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.menu-item:hover {
		background-color: var(--secondary);
	}

	.menu-item.delete {
		color: var(--destructive);
	}

	.menu-item svg {
		fill: currentColor;
	}

	.reply-form {
		margin-top: 0.75rem;
	}

	.reply-form textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		resize: vertical;
		font-family: inherit;
		font-size: 0.875rem;
		background-color: var(--background);
		color: var(--foreground);
	}

	.reply-form textarea:focus {
		outline: none;
		border-color: var(--ring);
		box-shadow: 0 0 0 2px rgba(var(--ring) / 0.1);
	}

	.reply-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.cancel-reply {
		background: none;
		border: none;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		color: var(--muted-foreground);
		cursor: pointer;
		border-radius: var(--radius);
		transition: background-color 0.2s ease;
	}

	.cancel-reply:hover {
		background-color: var(--secondary);
		color: var(--foreground);
	}

	.submit-reply {
		background-color: var(--primary);
		color: var(--primary-foreground);
		border: none;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.submit-reply:hover {
		background-color: color-mix(in srgb, var(--primary) 90%, black);
	}

	.submit-reply:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.replies-section {
		margin-top: 0.5rem;
		margin-left: 3.25rem;
	}

	.show-replies,
	.hide-replies {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: none;
		border: none;
		padding: 0.375rem;
		font-size: 0.75rem;
		color: var(--primary);
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.show-replies:hover,
	.hide-replies:hover {
		color: color-mix(in srgb, var(--primary) 80%, black);
	}

	.show-replies svg,
	.hide-replies svg {
		fill: currentColor;
	}

	.replies-list {
		margin-top: 0.5rem;
	}
</style>
