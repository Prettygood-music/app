<script lang="ts">
	import { Sidebar } from '$lib/components/music/index.js';
	import { getUserContext } from '$lib/state/user/user.svelte.js';

	let { data, children } = $props();

	const user = getUserContext();

	$effect(() => {
		user.playlists = data.playlists;
	});
</script>

<div class="flex h-full items-stretch gap-4 md:px-2">
	{#if user.user}
		<div class="hidden pb-4 md:min-w-[240px] lg:block mt-4">
			<!-- TODO: handle if connected -->
			<Sidebar playlists={data.playlists} />
		</div>
	{/if}

	<div class="flex-grow overflow-y-auto mt-4">
		{@render children?.()}
	</div>
</div>
