<script>
  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex justify-center items-center min-h-[50vh] p-4">
  <div class="w-full max-w-md space-y-8 text-center">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p class="text-muted-foreground">
        We encountered an error processing your request. Please try again later.
      </p>
    </div>

    <div class="space-y-4 pt-4">
      <div class="flex flex-col space-y-2">
        <a href="/login">
          <Button variant="outline" class="w-full">Return to login</Button>
        </a>
        <a href="/auth/forgot-password">
          <Button variant="ghost" class="w-full">Reset your password</Button>
        </a>
      </div>

      <p class="text-sm text-muted-foreground">
        If you continue to experience issues, please contact support.
      </p>
    </div>
  </div>
</div>
