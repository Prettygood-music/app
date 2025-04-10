<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	import EarningsOverview from './components/EarningsOverview.svelte';
	import TransactionHistory from './components/TransactionHistory.svelte';
	import TrackEarnings from './components/TrackEarnings.svelte';
	import TopSupporters from './components/TopSupporters.svelte';

	// Placeholder data
	let timeFrame = $state('month');

	// Format currency function
	function formatCurrency(amount: number, currency: string = 'SUI') {
		return `${amount.toFixed(2)} ${currency}`;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Earnings & Payments</h1>
			<p class="text-muted-foreground">Track your revenue and payment history</p>
		</div>

		<div class="flex flex-col gap-2 sm:flex-row">
			<Select.Root type="single" value={timeFrame} onValueChange={(value) => (timeFrame = value)}>
				<Select.Trigger class="w-[180px]">Select timeframe</Select.Trigger>
				<Select.Content>
					<Select.Item value="week">Last 7 days</Select.Item>
					<Select.Item value="month">Last 30 days</Select.Item>
					<Select.Item value="quarter">Last 90 days</Select.Item>
					<Select.Item value="year">Last year</Select.Item>
					<Select.Item value="alltime">All time</Select.Item>
				</Select.Content>
			</Select.Root>

			<Button variant="outline">
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
					><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line
						x1="16"
						x2="16"
						y1="8"
						y2="16"
					/><line x1="8" x2="8" y1="8" y2="16" /></svg
				>
				Export Data
			</Button>
		</div>
	</div>

	<!-- Overview Cards -->
	<EarningsOverview {timeFrame} />

	<Tabs value="overview" class="space-y-4">
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="transactions">Transactions</TabsTrigger>
			<TabsTrigger value="tracks">Track Earnings</TabsTrigger>
			<TabsTrigger value="supporters">Top Supporters</TabsTrigger>
		</TabsList>

		<TabsContent value="overview" class="space-y-4">
			<!-- Earnings Chart -->
			<Card>
				<CardHeader>
					<CardTitle>Earnings Over Time</CardTitle>
					<CardDescription>Your earnings history for the selected period</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
						<p class="text-muted-foreground">Earnings chart will appear here</p>
					</div>
				</CardContent>
			</Card>

			<!-- Recent Transactions -->
			<TransactionHistory limit={5} showViewAllButton={true} />

			<!-- Earnings Distribution -->
			<Card>
				<CardHeader>
					<CardTitle>Earnings Distribution</CardTitle>
					<CardDescription>Breakdown of your earnings by source</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="bg-muted flex h-[250px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Pie chart will appear here</p>
						</div>

						<div class="space-y-4">
							<!-- Distribution chart would go here -->
							<p class="text-muted-foreground my-8 text-center text-sm">
								Earnings distribution data will be displayed here showing your top earning tracks
								and their relative contribution to your revenue.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="transactions" class="space-y-4">
			<TransactionHistory limit={0} showPagination={true} />
		</TabsContent>

		<TabsContent value="tracks" class="space-y-4">
			<TrackEarnings />
		</TabsContent>

		<TabsContent value="supporters" class="space-y-4">
			<TopSupporters />
		</TabsContent>
	</Tabs>
</div>
