<script>
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  
  let isError = $derived(!!$page.error);
  let errorStatus = $derived($page.status);
  let errorMessage = $derived($page.error?.message || "There was an error verifying your email.");
  let isExpired = $derived(errorStatus === 410);
</script>

<div class="flex justify-center items-center min-h-[50vh] p-4">
  <div class="w-full max-w-md space-y-8 text-center">
    {#if isError}
      <Alert variant="destructive">
        <AlertDescription>
          {isExpired
            ? "Your verification link has expired."
            : errorMessage}
        </AlertDescription>
      </Alert>
      
      <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-tight">Email Verification Failed</h1>
        
        {#if isExpired}
          <p class="text-muted-foreground">
            The verification link has expired. Please request a new verification email.
          </p>
          
          <div class="pt-4">
            <form method="POST" action="/api/auth/resend-verification">
              <input type="hidden" name="email" value={$page.url.searchParams.get('email') || ''} />
              <Button type="submit" class="w-full">Resend Verification Email</Button>
            </form>
          </div>
        {:else}
          <p class="text-muted-foreground">
            We couldn't verify your email address. The link may be invalid or has already been used.
          </p>
        {/if}
      </div>
    {:else}
      <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-tight">Verifying Your Email</h1>
        <p class="text-muted-foreground">
          Please wait while we verify your email address...
        </p>
        <div class="flex justify-center pt-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    {/if}
    
    <div class="pt-4">
      <a href="/login" class="text-sm text-primary hover:underline">
        Back to login
      </a>
    </div>
  </div>
</div>
