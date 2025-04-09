<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/ui/button/button.svelte';

	const { Story } = defineMeta({
		title: 'Forms/yepco2',
		component: Button,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<Story name="default"></Story>
