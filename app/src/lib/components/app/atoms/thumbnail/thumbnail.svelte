<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const thumbnailSize = {
		default: 'w-12 h-12',
		sm: 'w-6 h-6',
		lg: 'w-24 h-24'
	} as const;
</script>

<script lang="ts">
	import Placeholder from './placeholder-thumbnail.png';
	import { cn } from '$lib/utils.js';

	export type ThumbnailSize = keyof typeof thumbnailSize;

	let { coverURL, size = 'default' }: { coverURL: string | null; size?: ThumbnailSize } = $props();
</script>

<div
	class={cn(thumbnailSize[size], 'rounded-sm border bg-cover bg-center')}
	style=" background-image: url({coverURL || Placeholder});"
></div>
