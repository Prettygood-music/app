<script lang="ts">
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';
	import WalletAddressDisplay from '$lib/components/app/molecules/wallet-address-display/wallet-address-display.svelte';
	import { ExternalLink, Copy, CreditCard, AlertCircle, CheckCircle2, PencilLine, ArrowUpRight } from 'lucide-svelte';

	// Mock data
	let hasPayoutAddress = $state(false);
	let payoutAddress = $state('');
	let newPayoutAddress = $state('');
	let isEditingAddress = $state(false);
	let isSubmitting = $state(false);
	let isValidAddress = $state(true);
	let activeTab = $state('history');

	// Mock transaction history
	const transactions = $state([
		{
			id: 'tx-001',
			date: '2025-04-01',
			amount: '0.421 ETH',
			status: 'completed',
			description: 'Royalty payment - March 2025'
		},
		{
			id: 'tx-002',
			date: '2025-03-01',
			amount: '0.384 ETH',
			status: 'completed',
			description: 'Royalty payment - February 2025'
		},
		{
			id: 'tx-003',
			date: '2025-02-01',
			amount: '0.265 ETH',
			status: 'completed',
			description: 'Royalty payment - January 2025'
		}
	]);

	// Validate Ethereum address (simplified example)
	function validateEthAddress(address: string): boolean {
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	}

	// Submit new payout address
	function submitAddress() {
		isSubmitting = true;
		isValidAddress = validateEthAddress(newPayoutAddress);

		if (!isValidAddress) {
			isSubmitting = false;
			return;
		}

		// Simulate API call
		setTimeout(() => {
			payoutAddress = newPayoutAddress;
			hasPayoutAddress = true;
			isEditingAddress = false;
			isSubmitting = false;
			newPayoutAddress = '';
		}, 1000);
	}

	// Start editing existing address
	function editAddress() {
		newPayoutAddress = payoutAddress;
		isEditingAddress = true;
	}

	// Cancel editing
	function cancelEditing() {
		isEditingAddress = false;
		newPayoutAddress = '';
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Wallet & Payouts</h1>
		<p class="text-muted-foreground mt-1">Manage your payout wallet and view transaction history.</p>
	</div>

	{#if !hasPayoutAddress && !isEditingAddress}
		<Card>
			<CardHeader>
				<CardTitle>Set Up Payout Address</CardTitle>
				<CardDescription>
					You need to set up a payout address to receive earnings from your music.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4 max-w-lg">
					<Alert variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<AlertTitle>Important</AlertTitle>
						<AlertDescription>
							Make sure to enter a valid Ethereum address. Funds sent to an incorrect address cannot be
							recovered.
						</AlertDescription>
					</Alert>

					<div class="space-y-2">
						<Label for="payout-address">Ethereum Wallet Address</Label>
						<Input
							id="payout-address"
							placeholder="0x..."
							bind:value={newPayoutAddress}
							class="font-mono"
						/>
						{#if !isValidAddress}
							<p class="text-destructive text-sm">Please enter a valid Ethereum address</p>
						{/if}
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onclick={submitAddress}
					disabled={isSubmitting || !newPayoutAddress}
					class="mr-2">
					{#if isSubmitting}
						Saving...
					{:else}
						Save Payout Address
					{/if}
				</Button>
			</CardFooter>
		</Card>
	{:else if isEditingAddress}
		<Card>
			<CardHeader>
				<CardTitle>Update Payout Address</CardTitle>
				<CardDescription>
					Update the wallet address where you receive payouts.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4 max-w-lg">
					<Alert variant="default">
						<AlertCircle class="h-4 w-4" />
						<AlertTitle>Important</AlertTitle>
						<AlertDescription>
							Make sure to enter a valid Ethereum address. Funds sent to an incorrect address cannot be
							recovered.
						</AlertDescription>
					</Alert>

					<div class="space-y-2">
						<Label for="new-payout-address">New Ethereum Wallet Address</Label>
						<Input
							id="new-payout-address"
							placeholder="0x..."
							bind:value={newPayoutAddress}
							class="font-mono"
						/>
						{#if !isValidAddress}
							<p class="text-destructive text-sm">Please enter a valid Ethereum address</p>
						{/if}
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onclick={submitAddress}
					disabled={isSubmitting || !newPayoutAddress}
					variant="default"
					class="mr-2">
					{#if isSubmitting}
						Saving...
					{:else}
						Update Address
					{/if}
				</Button>
				<Button onclick={cancelEditing} variant="outline">Cancel</Button>
			</CardFooter>
		</Card>
	{:else}
		<div class="grid gap-6 md:grid-cols-7">
			<Card class="md:col-span-3">
				<CardHeader>
					<CardTitle>Payout Address</CardTitle>
					<CardDescription>
						Earnings are sent to this wallet address
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="flex flex-col space-y-2">
							<Label>Current Payout Address</Label>
							<div class="flex items-start">
								<WalletAddressDisplay 
									address={payoutAddress || '0x7f268357A8c2552623316e2562D90e642bB538E5'} 
									copyEnabled={true}
									truncateLength={6}
								/>
							</div>
						</div>
						
						<Alert variant="default">
							<CheckCircle2 class="h-4 w-4" />
							<AlertTitle>Ready to receive payouts</AlertTitle>
							<AlertDescription>
								Royalty payments will be automatically sent to this address.
							</AlertDescription>
						</Alert>
					</div>
				</CardContent>
				<CardFooter>
					<Button onclick={editAddress} variant="outline" class="flex gap-2">
						<PencilLine class="h-4 w-4" /> Change Address
					</Button>
				</CardFooter>
			</Card>

			<Card class="md:col-span-4">
				<CardHeader>
					<Tabs bind:value={activeTab} class="w-full">
						<div class="flex items-center justify-between">
							<CardTitle>Transaction History</CardTitle>
							<TabsList>
								<TabsTrigger value="history">History</TabsTrigger>
								<TabsTrigger value="pending">Pending</TabsTrigger>
							</TabsList>
						</div>
						<CardDescription>
							Recent payout transactions to your wallet
						</CardDescription>
					</Tabs>
				</CardHeader>
				<CardContent>
					<TabsContent value="history" class="m-0 p-0">
						<div class="space-y-2">
							{#if transactions.length === 0}
								<div class="flex flex-col items-center justify-center py-8 text-center">
									<CreditCard class="h-8 w-8 text-muted-foreground mb-2" />
									<h3 class="font-medium">No transactions yet</h3>
									<p class="text-sm text-muted-foreground">
										Payments will appear here once they're processed.
									</p>
								</div>
							{:else}
								{#each transactions as tx}
									<div class="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
										<div class="flex flex-col">
											<span class="font-medium">{tx.description}</span>
											<span class="text-sm text-muted-foreground">{tx.date}</span>
										</div>
										<div class="flex items-center gap-2">
											<span class="font-mono font-medium">{tx.amount}</span>
											<Button variant="ghost" size="icon" class="h-8 w-8">
												<ArrowUpRight class="h-4 w-4" />
											</Button>
										</div>
									</div>
									{#if tx !== transactions[transactions.length - 1]}
										<Separator />
									{/if}
								{/each}
							{/if}
						</div>
					</TabsContent>
					<TabsContent value="pending" class="m-0 p-0">
						<div class="flex flex-col items-center justify-center py-8 text-center">
							<CreditCard class="h-8 w-8 text-muted-foreground mb-2" />
							<h3 class="font-medium">No pending transactions</h3>
							<p class="text-sm text-muted-foreground">
								Any pending royalty payments will appear here.
							</p>
						</div>
					</TabsContent>
				</CardContent>
				<CardFooter class="text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<span>Payments are processed on the 1st of each month</span>
					</div>
				</CardFooter>
			</Card>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Payment FAQ</CardTitle>
				<CardDescription>
					Frequently asked questions about payouts and wallet addresses
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div>
						<h3 class="font-medium">When are royalties paid out?</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Royalties are calculated at the end of each month and paid out on the 1st of the following month.
						</p>
					</div>
					<Separator />
					<div>
						<h3 class="font-medium">What wallet types are supported?</h3>
						<p class="text-sm text-muted-foreground mt-1">
							We currently support Ethereum (ETH) wallet addresses. Make sure you provide an address that can receive ETH tokens.
						</p>
					</div>
					<Separator />
					<div>
						<h3 class="font-medium">Are there any fees for receiving payments?</h3>
						<p class="text-sm text-muted-foreground mt-1">
							We cover all gas fees for payments. You'll receive the full amount of your royalties.
						</p>
					</div>
					<Separator />
					<div>
						<h3 class="font-medium">How do I change my payout address?</h3>
						<p class="text-sm text-muted-foreground mt-1">
							You can change your payout address at any time by clicking the "Change Address" button. Changes will take effect for the next payment cycle.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
