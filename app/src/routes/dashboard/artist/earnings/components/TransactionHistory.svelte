<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { limit = 0, showViewAllButton = false, showPagination = false } = $props();
  

	// Placeholder transaction history
	let transactions = $state([
		{
			id: 'tx-1',
			type: 'tip',
			amount: 5.0,
			currency: 'SUI',
			track: 'Track Title 1',
			from: 'User123',
			date: '2025-03-25T14:32:21Z',
			status: 'confirmed'
		},
		{
			id: 'tx-2',
			type: 'tip',
			amount: 10.0,
			currency: 'SUI',
			track: 'Another Great Song',
			from: 'User456',
			date: '2025-03-24T09:15:43Z',
			status: 'confirmed'
		},
		{
			id: 'tx-3',
			type: 'tip',
			amount: 2.5,
			currency: 'SUI',
			track: 'My Best Track',
			from: 'User789',
			date: '2025-03-23T18:05:12Z',
			status: 'confirmed'
		},
		{
			id: 'tx-4',
			type: 'tip',
			amount: 15.0,
			currency: 'SUI',
			track: 'Popular Song',
			from: 'User321',
			date: '2025-03-21T11:22:54Z',
			status: 'confirmed'
		},
		{
			id: 'tx-5',
			type: 'tip',
			amount: 7.5,
			currency: 'SUI',
			album: 'My Album',
			from: 'User654',
			date: '2025-03-20T15:47:38Z',
			status: 'confirmed'
		}
	]);

	// Format date function
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	// Format currency function
	function formatCurrency(amount: number, currency: string = 'SUI') {
		return `${amount.toFixed(2)} ${currency}`;
	}

	// Get transactions to display based on limit
	// $derived displayTransactions = limit > 0 ? transactions.slice(0, limit) : transactions;
	let displayTransactions = $derived.by(() => {
		if (limit > 0) {
			return transactions.slice(0, limit);
		} else {
			return transactions;
		}
	});
</script>

{#if showPagination}
	<Card>
		<CardHeader>
			<CardTitle>Transaction History</CardTitle>
			<CardDescription>Complete record of all your earnings</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<div class="flex flex-col justify-between gap-2 sm:flex-row">
					<div class="flex gap-2">
						<Button variant="outline" size="sm">All</Button>
						<Button variant="outline" size="sm">Tips</Button>
						<Button variant="outline" size="sm">Sales</Button>
						<Button variant="outline" size="sm">Royalties</Button>
					</div>

					<div class="flex gap-2">
						<Button variant="outline" size="sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-2 h-4 w-4"
								><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg
							>
							Filter
						</Button>
						<Button variant="outline" size="sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-2 h-4 w-4"
								><line x1="21" x2="3" y1="6" y2="6" /><line x1="15" x2="3" y1="12" y2="12" /><line
									x1="17"
									x2="3"
									y1="18"
									y2="18"
								/></svg
							>
							Sort
						</Button>
					</div>
				</div>

				<div class="relative overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="bg-muted/50 text-xs uppercase">
							<tr>
								<th scope="col" class="px-4 py-3">Date</th>
								<th scope="col" class="px-4 py-3">Transaction ID</th>
								<th scope="col" class="px-4 py-3">Type</th>
								<th scope="col" class="px-4 py-3">From</th>
								<th scope="col" class="px-4 py-3">Content</th>
								<th scope="col" class="px-4 py-3">Status</th>
								<th scope="col" class="px-4 py-3 text-right">Amount</th>
							</tr>
						</thead>
						<tbody>
							{#each displayTransactions as tx}
								<tr class="border-b">
									<td class="px-4 py-3">{formatDate(tx.date)}</td>
									<td class="px-4 py-3 font-mono text-xs">{tx.id}</td>
									<td class="px-4 py-3">
										<span
											class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
										>
											{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
										</span>
									</td>
									<td class="px-4 py-3 font-medium">{tx.from}</td>
									<td class="px-4 py-3">{tx.track || tx.album || '-'}</td>
									<td class="px-4 py-3">
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100"
										>
											{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
										</span>
									</td>
									<td class="px-4 py-3 text-right font-medium"
										>{formatCurrency(tx.amount, tx.currency)}</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</CardContent>
		{#if showPagination}
			<CardFooter class="flex justify-between">
				<Button variant="outline" disabled>Previous</Button>
				<div class="text-muted-foreground text-sm">Page 1 of 1</div>
				<Button variant="outline" disabled>Next</Button>
			</CardFooter>
		{/if}
	</Card>
{:else}
	<Card>
		<CardHeader>
			<CardTitle>Recent Transactions</CardTitle>
			<CardDescription>Your most recent payments and tips</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="relative overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="bg-muted/50 text-xs uppercase">
						<tr>
							<th scope="col" class="px-4 py-3">Date</th>
							<th scope="col" class="px-4 py-3">Type</th>
							<th scope="col" class="px-4 py-3">From</th>
							<th scope="col" class="px-4 py-3">Content</th>
							<th scope="col" class="px-4 py-3 text-right">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each displayTransactions as tx}
							<tr class="border-b">
								<td class="px-4 py-3">{formatDate(tx.date)}</td>
								<td class="px-4 py-3">
									<span
										class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
									>
										{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
									</span>
								</td>
								<td class="px-4 py-3 font-medium">{tx.from}</td>
								<td class="px-4 py-3">{tx.track || tx.album || '-'}</td>
								<td class="px-4 py-3 text-right font-medium"
									>{formatCurrency(tx.amount, tx.currency)}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContent>
		{#if showViewAllButton}
			<CardFooter>
				<Button variant="outline" class="w-full">View All Transactions</Button>
			</CardFooter>
		{/if}
	</Card>
{/if}
