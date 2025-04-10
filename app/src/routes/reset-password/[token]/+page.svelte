<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Loader2 } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form';

  let { form, data } = $props();
  
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
      case 0: return 'bg-gray-200 dark:bg-gray-700';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  }
  
  let passwordStrength = $derived(getPasswordStrength(form?.values?.password || ''));
  let passwordStrengthColor = $derived(getPasswordStrengthColor(passwordStrength));
</script>

<div class="flex justify-center py-8 px-4">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Reset Password</h1>
      <p class="text-muted-foreground">Create a new password for your account</p>
    </div>

    <div class="space-y-4">
      {#if form?.error}
        <Alert variant="destructive">
          <AlertDescription>{form.message}</AlertDescription>
        </Alert>
      {/if}

      {#if form?.tokenError}
        <Alert variant="destructive">
          <AlertDescription>
            This password reset link is invalid or has expired. 
            Please <a href="/auth/forgot-password" class="underline font-medium">request a new password reset</a>.
          </AlertDescription>
        </Alert>
      {:else}
        <form method="POST" use:enhance={() => {
          loading = true;
          return ({ update }) => {
            loading = false;
            update();
          };
        }} class="space-y-4">
          <input type="hidden" name="token" value={data.token} />

          <!-- Password Field -->
          <Form.Field {form} name="password">
            <Form.Label>New Password</Form.Label>
            <Form.Input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              value={form?.values?.password || ''} 
              required
              autocomplete="new-password"
            />
            <Form.FieldErrors />
            
            <!-- Password Strength Indicator -->
            <div class="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded">
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
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Input 
              type="password" 
              name="confirmPassword" 
              placeholder="••••••••" 
              value={form?.values?.confirmPassword || ''} 
              required
              autocomplete="new-password"
            />
            <Form.FieldErrors />
          </Form.Field>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" disabled={loading}>
            {#if loading}
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            {:else}
              Reset password
            {/if}
          </Button>
        </form>

        <div class="text-center text-sm">
          Remember your password? 
          <a href="/login" class="text-primary hover:underline">Back to login</a>
        </div>
      {/if}
    </div>
  </div>
</div>
