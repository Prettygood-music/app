<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let { title, value, trend }: { title: string; value: number | string; trend: string } = $props();
	const isPositive = trend.startsWith('+');
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
		<div
			class={`rounded-full p-1 ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:text-emerald-100 dark:bg-emerald-700' : 'bg-rose-100 text-rose-700 dark:text-text-100 dark:bg-rose-700'}`}
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
	</Card.Content>
</Card.Root>
