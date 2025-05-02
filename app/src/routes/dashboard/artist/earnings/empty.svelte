<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { updateAddress } from '$lib/schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	function isValidSuiAddress(address: string) {
		const regex = /^0x[a-fA-F0-9]{64}$/;
		return regex.test(address);
	}

	let {
		data
	}: {
		data: { form: SuperValidated<updateAddress.Schema> };
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(updateAddress.schema)
	});
	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Start earning</Card.Title>
		<Card.Description>Start accepting payment and tips using Crypto & Sui.</Card.Description>
	</Card.Header>

	<Card.Content>
		<div>small explainer</div>

		<form method="POST" use:enhance>
			<div class="space-y-2">
				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>SUI Wallet Address <span class="text-destructive">*</span></Form.Label>
							<Input
								{...props}
								bind:value={$formData.address}
								placeholder="Enter Address"
								required
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
            <Button type="submit">Set wallet</Button>
		</form>
	</Card.Content>

	<Card.Footer>
		
	</Card.Footer>
</Card.Root>
