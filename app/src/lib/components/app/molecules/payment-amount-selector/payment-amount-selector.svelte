<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let value: number = 1;
	export let currency: string = 'SUI';
	export let presets: number[] = [1, 5, 10, 25];
	export let minAmount: number = 0.1;
	export let maxAmount: number | null = null;
	export let step: number = 0.1;
	export let disabled: boolean = false;
	export let showCustomAmount: boolean = true;

	// Runes
	let $customAmount = '';
	let $isCustomActive = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		change: { value: number; currency: string };
		presetSelected: { value: number };
		customSelected: { value: number };
	}>();

	// Format amount to display
	function formatAmount(amount: number): string {
		return amount.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		});
	}

	// Select a preset value
	function selectPreset(preset: number) {
		if (disabled) return;

		value = preset;
		$isCustomActive = false;
		$customAmount = '';

		dispatch('change', { value, currency });
		dispatch('presetSelected', { value });
	}

	// Enable custom amount input
	function enableCustomAmount() {
		if (disabled) return;

		$isCustomActive = true;
		$customAmount = value.toString();
	}

	// Handle custom amount input
	function handleCustomInput() {
		let parsedValue = parseFloat($customAmount);

		if (isNaN(parsedValue) || parsedValue < minAmount) {
			parsedValue = minAmount;
		}

		if (maxAmount !== null && parsedValue > maxAmount) {
			parsedValue = maxAmount;
		}

		value = parsedValue;
		dispatch('change', { value, currency });
		dispatch('customSelected', { value });
	}

	// Handle custom amount blur
	function handleCustomBlur() {
		if (!$customAmount.trim()) {
			$isCustomActive = false;
			return;
		}

		handleCustomInput();
		$customAmount = value.toString();
	}

	// Handle keydown in custom input
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleCustomInput();

			// Lose focus after enter
			(event.target as HTMLInputElement).blur();
		}
	}
</script>

<div class="payment-selector" class:disabled>
	<div class="payment-presets">
		{#each presets as preset}
			<button
				type="button"
				class="preset-amount"
				class:active={!$isCustomActive && value === preset}
				on:click={() => selectPreset(preset)}
				{disabled}
			>
				{formatAmount(preset)}
				{currency}
			</button>
		{/each}
	</div>

	{#if showCustomAmount}
		<div class="custom-amount" class:active={$isCustomActive}>
			{#if $isCustomActive}
				<input
					type="number"
					bind:value={$customAmount}
					min={minAmount}
					max={maxAmount ?? undefined}
					{step}
					{disabled}
					on:blur={handleCustomBlur}
					on:keydown={handleKeydown}
					on:input={handleCustomInput}
					placeholder="Custom amount"
				/>
			{:else}
				<button type="button" class="custom-amount-button" on:click={enableCustomAmount} {disabled}>
					Custom amount
				</button>
			{/if}
			<span class="currency">{currency}</span>
		</div>
	{/if}
</div>

<style>
	.payment-selector {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.payment-selector.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.payment-presets {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		gap: 0.5rem;
	}

	.preset-amount {
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background-color: var(--background);
		color: var(--foreground);
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.preset-amount:hover:not(:disabled) {
		border-color: var(--primary);
		box-shadow: 0 0 0 1px var(--primary);
	}

	.preset-amount.active {
		background-color: var(--primary);
		color: var(--primary-foreground);
		border-color: var(--primary);
	}

	.custom-amount {
		position: relative;
		display: flex;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		background-color: var(--background);
		transition: all 0.2s ease;
	}

	.custom-amount.active {
		border-color: var(--ring);
		box-shadow: 0 0 0 1px var(--ring);
	}

	.custom-amount-button {
		flex: 1;
		padding: 0.75rem;
		background: none;
		border: none;
		text-align: left;
		color: var(--muted-foreground);
		cursor: pointer;
	}

	.custom-amount input {
		flex: 1;
		padding: 0.75rem;
		border: none;
		background: none;
		outline: none;
		color: var(--foreground);
		font-weight: 500;
	}

	/* Hide the number input arrows */
	.custom-amount input::-webkit-outer-spin-button,
	.custom-amount input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.custom-amount input[type='number'] {
		-moz-appearance: textfield;
	}

	.currency {
		display: flex;
		align-items: center;
		padding: 0 0.75rem;
		color: var(--muted-foreground);
		font-weight: 500;
		background-color: var(--secondary);
	}
</style>
