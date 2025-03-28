<script>
  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex justify-center items-center min-h-[50vh] p-4">
  <div class="w-full max-w-md space-y-8 text-center">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold tracking-tight">Verification Email Sent</h1>
      <p class="text-muted-foreground">
        We've sent a new verification link to your email address. Please check your inbox and click the link to verify your account.
      </p>
    </div>

    <div class="space-y-4 pt-4">
      <p class="text-sm text-muted-foreground">
        If you don't receive the email within a few minutes, please check your spam folder or try again.
      </p>

      <div>
        <a href="/login" class="text-sm text-primary hover:underline">
          Back to login
        </a>
      </div>
    </div>
  </div>
</div>
