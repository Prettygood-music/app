<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  
  // Earnings by track data
  let trackEarnings = $state([
    { track: "Track Title 1", plays: 5243, earnings: 82.45 },
    { track: "Another Great Song", plays: 4125, earnings: 76.20 },
    { track: "My Best Track", plays: 3967, earnings: 64.85 },
    { track: "Popular Song", plays: 2845, earnings: 54.30 },
    { track: "Awesome Track", plays: 2356, earnings: 42.15 }
  ]);
  
  // Format currency function
  function formatCurrency(amount: number, currency: string = 'SUI') {
    return `${amount.toFixed(2)} ${currency}`;
  }
</script>

<div class="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle>Track Earnings</CardTitle>
      <CardDescription>Earnings breakdown by track</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-2 justify-between">
          <div class="flex gap-2">
            <Button variant="outline" size="sm">All Tracks</Button>
            <Button variant="outline" size="sm">Singles</Button>
            <Button variant="outline" size="sm">Albums</Button>
          </div>
          
          <div class="flex gap-2">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
              Sort by Earnings
            </Button>
          </div>
        </div>
        
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" class="px-4 py-3">Track</th>
                <th scope="col" class="px-4 py-3 text-right">Plays</th>
                <th scope="col" class="px-4 py-3 text-right">Tips</th>
                <th scope="col" class="px-4 py-3 text-right">Total Earnings</th>
                <th scope="col" class="px-4 py-3 text-right">Earnings per 1k Plays</th>
              </tr>
            </thead>
            <tbody>
              {#each trackEarnings as track}
                <tr class="border-b">
                  <td class="px-4 py-3 font-medium">{track.track}</td>
                  <td class="px-4 py-3 text-right">{track.plays.toLocaleString()}</td>
                  <td class="px-4 py-3 text-right">{Math.floor(Math.random() * 5) + 1}</td>
                  <td class="px-4 py-3 text-right font-medium">{formatCurrency(track.earnings)}</td>
                  <td class="px-4 py-3 text-right text-muted-foreground">{formatCurrency((track.earnings / track.plays) * 1000)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  </Card>
  
  <!-- Earnings vs Plays Chart -->
  <Card>
    <CardHeader>
      <CardTitle>Earnings vs Plays</CardTitle>
      <CardDescription>Correlation between plays and earnings</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
        <p class="text-muted-foreground">Scatter plot chart will appear here</p>
      </div>
    </CardContent>
  </Card>
</div>
