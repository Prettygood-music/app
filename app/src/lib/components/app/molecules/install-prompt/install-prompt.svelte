<script lang="ts">
  import { useInstallPrompt } from "$lib/hooks/use-install-prompt.svelte";
  import { goto } from "$app/navigation";
  import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import { Download, X } from "lucide-svelte";
  
  // Export props
  let { variant = "banner" } = $props<{
    variant?: "banner" | "inline" | "floating"
  }>();
  
  // Get the installation hook
  const { 
    isInstallable, 
    hasPrompt, 
    promptInstall, 
    shouldPromptInstall 
  } = useInstallPrompt();
  
  // State
  let showPrompt = $state(false);
  let installInProgress = $state(false);
  
  // Show the prompt if conditions are met
  $effect(() => {
    // Only show if the app is installable and we haven't dismissed it
    if (isInstallable && hasPrompt && shouldPromptInstall()) {
      showPrompt = true;
    }
  });
  
  // Handle install click
  async function handleInstall() {
    installInProgress = true;
    
    try {
      const result = await promptInstall();
      
      if (result.outcome === 'accepted') {
        // Successfully installed, hide the prompt
        showPrompt = false;
      }
    } catch (error) {
      console.error('Installation error:', error);
      // If there's an error, redirect to the install page
      goto('/install');
    } finally {
      installInProgress = false;
    }
  }
  
  // Handle the "Learn more" click
  function handleLearnMore() {
    goto('/install');
  }
  
  // Dismiss the prompt
  function handleDismiss() {
    showPrompt = false;
    // Store in local storage to prevent showing again too soon
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('install_prompt_dismissed', Date.now().toString());
    }
  }
</script>

{#if showPrompt}
  {#if variant === "banner"}
    <Alert class="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Download size={20} class="text-primary" />
          <div>
            <AlertTitle>Install prettygood.music</AlertTitle>
            <AlertDescription>Get the full app experience and offline access.</AlertDescription>
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" on:click={handleDismiss}>
            <X size={16} class="mr-1" /> Dismiss
          </Button>
          <Button size="sm" on:click={handleInstall} disabled={installInProgress}>
            {#if installInProgress}
              Installing...
            {:else}
              Install Now
            {/if}
          </Button>
        </div>
      </div>
    </Alert>
  {:else if variant === "inline"}
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 my-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-primary/10 p-2 rounded-full">
            <Download size={18} class="text-primary" />
          </div>
          <div>
            <h3 class="font-semibold">Install prettygood.music</h3>
            <p class="text-sm text-muted-foreground">Install our app for offline listening and better performance.</p>
          </div>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" class="flex-1 sm:flex-initial" size="sm" on:click={handleLearnMore}>
            Learn More
          </Button>
          <Button class="flex-1 sm:flex-initial" size="sm" on:click={handleInstall} disabled={installInProgress}>
            {#if installInProgress}
              Installing...
            {:else}
              Install Now
            {/if}
          </Button>
        </div>
      </div>
    </div>
  {:else if variant === "floating"}
    <div class="fixed bottom-4 right-4 z-50 max-w-xs w-full">
      <Alert class="border shadow-lg">
        <div class="flex justify-between items-start">
          <div class="flex gap-2">
            <Download size={20} class="text-primary mt-0.5" />
            <div>
              <AlertTitle>Install App</AlertTitle>
              <AlertDescription class="text-sm">Add to your home screen for the best experience.</AlertDescription>
              <div class="mt-2 flex gap-2">
                <Button size="sm" variant="outline" on:click={handleLearnMore}>
                  Learn More
                </Button>
                <Button size="sm" on:click={handleInstall} disabled={installInProgress}>
                  {#if installInProgress}
                    Installing...
                  {:else}
                    Install
                  {/if}
                </Button>
              </div>
            </div>
          </div>
          <button 
            class="text-muted-foreground hover:text-foreground transition-colors" 
            on:click={handleDismiss} 
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </Alert>
    </div>
  {/if}
{/if}
