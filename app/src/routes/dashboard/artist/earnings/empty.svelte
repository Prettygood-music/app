<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
</script>


<Card.Root>
    <Card.Header>

        <Card.Title>
            Set your address and start earning    
        </Card.Title>
        <Card.Description>
            crypto payments, tips and so on
        </Card.Description>
    </Card.Header>

    <Card.Content>
        small explainer
    </Card.Content>

    <Card.Footer>
        <Button>Set wallet</Button>
    </Card.Footer>
</Card.Root>