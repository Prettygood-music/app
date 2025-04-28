<script lang="ts">
	import { Sidebar } from '$lib/components/music/index.js';

	let { data, children } = $props();
</script>

<div class="flex h-full items-stretch gap-4 px-2">
	<div class="hidden w-[240px] pb-4 lg:block">
		<!-- TODO: handle if connected -->
		<Sidebar playlists={data.playlists} />
	</div>

	<div class="flex-grow overflow-y-auto">
		{@render children?.()}
	</div>
</div>
