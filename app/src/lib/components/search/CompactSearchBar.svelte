<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import Search from 'lucide-svelte/icons/search';

	let { placeholder = 'Search...', initialValue = '' } = $props<{
		placeholder?: string;
		initialValue?: string;
	}>();

	let searchQuery = $state(initialValue);

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			goto(`/search/${encodeURIComponent(searchQuery.trim())}`);
		}
	}
</script>

<form onsubmit={handleSearch} class="w-full max-w-xs">
	<div class="relative">
		<Search class="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
		<Input
			type="text"
			{placeholder}
			class="bg-secondary h-8 rounded-full pl-8 pr-8"
			bind:value={searchQuery}
		/>
		{#if searchQuery}
			<button
				type="button"
				class="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
				onclick={() => (searchQuery = '')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		{/if}
	</div>
</form>
