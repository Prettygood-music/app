<script lang="ts">
	import { Sidebar } from '$lib/components/music/index.js';
	import { getUserContext } from '$lib/state/user/user.svelte.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	const user = getUserContext();

	$effect(() => {
		user.playlists = data.playlists;
	});
</script>

<div class="flex h-full items-stretch gap-4 md:px-2">
	{#if user.user}
		<div class="mt-4 hidden pb-4 md:min-w-[240px] lg:block">
			<!-- TODO: handle if connected -->
			<Sidebar playlists={data.playlists} />
		</div>
	{/if}

	<div class="mt-4 flex-grow overflow-y-auto">
		{@render children?.()}
	</div>
</div>
