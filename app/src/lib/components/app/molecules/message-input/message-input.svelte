<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let placeholder: string = 'Send a message...';
	export let recipientName: string = '';
	export let value: string = '';
	export let maxLength: number | undefined = undefined;
	export let disabled: boolean = false;
	export let attachmentsEnabled: boolean = true;
	export let emojiPickerEnabled: boolean = true;
	export let autoFocus: boolean = false;
	export let multiline: boolean = false;

	// Runes
	let $inputElement: HTMLInputElement | HTMLTextAreaElement | null = null;
	let $attachments: File[] = [];
	let $showEmojiPicker = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		submit: { text: string; attachments: File[] };
		change: { text: string };
		focus: void;
		blur: void;
		attach: { files: File[] };
	}>();

	// Focus the input on mount if autoFocus is true
	function onMount() {
		if (autoFocus && $inputElement) {
			$inputElement.focus();
		}
	}

	// Handle input changes
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		value = target.value;
		dispatch('change', { text: value });
	}

	// Handle attachment button click
	function handleAttachClick() {
		// Create a file input and trigger it
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.multiple = true;
		fileInput.accept = 'image/*,audio/*';

		fileInput.onchange = (event) => {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				const files = Array.from(target.files);
				$attachments = [...$attachments, ...files];
				dispatch('attach', { files });
			}
		};

		fileInput.click();
	}

	// Handle emoji button click
	function toggleEmojiPicker() {
		$showEmojiPicker = !$showEmojiPicker;
	}

	// Add emoji to the message
	function addEmoji(emoji: string) {
		value += emoji;
		dispatch('change', { text: value });
		$showEmojiPicker = false;
		$inputElement?.focus();
	}

	// Remove an attachment
	function removeAttachment(index: number) {
		$attachments = $attachments.filter((_, i) => i !== index);
	}

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();

		if (disabled || (!value.trim() && $attachments.length === 0)) {
			return;
		}

		dispatch('submit', { text: value, attachments: $attachments });
		value = '';
		$attachments = [];
	}

	// Handle keydown events for form submission
	function handleKeydown(event: KeyboardEvent) {
		if (!multiline && event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	}
</script>

<svelte:window on:load={onMount} />

<form class="message-input" on:submit={handleSubmit}>
	{#if $attachments.length > 0}
		<div class="attachments-preview">
			{#each $attachments as file, index}
				<div class="attachment-item">
					{#if file.type.startsWith('image/')}
						<img src={URL.createObjectURL(file)} alt="Attached image" />
					{:else}
						<div class="file-icon">
							<svg viewBox="0 0 24 24">
								<path
									d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
								/>
							</svg>
						</div>
					{/if}
					<button type="button" class="remove-attachment" onclick={() => removeAttachment(index)}>
						<svg viewBox="0 0 24 24">
							<path
								d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<div class="input-container">
		{#if multiline}
			<textarea
				bind:this={$inputElement}
				bind:value
				{placeholder}
				{maxLength}
				{disabled}
				on:input={handleInput}
				on:keydown={handleKeydown}
				on:focus={() => dispatch('focus')}
				on:blur={() => dispatch('blur')}
				rows={1}
				class="message-textarea"
			></textarea>
		{:else}
			<input
				bind:this={$inputElement}
				type="text"
				bind:value
				{placeholder}
				{maxLength}
				{disabled}
				on:input={handleInput}
				on:keydown={handleKeydown}
				on:focus={() => dispatch('focus')}
				on:blur={() => dispatch('blur')}
				class="message-text"
			/>
		{/if}

		{#if attachmentsEnabled}
			<button type="button" class="attach-button" onclick={handleAttachClick} {disabled}>
				<svg class="attach-icon" viewBox="0 0 24 24">
					<path
						d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
					/>
				</svg>
			</button>
		{/if}

		{#if emojiPickerEnabled}
			<button type="button" class="emoji-button" onclick={toggleEmojiPicker} {disabled}>
				<svg class="emoji-icon" viewBox="0 0 24 24">
					<path
						d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
					/>
				</svg>
			</button>

			{#if $showEmojiPicker}
				<div class="emoji-picker">
					<div class="emoji-list">
						{#each ['😀', '😂', '😍', '🥰', '😊', '🙂', '🙃', '😉', '🤔', '😐', '😑', '😶', '🙄', '😏', '😬', '😌', '😔', '😪', '🤤', '😴'] as emoji}
							<button type="button" class="emoji" onclick={() => addEmoji(emoji)}>
								{emoji}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{/if}

		<button
			type="submit"
			class="send-button"
			disabled={disabled || (!value.trim() && $attachments.length === 0)}
		>
			<svg class="send-icon" viewBox="0 0 24 24">
				<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
			</svg>
		</button>
	</div>
</form>

<style>
	.message-input {
		width: 100%;
		border-radius: var(--radius);
		background-color: var(--secondary);
		overflow: hidden;
		padding: 0.5rem;
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
	}

	.message-text,
	.message-textarea {
		flex: 1;
		border: none;
		background: none;
		padding: 0.75rem;
		outline: none;
		color: var(--foreground);
		font-size: 0.9375rem;
		font-family: inherit;
		resize: none;
	}

	.message-textarea {
		line-height: 1.4;
		min-height: 2.5rem;
		max-height: 10rem;
		overflow-y: auto;
	}

	.attach-button,
	.emoji-button,
	.send-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		color: var(--muted-foreground);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
		flex-shrink: 0;
	}

	.attach-button:hover,
	.emoji-button:hover {
		background-color: var(--muted);
		color: var(--foreground);
	}

	.send-button {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	.send-button:hover {
		background-color: color-mix(in srgb, var(--primary) 90%, black);
	}

	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.attach-icon,
	.emoji-icon,
	.send-icon {
		width: 1.25rem;
		height: 1.25rem;
		fill: currentColor;
	}

	.attachments-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.attachment-item {
		position: relative;
		width: 4rem;
		height: 4rem;
		border-radius: calc(var(--radius) - 2px);
		overflow: hidden;
		background-color: var(--muted);
	}

	.attachment-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.file-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: var(--muted-foreground);
	}

	.file-icon svg {
		width: 2rem;
		height: 2rem;
		fill: currentColor;
	}

	.remove-attachment {
		position: absolute;
		top: 0.125rem;
		right: 0.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.remove-attachment:hover {
		background-color: var(--destructive);
	}

	.remove-attachment svg {
		width: 0.75rem;
		height: 0.75rem;
		fill: currentColor;
	}

	.emoji-picker {
		position: absolute;
		right: 2.5rem;
		bottom: 100%;
		margin-bottom: 0.5rem;
		background-color: var(--card);
		border-radius: var(--radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border);
		padding: 0.5rem;
		z-index: 10;
	}

	.emoji-list {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		max-width: 15rem;
	}

	.emoji {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: none;
		border: none;
		font-size: 1.25rem;
		border-radius: calc(var(--radius) - 2px);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.emoji:hover {
		background-color: var(--secondary);
	}
</style>
