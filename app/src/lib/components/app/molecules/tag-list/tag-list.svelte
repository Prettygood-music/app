<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let tags: string[] = [];
	export let editable: boolean = false;
	export let maxTags: number = Infinity;
	export let minTags: number = 0;
	export let allowDuplicates: boolean = false;
	export let placeholder: string = 'Add tag...';
	export let variant: 'default' | 'primary' | 'secondary' = 'default';

	// Runes
	let $newTag = '';
	let $isInputFocused = false;
	let $inputElement: HTMLInputElement | null = null;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		add: { tag: string };
		remove: { tag: string; index: number };
		update: { tags: string[] };
	}>();

	// Add a new tag
	function addTag() {
		if (!$newTag.trim()) return;

		if (tags.length >= maxTags) {
			// Max tags reached
			return;
		}

		if (!allowDuplicates && tags.includes($newTag.trim())) {
			// Duplicate tag
			$newTag = '';
			return;
		}

		const newTags = [...tags, $newTag.trim()];
		tags = newTags;

		dispatch('add', { tag: $newTag.trim() });
		dispatch('update', { tags: newTags });

		$newTag = '';
	}

	// Remove a tag
	function removeTag(index: number) {
		if (tags.length <= minTags) {
			// Minimum tags constraint
			return;
		}

		const removedTag = tags[index];
		const newTags = tags.filter((_, i) => i !== index);
		tags = newTags;

		dispatch('remove', { tag: removedTag, index });
		dispatch('update', { tags: newTags });
	}

	// Handle keydown events
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		} else if (event.key === 'Backspace' && $newTag === '' && tags.length > 0) {
			// Remove the last tag when backspace is pressed with empty input
			removeTag(tags.length - 1);
		}
	}

	// Focus the input field
	function focusInput() {
		if (editable && $inputElement) {
			$inputElement.focus();
		}
	}
</script>

<div class="tag-list {variant}" onclick={focusInput}>
	{#each tags as tag, index}
		<span class="tag">
			{tag}
			{#if editable && tags.length > minTags}
				<button class="remove-tag" onclick|stopPropagation={() => removeTag(index)}>
					<svg viewBox="0 0 24 24" width="12" height="12">
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
						/>
					</svg>
				</button>
			{/if}
		</span>
	{/each}

	{#if editable && tags.length < maxTags}
		<div class="input-container" class:focused={$isInputFocused}>
			<input
				type="text"
				bind:value={$newTag}
				bind:this={$inputElement}
				{placeholder}
				on:keydown={handleKeydown}
				on:focus={() => ($isInputFocused = true)}
				on:blur={() => {
					$isInputFocused = false;
					addTag();
				}}
			/>
		</div>
	{:else if editable && tags.length === 0}
		<button class="add-tag" onclick={focusInput}>
			<svg viewBox="0 0 24 24" width="12" height="12">
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			<span>{placeholder}</span>
		</button>
	{:else if editable}
		<span class="max-tags-reached">Max tags reached</span>
	{/if}
</div>

<style>
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		padding: 0.25rem;
		border-radius: var(--radius);
		min-height: 2.25rem;
	}

	.tag-list.default {
		background-color: transparent;
	}

	.tag-list.primary {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	.tag-list.secondary {
		background-color: var(--secondary);
	}

	.tag {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius);
		font-size: 0.75rem;
		font-weight: 500;
		background-color: var(--muted);
		color: var(--muted-foreground);
	}

	.tag-list.primary .tag {
		background-color: rgba(255, 255, 255, 0.2);
		color: var(--primary-foreground);
	}

	.remove-tag {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 0.125rem;
		cursor: pointer;
		color: currentColor;
		opacity: 0.7;
		transition: opacity 0.2s ease;
		margin-left: 0.125rem;
	}

	.remove-tag:hover {
		opacity: 1;
	}

	.remove-tag svg {
		fill: currentColor;
	}

	.input-container {
		display: flex;
		min-width: 5rem;
		flex-grow: 1;
		max-width: 8rem;
	}

	.input-container.focused {
		outline: 2px solid var(--ring);
		border-radius: var(--radius);
	}

	.input-container input {
		width: 100%;
		border: none;
		background: none;
		padding: 0.25rem 0.375rem;
		font-size: 0.75rem;
		color: var(--foreground);
		outline: none;
	}

	.tag-list.primary .input-container input {
		color: var(--primary-foreground);
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
	}

	.tag-list.primary .input-container input::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	.add-tag {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		color: var(--muted-foreground);
		font-size: 0.75rem;
		transition: color 0.2s ease;
	}

	.add-tag:hover {
		color: var(--foreground);
	}

	.add-tag svg {
		fill: currentColor;
	}

	.max-tags-reached {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		font-style: italic;
	}
</style>
