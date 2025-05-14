<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const thumbnailSize = {
		default: 'w-12 h-12',
		sm: 'w-6 h-6',
		lg: 'w-24 h-24'
	} as const;
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import ImageFallback from '../../../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';

	export type ThumbnailSize = keyof typeof thumbnailSize;

	let {
		coverURL,
		name,
		size = 'default'
	}: { name: string; coverURL: string | null; size?: ThumbnailSize } = $props();
</script>


<ImageFallback
	src={coverURL}
	{name}
	alt="{name} Cover"
	class={cn(thumbnailSize[size], 'rounded-sm border bg-cover bg-center')}
></ImageFallback>
