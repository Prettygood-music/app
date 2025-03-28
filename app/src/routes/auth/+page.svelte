<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Loader2 } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form';

  let { form } = $props();

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
      <h1 class="text-3xl font-bold">Create an account</h1>
      <p class="text-muted-foreground">Join the community of music lovers.</p>
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
          <Form.Label>Email</Form.Label>
          <Form.Input 
            type="email" 
            name="email" 
            placeholder="you@example.com" 
            value={form?.values?.email || ''} 
            required
            autocomplete="email"
          />
          <Form.FieldErrors />
        </Form.Field>

        <!-- Username Field -->
        <Form.Field {form} name="username">
          <Form.Label>Username</Form.Label>
          <Form.Input 
            type="text" 
            name="username" 
            placeholder="yourusername" 
            value={form?.values?.username || ''} 
            required
            autocomplete="username"
          />
          <Form.FieldErrors />
          <Form.Description>
            Must be at least 3 characters and can only contain letters, numbers, and underscores.
          </Form.Description>
        </Form.Field>

        <!-- Display Name Field -->
        <Form.Field {form} name="displayName">
          <Form.Label>Display Name <span class="text-muted-foreground">(optional)</span></Form.Label>
          <Form.Input 
            type="text" 
            name="displayName" 
            placeholder="Your Name" 
            value={form?.values?.displayName || ''} 
            autocomplete="name"
          />
          <Form.FieldErrors />
        </Form.Field>

        <!-- Password Field -->
        <Form.Field {form} name="password">
          <Form.Label>Password</Form.Label>
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
          <Form.Label>Confirm Password</Form.Label>
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

        <!-- Terms Checkbox -->
        <Form.Field {form} name="terms">
          <div class="flex items-start space-x-2">
            <Checkbox 
              name="terms" 
              id="terms" 
              checked={form?.values?.terms === 'on'} 
              value="on"
              aria-describedby="terms-error"
            />
            <div class="grid gap-1.5 leading-none">
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the 
                <a href="/terms" class="text-primary underline hover:text-primary/80">Terms of Service</a> 
                and 
                <a href="/privacy" class="text-primary underline hover:text-primary/80">Privacy Policy</a>
              </label>
              {#if form?.fieldErrors?.terms}
                <p id="terms-error" class="text-sm text-destructive">{form.fieldErrors.terms}</p>
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
