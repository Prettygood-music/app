<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import Loader2 from 'lucide-svelte/icons/loader-circle';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registerSchema } from './schema.js';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});
	const { form: formData, enhance } = form;

	let loading = $state(false);

	// Password strength indicator functions
	function getPasswordStrength(password: string): number {
		if (!password) return 0;

		let strength = 0;
		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;

		return strength;
	}

	function getPasswordStrengthColor(strength: number): string {
		switch (strength) {
			case 0:
				return 'bg-gray-200 dark:bg-gray-700';
			case 1:
				return 'bg-red-500';
			case 2:
				return 'bg-orange-500';
			case 3:
				return 'bg-yellow-500';
			case 4:
				return 'bg-green-500';
			default:
				return 'bg-gray-200 dark:bg-gray-700';
		}
	}

	let passwordStrength = $derived(getPasswordStrength($formData.password));
	let passwordStrengthColor = $derived(getPasswordStrengthColor(passwordStrength));
</script>

<div class="overflow-y-auto">
	<div class="flex justify-center px-4 py-8">
		<div class="w-full max-w-md space-y-6">
			<div class="space-y-2 text-center">
				<h1 class="text-3xl font-bold">Create an account</h1>
				<p class="text-muted-foreground">Join the community of music lovers.</p>
			</div>

			<div class="space-y-4">
				{#if form?.error}
					<Alert variant="destructive">
						<AlertDescription>{form.message}</AlertDescription>
					</Alert>
				{/if}

				<form method="POST" use:enhance class="space-y-4">
					<!-- Email Field -->
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input bind:value={$formData.email} {...props} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Username Field -->
					<Form.Field {form} name="username">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Username</Form.Label>
								<Input bind:value={$formData.username} {...props} />
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
						<Form.Description>
							Must be at least 3 characters and can only contain letters, numbers, and underscores.
						</Form.Description>
					</Form.Field>

					<!-- Display Name Field -->
					<Form.Field {form} name="displayName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									>Display Name <span class="text-muted-foreground">(optional)</span></Form.Label
								>
								<Input bind:value={$formData.displayName} {...props} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Password Field -->
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Password</Form.Label>
								<Input
									type="password"
									placeholder="••••••••"
									bind:value={$formData.password}
									required
									autocomplete="new-password"
									{...props}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />

						<!-- Password Strength Indicator -->
						<div class="mt-2 h-1 w-full rounded bg-gray-200 dark:bg-gray-700">
							<div
								class="h-1 rounded transition-all duration-300"
								style="width: {passwordStrength * 25}%;"
								class:bg-red-500={passwordStrength === 1}
								class:bg-orange-500={passwordStrength === 2}
								class:bg-yellow-500={passwordStrength === 3}
								class:bg-green-500={passwordStrength === 4}
							></div>
						</div>
						<Form.Description>
							Password must be at least 8 characters and include an uppercase letter and a number.
						</Form.Description>
					</Form.Field>

					<!-- Confirm Password Field -->
					<Form.Field {form} name="confirmPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm Password</Form.Label>
								<Input
									type="password"
									placeholder="••••••••"
									bind:value={$formData.confirmPassword}
									required
									autocomplete="new-password"
									{...props}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Terms Checkbox -->
					<Form.Field {form} name="terms">
						<div class="flex items-start space-x-2">
							<Form.Control>
								{#snippet children({ props })}
									<!-- bind:checked={$formData.terms} -->
									<Checkbox
										name="terms"
										id="terms"
										onCheckedChange={(val) => {
											$formData.terms = val ? 'on' : undefined;
										}}
										value="on"
										aria-describedby="terms-error"
									/>
								{/snippet}
							</Form.Control>
							<div class="grid gap-1.5 leading-none">
								<label
									for="terms"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									I agree to the
									<a href="/terms" class="text-primary hover:text-primary/80 underline"
										>Terms of Service</a
									>
									and
									<a href="/privacy" class="text-primary hover:text-primary/80 underline"
										>Privacy Policy</a
									>
								</label>
								{#if form?.fieldErrors?.terms}
									<p id="terms-error" class="text-destructive text-sm">{form.fieldErrors.terms}</p>
								{/if}
							</div>
						</div>
					</Form.Field>

					<!-- Submit Button -->
					<Button type="submit" class="w-full" disabled={loading}>
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						{:else}
							Create account
						{/if}
					</Button>
				</form>

				<div class="text-center text-sm">
					Already have an account?
					<a href="/login" class="text-primary hover:underline">Log in</a>
				</div>
			</div>
		</div>
	</div>
</div>
