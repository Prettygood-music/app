<script lang="ts">
	//import "../../../../../../app.css";
	let { message }: { message: string } = $props();

	import PrettyGood from '$lib/assets/logos/prettygood.png?inline';
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-[#0c0a09]">
	<img src={PrettyGood} alt="" width="96" height="96" class="block rounded-full" />
	<h1 class="text-white text-4xl font-bold">
		{message}
	</h1>
</div>
