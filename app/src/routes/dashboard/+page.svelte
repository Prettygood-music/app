<script>
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  
  let { data } = $props();
  
  const { user } = data;
</script>

<div class="container py-8 px-4 mx-auto">
  <div class="flex flex-col space-y-8">
    <div class="flex flex-col space-y-2">
      <h1 class="text-3xl font-bold">Welcome, {user.display_name || user.username}!</h1>
      <p class="text-muted-foreground">This is your dashboard.</p>
    </div>
    
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Username:</span>
              <span class="font-medium">{user.username}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Email:</span>
              <span class="font-medium">{user.email}
                {#if !user.email_verified}
                  <span class="text-xs text-amber-600 ml-2">(Unverified)</span>
                {/if}
              </span>
            </div>
            {#if user.wallet_address}
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Wallet:</span>
                <span class="font-medium truncate max-w-[150px]">{user.wallet_address}</span>
              </div>
            {/if}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">Edit Profile</Button>
        </CardFooter>
      </Card>
      
      <!-- Add more dashboard cards here -->
    </div>
    
    <div class="flex justify-end">
      <form action="/api/auth/logout" method="POST">
        <Button type="submit" variant="ghost">Sign Out</Button>
      </form>
    </div>
  </div>
</div>
