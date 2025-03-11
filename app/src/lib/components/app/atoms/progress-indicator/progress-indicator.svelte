<script lang="ts">
	let { progress }: { progress: number } = $props();
</script>

<div class="bg-muted relative h-1 flex-1 overflow-hidden rounded-md">
	<div class="absolute h-full bg-white" style="width: {progress}%"></div>
</div>
