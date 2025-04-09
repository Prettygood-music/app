<script module lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { defineMeta } from "@storybook/addon-svelte-csf";


    const {Story} = defineMeta({
        title: "Forms/testtwo",
        component: Button,
		tags: ['autodocs'],

        argTypes: {}
    })
</script>

<Story name="two"></Story>