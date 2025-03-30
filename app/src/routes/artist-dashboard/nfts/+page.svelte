<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { toast } from "$lib/components/ui/sonner";
  
  let email = $state('');
  let isSubmitting = $state(false);
  
  async function handleSubmit() {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    isSubmitting = true;
    
    try {
      // In a real implementation, this would be an API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("You'll be notified when NFT features are available!");
      email = '';
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">NFT Features</h1>
    <p class="text-muted-foreground">Create and manage NFTs for your music</p>
  </div>
  
  <div class="grid gap-6 md:grid-cols-2">
    <!-- Coming Soon Card -->
    <Card class="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Coming Soon!</CardTitle>
        <CardDescription>
          NFT features are currently in development
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="rounded-lg bg-primary/10 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-primary">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">NFT Creation & Management</h3>
          <p class="text-muted-foreground">
            We're working on tools to help you tokenize your music and connect with collectors.
          </p>
        </div>
        
        <div class="space-y-2">
          <h4 class="font-medium">Planned Features:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Create NFTs for tracks and albums</li>
            <li>Set pricing and edition limits</li>
            <li>Track ownership and transfers</li>
            <li>Earn royalties on secondary sales</li>
            <li>Connect with NFT marketplaces</li>
          </ul>
        </div>
        
        <p class="text-sm text-muted-foreground">
          These features will be available in a future update. Sign up to be notified when they launch.
        </p>
      </CardContent>
    </Card>
    
    <!-- Notification Signup -->
    <Card class="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Get Notified</CardTitle>
        <CardDescription>
          Sign up to be the first to know when NFT features are available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              bind:value={email}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div class="space-y-2">
            <Label>Interested in:</Label>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="track-nfts" class="rounded border-gray-300" checked />
                <label for="track-nfts" class="text-sm">Track NFTs</label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="album-nfts" class="rounded border-gray-300" checked />
                <label for="album-nfts" class="text-sm">Album NFTs</label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="limited-editions" class="rounded border-gray-300" checked />
                <label for="limited-editions" class="text-sm">Limited Editions</label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="royalties" class="rounded border-gray-300" checked />
                <label for="royalties" class="text-sm">Royalty Programs</label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button class="w-full" disabled={isSubmitting} on:click={handleSubmit}>
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          {:else}
            Notify Me When Available
          {/if}
        </Button>
      </CardFooter>
    </Card>
  </div>
  
  <!-- FAQ Section -->
  <Card>
    <CardHeader>
      <CardTitle>Frequently Asked Questions</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <h3 class="font-medium">What are music NFTs?</h3>
        <p class="text-sm text-muted-foreground">
          Music NFTs are unique digital assets that represent ownership of a piece of music. 
          They allow artists to tokenize their work and fans to collect and own pieces of music history.
        </p>
      </div>
      
      <div class="space-y-2">
        <h3 class="font-medium">How will royalties work?</h3>
        <p class="text-sm text-muted-foreground">
          Our NFT platform will support creator royalties, allowing you to earn a percentage of all secondary sales of your NFTs. This creates a new revenue stream that continues as your music gains value in the collector market.
        </p>
      </div>
      
      <div class="space-y-2">
        <h3 class="font-medium">Will I still own my music?</h3>
        <p class="text-sm text-muted-foreground">
          Yes, creating NFTs for your music does not transfer copyright or ownership of the original work. You'll maintain all your rights to the music while offering unique collectible versions to your fans.
        </p>
      </div>
      
      <div class="space-y-2">
        <h3 class="font-medium">What blockchain will be used?</h3>
        <p class="text-sm text-muted-foreground">
          We'll be using the Sui blockchain for all NFT operations, the same network that powers our tipping and payment features. This ensures a seamless experience and lower transaction costs.
        </p>
      </div>
      
      <div class="space-y-2">
        <h3 class="font-medium">When will these features be available?</h3>
        <p class="text-sm text-muted-foreground">
          We're currently in development and aim to launch NFT features in the coming months. Sign up to be notified when they become available, and you'll be among the first to access these new tools.
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" class="w-full" on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Get Notified About Launch
      </Button>
    </CardFooter>
  </Card>
</div>
