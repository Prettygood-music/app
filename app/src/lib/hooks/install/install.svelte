<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children?.()}
