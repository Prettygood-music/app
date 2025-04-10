<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Loader2 } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form';

  let { form } = $props();
  let loading = $state(false);
</script>

<div class="flex justify-center py-8 px-4">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Forgot Password</h1>
      <p class="text-muted-foreground">Enter your email to reset your password</p>
    </div>

    <div class="space-y-4">
      {#if form?.error}
        <Alert variant="destructive">
          <AlertDescription>{form.message}</AlertDescription>
        </Alert>
      {/if}

      <form method="POST" use:enhance={() => {
        loading = true;
        return ({ update }) => {
          loading = false;
          update();
        };
      }} class="space-y-4">
        <!-- Email Field -->
        <Form.Field {form} name="email">
          <Form.Label>Email address</Form.Label>
          <Form.Input 
            type="email" 
            name="email" 
            placeholder="you@example.com" 
            value={form?.values?.email || ''} 
            required
            autocomplete="email"
          />
          <Form.FieldErrors />
          <Form.Description>
            We'll send a password reset link to this email address.
          </Form.Description>
        </Form.Field>

        <!-- Submit Button -->
        <Button type="submit" class="w-full" disabled={loading}>
          {#if loading}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          {:else}
            Send password reset link
          {/if}
        </Button>
      </form>

      <div class="text-center text-sm">
        Remember your password? 
        <a href="/login" class="text-primary hover:underline">Back to login</a>
      </div>
    </div>
  </div>
</div>
