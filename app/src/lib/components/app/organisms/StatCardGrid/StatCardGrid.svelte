<script lang="ts">
	import EnhancedStatCard from '$lib/components/app/molecules/StatCard/EnhancedStatCard.svelte';
	
	let { 
		stats = [], 
		columns = 3 
	} = $props();
	
	const gridClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
	};
	
	const gridClass = gridClasses[columns] || gridClasses[3];
</script>

<div class={`grid ${gridClass} gap-4`}>
	{#each stats as stat}
		<EnhancedStatCard {...stat} />
	{/each}
</div>
