<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import Loader2 from 'lucide-svelte/icons/loader-circle';
	import * as Form from '$lib/components/ui/form';
	import { page } from '$app/stores';
	import { loginSchema, type LoginSchema } from './schemas';

	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;

	let loading = $state(false);
</script>

<div class="flex justify-center px-4 py-8">
	<div class="w-full max-w-md space-y-6">
		<div class="space-y-2 text-center">
			<h1 class="text-3xl font-bold">Welcome back</h1>
			<p class="text-muted-foreground">Sign in to your account</p>
		</div>

		<div class="space-y-4">
			<form method="POST" use:enhance class="space-y-4">
				<!-- Email/Username Field -->
				<Form.Field {form} name="emailOrUsername">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email or Username</Form.Label>
							<Input bind:value={$formData.emailOrUsername} {...props} />
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>

				<!-- Password Field -->
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>Password</Form.Label>
								<a href="/auth/forgot-password" class="text-primary text-sm hover:underline">
									Forgot password?
								</a>
							</div>
							<!-- 
							<Input
								type="password"
								name="password"
								placeholder="••••••••"
								bind:value={$formData.password}
								required
								autocomplete="current-password"
							/>
               -->
							<Input bind:value={$formData.password} {...props} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Remember Me Checkbox -->
				<div class="flex items-center space-x-2">
					<Checkbox name="rememberMe" id="rememberMe" />
					<Label for="rememberMe" class="text-sm font-medium leading-none">
						Remember me for 30 days
					</Label>
				</div>

				<!-- Submit Button -->
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Signing in...
					{:else}
						Sign in
					{/if}
				</Button>
			</form>

			<div class="text-center text-sm">
				Don't have an account?
				<a href="/auth" class="text-primary hover:underline">Sign up</a>
			</div>
		</div>
	</div>
</div>
