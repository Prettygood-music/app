<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  
  // Top supporters data
  let topSupporters = $state([
    { username: "User321", tips: 4, totalAmount: 42.50 },
    { username: "User456", tips: 3, totalAmount: 30.00 },
    { username: "User123", tips: 5, totalAmount: 25.00 },
    { username: "User654", tips: 2, totalAmount: 22.50 },
    { username: "User789", tips: 3, totalAmount: 17.50 }
  ]);
  
  // Format currency function
  function formatCurrency(amount: number, currency: string = 'SUI') {
    return `${amount.toFixed(2)} ${currency}`;
  }
</script>

<!-- Top Supporters Chart -->
<Card>
  <CardHeader>
    <CardTitle>Top Supporters</CardTitle>
    <CardDescription>Fans who have contributed the most</CardDescription>
  </CardHeader>
  <CardContent>
    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
          <p class="text-muted-foreground">Bar chart will appear here</p>
        </div>
        
        <div class="space-y-4">
          {#each topSupporters as supporter, i}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {i + 1}
                </div>
                <div>
                  <p class="text-sm font-medium">{supporter.username}</p>
                  <p class="text-xs text-muted-foreground">{supporter.tips} tips</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{formatCurrency(supporter.totalAmount)}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Tip Frequency Distribution -->
      <div>
        <h3 class="text-sm font-medium mb-3">Tip Frequency Distribution</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm">$1-$5</span>
            <span class="text-sm text-muted-foreground">45%</span>
          </div>
          <div class="h-2 bg-muted rounded overflow-hidden">
            <div class="h-full bg-primary" style="width: 45%"></div>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm">$5-$10</span>
            <span class="text-sm text-muted-foreground">30%</span>
          </div>
          <div class="h-2 bg-muted rounded overflow-hidden">
            <div class="h-full bg-primary" style="width: 30%"></div>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm">$10-$20</span>
            <span class="text-sm text-muted-foreground">15%</span>
          </div>
          <div class="h-2 bg-muted rounded overflow-hidden">
            <div class="h-full bg-primary" style="width: 15%"></div>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm">$20+</span>
            <span class="text-sm text-muted-foreground">10%</span>
          </div>
          <div class="h-2 bg-muted rounded overflow-hidden">
            <div class="h-full bg-primary" style="width: 10%"></div>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

<!-- Supporter Growth -->
<Card class="mt-4">
  <CardHeader>
    <CardTitle>Supporter Growth</CardTitle>
    <CardDescription>New supporters over time</CardDescription>
  </CardHeader>
  <CardContent>
    <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
      <p class="text-muted-foreground">Line chart will appear here</p>
    </div>
  </CardContent>
</Card>

<!-- Support Engagement Funnel -->
<Card class="mt-4">
  <CardHeader>
    <CardTitle>Support Engagement Funnel</CardTitle>
    <CardDescription>How listeners convert to supporters</CardDescription>
  </CardHeader>
  <CardContent>
    <div class="h-[250px] bg-muted rounded-md flex items-center justify-center">
      <p class="text-muted-foreground">Funnel chart will appear here</p>
    </div>
    <div class="mt-4 grid grid-cols-4 gap-2 text-center">
      <div class="p-2">
        <p class="text-2xl font-bold">10,224</p>
        <p class="text-xs text-muted-foreground">Unique Listeners</p>
      </div>
      <div class="p-2">
        <p class="text-2xl font-bold">2,456</p>
        <p class="text-xs text-muted-foreground">Followers</p>
      </div>
      <div class="p-2">
        <p class="text-2xl font-bold">528</p>
        <p class="text-xs text-muted-foreground">Repeat Listeners</p>
      </div>
      <div class="p-2">
        <p class="text-2xl font-bold">187</p>
        <p class="text-xs text-muted-foreground">Active Supporters</p>
      </div>
    </div>
  </CardContent>
</Card>
