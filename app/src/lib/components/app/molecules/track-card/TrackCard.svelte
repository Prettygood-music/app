<script lang="ts">
	import { LINKS } from '$lib/constants';

	type ComponentProps = {
		id: string;
		cover_url: string | null;
		title: string;
		artist_name: string;
		explicit: boolean | null;
	};
	let { id, cover_url, title, artist_name, explicit }: ComponentProps = $props();
</script>

<a
	class="hover:bg-muted group flex w-[200px] flex-col rounded-md p-2 duration-200"
	href={LINKS.TRACKS.ID(id)}
>
	<div class="relative aspect-square h-full w-full flex-1 overflow-hidden rounded-md">
		<div
			class="h-full w-full rounded-lg border bg-cover bg-center duration-300 group-hover:scale-110"
			style="background-image: url({cover_url}); --view-transition-tag:track-image-{id};"
		></div>
		{#if explicit}
			<div class=" absolute bottom-1 right-1">
				<div
					class="bg-background/80 flex aspect-square h-6 w-6 items-center justify-center rounded text-center text-xs font-bold"
				>
					<span> E </span>
				</div>
			</div>
		{/if}
	</div>
	<div class="mt-1 h-fit overflow-hidden text-ellipsis whitespace-nowrap break-keep text-sm">
		<div class=" overflow-hidden">
			{title}
		</div>
		<div class="text-muted-foreground mt-0.5 text-xs">
			{artist_name}
		</div>
	</div>
</a>
