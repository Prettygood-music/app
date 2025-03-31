<script lang="ts">
  import TokenInfo from '$lib/components/auth/TokenInfo.svelte';
  import { page } from '$app/stores';
</script>

<div class="container mx-auto py-8 px-4">
  <h1 class="text-3xl font-bold mb-8">Account Profile</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
    <!-- Main profile section -->
    <div class="md:col-span-8 space-y-6">
      <div class="bg-card p-6 rounded-lg border shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
        
        {#if $page.data.user}
          <div class="grid grid-cols-[120px_1fr] gap-y-2">
            <span class="font-medium">User ID:</span>
            <span class="font-mono text-sm">{$page.data.user.id}</span>
            
            <span class="font-medium">Username:</span>
            <span>{$page.data.user.username}</span>
            
            <span class="font-medium">Email:</span>
            <span>{$page.data.user.email}</span>
            
            <span class="font-medium">Role:</span>
            <span class="capitalize">{$page.data.user.role}</span>
            
            <span class="font-medium">Email Status:</span>
            <span class={$page.data.user.email_verified ? 'text-green-600' : 'text-orange-600'}>
              {$page.data.user.email_verified ? 'Verified' : 'Not Verified'}
            </span>
            
            {#if $page.data.user.wallet_address}
              <span class="font-medium">Wallet:</span>
              <span class="font-mono text-sm">{$page.data.user.wallet_address}</span>
            {/if}
          </div>
          
          <div class="mt-6 flex justify-end">
            <a 
              href="/settings/account"
              class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Edit Profile
            </a>
          </div>
        {:else}
          <div class="p-4 bg-muted rounded-md text-center">
            <p>You are not logged in.</p>
          </div>
        {/if}
      </div>
      
      <!-- Authentication info for debugging -->
      <div class="bg-card p-6 rounded-lg border shadow-sm">
        <TokenInfo />
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="md:col-span-4 space-y-6">
      <div class="bg-card p-6 rounded-lg border shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Account Security</h2>
        
        <ul class="space-y-3">
          <li>
            <a 
              href="/settings/security/password"
              class="block p-3 rounded hover:bg-muted transition-colors"
            >
              Change Password
            </a>
          </li>
          <li>
            <a 
              href="/settings/security/email"
              class="block p-3 rounded hover:bg-muted transition-colors"
            >
              Update Email
            </a>
          </li>
          {#if !$page.data.user?.wallet_address}
            <li>
              <a 
                href="/settings/wallet"
                class="block p-3 rounded hover:bg-muted transition-colors"
              >
                Connect Wallet
              </a>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
</div>
