<script lang="ts">
	import { cn, generateGradientDataURL } from '$lib/utils.js';
	import { generateGradient } from '$lib/utils.js';
	import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		src = null,
		name,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLImageElement>, HTMLImageElement> &
		HTMLImgAttributes & { name: string } = $props();

	let safeSrc = $state(src ? src : generateGradientDataURL(name));
</script>

{@html `
		<img
			onerror="this.onerror=null;this.src='${generateGradientDataURL(name)}'"
			src=${safeSrc}
			alt=${name}
			class="${cn('h-full w-full object-cover', className)}"
			width=${restProps.width}
			height=${restProps.height}
			/>
		`}
