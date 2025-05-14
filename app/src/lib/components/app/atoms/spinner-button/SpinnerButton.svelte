<script lang="ts">
	import Button, {
		buttonVariants,
		type ButtonProps
	} from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { LoaderCircleIcon } from 'lucide-svelte';

	let {
		showSpinner,
		class: className,
		children,
		type = 'button',
		variant = 'default',
		size = 'default',
		...restProps
	}: { showSpinner: boolean } & ButtonProps = $props();
</script>

<Button
	{type}
	disabled={restProps['disabled'] || showSpinner}
	class={cn(buttonVariants({ variant, size }), 'relative', className)}
	{...restProps}
>
	{#if showSpinner}
		<div
			class={cn(
				'absolute inset-0 flex items-center justify-center',
				buttonVariants({ variant, size })
			)}
		>
			<LoaderCircleIcon class="animate-spin"></LoaderCircleIcon>
		</div>
	{/if}

	{@render children?.()}
</Button>
