<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  
  export let timeFrame = 'month';
  
  // Placeholder data
  const transactions = [
    {
      id: "tx-1",
      type: "tip",
      amount: 5.00,
      currency: "SUI",
      track: "Track Title 1",
      from: "User123",
      date: "2025-03-25T14:32:21Z",
      status: "confirmed"
    },
    {
      id: "tx-2",
      type: "tip",
      amount: 10.00,
      currency: "SUI",
      track: "Another Great Song",
      from: "User456",
      date: "2025-03-24T09:15:43Z",
      status: "confirmed"
    },
    {
      id: "tx-3",
      type: "tip",
      amount: 2.50,
      currency: "SUI",
      track: "My Best Track",
      from: "User789",
      date: "2025-03-23T18:05:12Z",
      status: "confirmed"
    },
    {
      id: "tx-4",
      type: "tip",
      amount: 15.00,
      currency: "SUI",
      track: "Popular Song",
      from: "User321",
      date: "2025-03-21T11:22:54Z",
      status: "confirmed"
    },
    {
      id: "tx-5",
      type: "tip",
      amount: 7.50,
      currency: "SUI",
      album: "My Album",
      from: "User654",
      date: "2025-03-20T15:47:38Z",
      status: "confirmed"
    }
  ];
  
  // Earnings by track data
  const trackEarnings = [
    { track: "Track Title 1", plays: 5243, earnings: 82.45 },
    { track: "Another Great Song", plays: 4125, earnings: 76.20 },
    { track: "My Best Track", plays: 3967, earnings: 64.85 },
    { track: "Popular Song", plays: 2845, earnings: 54.30 },
    { track: "Awesome Track", plays: 2356, earnings: 42.15 }
  ];
  
  // Format currency function
  function formatCurrency(amount: number, currency: string = 'SUI') {
    return `${amount.toFixed(2)} ${currency}`;
  }
  
  // Calculate totals
  const totalEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalTips = transactions.length;
  const avgTipAmount = totalEarnings / totalTips;
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">Total Earnings</CardTitle>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
      <p class="text-xs text-muted-foreground">+23% from last period</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">Total Tips</CardTitle>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{totalTips}</div>
      <p class="text-xs text-muted-foreground">+15% from last period</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">Average Tip</CardTitle>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{formatCurrency(avgTipAmount)}</div>
      <p class="text-xs text-muted-foreground">+5% from last period</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">Top Track Earnings</CardTitle>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{formatCurrency(trackEarnings[0].earnings)}</div>
      <p class="text-xs text-muted-foreground">{trackEarnings[0].track}</p>
    </CardContent>
  </Card>
</div>
