<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search } from 'lucide-svelte';

	let {
		initialValue = '',
		placeholder = 'Search for songs, artists, or albums',
		buttonText = 'Search',
		showButton = true,
		fullWidth = true,
		size = 'default'
	} = $props<{
		initialValue?: string;
		placeholder?: string;
		buttonText?: string;
		showButton?: boolean;
		fullWidth?: boolean;
		size?: 'default' | 'sm' | 'lg';
	}>();

	// Define classes based on size
	let inputClasses = $derived(
		size === 'sm' ? 'h-8 pl-8' : size === 'lg' ? 'h-12 pl-12 text-lg' : 'pl-10'
	);

	let iconClasses = $derived(size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');

	let searchQuery = $state(initialValue);

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			goto(`/search/${encodeURIComponent(searchQuery.trim())}`);
		}
	}
</script>

<form onsubmit={handleSearch} class={fullWidth ? 'w-full' : ''}>
	<div class="flex gap-2">
		<div class="relative flex-1">
			<Search
				class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 {iconClasses}"
			/>
			<Input type="text" {placeholder} class={inputClasses} bind:value={searchQuery} {size} />
		</div>
		{#if showButton}
			<Button type="submit" size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}>
				{buttonText}
			</Button>
		{/if}
	</div>
</form>
