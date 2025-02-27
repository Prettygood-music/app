<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// Filter option type
	export interface FilterOption {
		id: string;
		label: string;
		value: any;
		checked?: boolean;
	}

	// Props
	export let options: FilterOption[] = [];
	export let label: string = 'Filter';
	export let selectedCount: number | null = null;
	export let multiSelect: boolean = true;
	export let disabled: boolean = false;
	export let showResetButton: boolean = true;
	export let resetLabel: string = 'Reset';
	export let applyButtonLabel: string = 'Apply';
	export let showApplyButton: boolean = false;
	export let closeOnSelect: boolean = !multiSelect;

	// Runes
	let $isOpen = false;
	let $dropdownElement: HTMLDivElement | null = null;
	let $selectedOptions: FilterOption[] = [];
	let $hasPendingChanges = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		change: { selected: FilterOption[] };
		open: void;
		close: void;
		reset: void;
		apply: { selected: FilterOption[] };
	}>();

	// Initialize selected options on mount
	onMount(() => {
		$selectedOptions = options.filter((option) => option.checked);

		return () => onDestroy();
	});

	// Update when options change
	$: {
		if (options) {
			// Update selected options when options array changes
			$selectedOptions = options.filter((option) => option.checked);
			$hasPendingChanges = false;
		}
	}

	// Toggle dropdown
	function toggleDropdown() {
		if (disabled) return;

		$isOpen = !$isOpen;

		if ($isOpen) {
			dispatch('open');
			// Add click outside listener
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 0);
		} else {
			dispatch('close');
			document.removeEventListener('click', handleClickOutside);
		}
	}

	// Handle click outside to close dropdown
	function handleClickOutside(event: MouseEvent) {
		if ($dropdownElement && !$dropdownElement.contains(event.target as Node)) {
			$isOpen = false;
			dispatch('close');
			document.removeEventListener('click', handleClickOutside);

			if ($hasPendingChanges && showApplyButton) {
				// Reset selection if changes weren't applied
				resetPendingChanges();
			}
		}
	}

	// Clean up event listeners
	function onDestroy() {
		document.removeEventListener('click', handleClickOutside);
	}

	// Toggle option selection
	function toggleOption(option: FilterOption) {
		if (multiSelect) {
			const isSelected = $selectedOptions.some((o) => o.id === option.id);

			if (isSelected) {
				$selectedOptions = $selectedOptions.filter((o) => o.id !== option.id);
			} else {
				$selectedOptions = [...$selectedOptions, option];
			}
		} else {
			$selectedOptions = [option];
		}

		$hasPendingChanges = true;

		if (showApplyButton) {
			// Wait for apply button to be clicked
		} else {
			// Auto apply changes
			applyChanges();

			if (closeOnSelect) {
				$isOpen = false;
				dispatch('close');
				document.removeEventListener('click', handleClickOutside);
			}
		}
	}

	// Reset all filters
	function resetFilters() {
		$selectedOptions = [];
		$hasPendingChanges = true;

		if (!showApplyButton) {
			applyChanges();
		}

		dispatch('reset');
	}

	// Reset pending changes
	function resetPendingChanges() {
		$selectedOptions = options.filter((option) => option.checked);
		$hasPendingChanges = false;
	}

	// Apply changes
	function applyChanges() {
		// Update original options
		options = options.map((option) => ({
			...option,
			checked: $selectedOptions.some((o) => o.id === option.id)
		}));

		$hasPendingChanges = false;
		dispatch('change', { selected: $selectedOptions });
		dispatch('apply', { selected: $selectedOptions });

		// Close dropdown
		$isOpen = false;
		dispatch('close');
		document.removeEventListener('click', handleClickOutside);
	}

	// Check if option is selected
	function isOptionSelected(option: FilterOption): boolean {
		return $selectedOptions.some((o) => o.id === option.id);
	}
</script>


<div class="filter-dropdown" class:disabled bind:this={$dropdownElement}>
	<button
		type="button"
		class="filter-button"
		class:active={$isOpen || $selectedOptions.length > 0}
		on:click={toggleDropdown}
		{disabled}
		aria-haspopup="true"
		aria-expanded={$isOpen}
	>
		<span>{label}</span>
		{#if selectedCount !== null || $selectedOptions.length > 0}
			<span class="badge">{selectedCount ?? $selectedOptions.length}</span>
		{/if}
		<svg class="dropdown-icon" class:open={$isOpen} viewBox="0 0 24 24">
			<path d="M7 10l5 5 5-5z" />
		</svg>
	</button>

	{#if $isOpen}
		<div class="filter-options">
			<div class="options-header">
				<span class="options-title">{label}</span>
				{#if showResetButton && $selectedOptions.length > 0}
					<button type="button" class="reset-button" on:click={resetFilters}>
						{resetLabel}
					</button>
				{/if}
			</div>

			<div class="options-list">
				{#each options as option}
					<label class="filter-option">
						{#if multiSelect}
							<input
								type="checkbox"
								checked={isOptionSelected(option)}
								on:change={() => toggleOption(option)}
							/>
						{:else}
							<input
								type="radio"
								name="filter-option"
								checked={isOptionSelected(option)}
								on:change={() => toggleOption(option)}
							/>
						{/if}
						<span>{option.label}</span>
					</label>
				{/each}
			</div>

			{#if showApplyButton}
				<div class="options-footer">
					<button
						type="button"
						class="apply-button"
						disabled={!$hasPendingChanges}
						on:click={applyChanges}
					>
						{applyButtonLabel}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.filter-dropdown {
		position: relative;
		display: inline-block;
	}

	.filter-dropdown.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.filter-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--background);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--foreground);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-button:hover:not(:disabled) {
		border-color: var(--ring);
	}

	.filter-button.active {
		border-color: var(--primary);
		box-shadow: 0 0 0 1px var(--primary);
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		background-color: var(--primary);
		color: var(--primary-foreground);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.dropdown-icon {
		width: 1.25rem;
		height: 1.25rem;
		fill: currentColor;
		transition: transform 0.2s ease;
	}

	.dropdown-icon.open {
		transform: rotate(180deg);
	}

	.filter-options {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		min-width: 200px;
		max-width: 280px;
		background-color: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 10;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.options-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
	}

	.options-title {
		font-weight: 500;
		font-size: 0.875rem;
	}

	.reset-button {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.75rem;
		color: var(--primary);
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.reset-button:hover {
		color: color-mix(in srgb, var(--primary) 80%, black);
		text-decoration: underline;
	}

	.options-list {
		padding: 0.5rem;
		max-height: 300px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.filter-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: var(--radius);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.filter-option:hover {
		background-color: var(--secondary);
	}

	.filter-option input {
		margin: 0;
	}

	.filter-option span {
		font-size: 0.875rem;
	}

	.options-footer {
		padding: 0.75rem;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: flex-end;
	}

	.apply-button {
		background-color: var(--primary);
		color: var(--primary-foreground);
		border: none;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.apply-button:hover:not(:disabled) {
		background-color: color-mix(in srgb, var(--primary) 90%, black);
	}

	.apply-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
