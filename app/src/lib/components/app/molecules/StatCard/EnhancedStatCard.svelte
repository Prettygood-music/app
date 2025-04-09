<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	let {
		title,
		value,
		trend,
		icon,
		subtitle,
		showDetails = false
	}: {
		icon: Snippet;
		title: string;
		value: number | string;
		trend: string;
		subtitle: string;
		showDetails: boolean;
	} = $props();

	const isPositive = trend.startsWith('+');
</script>

<Card.Root class={showDetails ? 'min-h-[160px]' : ''}>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div class="flex items-center gap-2">
			{#if icon}
				<div class="text-muted-foreground">
					{@render icon()}
				</div>
			{/if}
			<Card.Title class="text-sm font-medium">{title}</Card.Title>
		</div>
		<div
			class={`rounded-full p-1 ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
		>
			{#if isPositive}
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
					class="h-4 w-4"><path d="m18 15-6-6-6 6" /></svg
				>
			{:else}
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
					class="h-4 w-4"><path d="m6 9 6 6 6-6" /></svg
				>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{value}</div>
		<p class="text-muted-foreground text-xs">
			{trend} from last period
		</p>

		{#if subtitle}
			<p class="text-muted-foreground mt-1 text-xs">{subtitle}</p>
		{/if}

		{#if showDetails}
			<div class="border-border mt-4 border-t pt-4">
				<div class="flex justify-between text-xs">
					<span class="text-muted-foreground">Last week</span>
					<span>1,087</span>
				</div>
				<div class="mt-1 flex justify-between text-xs">
					<span class="text-muted-foreground">Last month</span>
					<span>4,352</span>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
