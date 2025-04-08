<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import StatCard from '$lib/components/app/molecules/StatCard/StatCard.svelte';

	// This will come from the load function in +page.ts later
	let artistData = $state({
		name: 'Your Artist Name',
		totalPlays: 24689,
		playsTrend: '+12%',
		followers: 1243,
		followersTrend: '+5%',
		totalEarnings: 1289.45,
		earningsTrend: '+23%',
		recentTips: 7,
		tipsTrend: '+40%'
	});

	// Placeholder recent activity data
	let recentActivity = $state([
		{ type: 'play', content: 'Someone played "Your Track Title"', time: '5 minutes ago' },
		{ type: 'follow', content: 'New follower: User123', time: '20 minutes ago' },
		{ type: 'tip', content: 'Received a 5 SUI tip from User456', time: '2 hours ago' },
		{ type: 'play', content: 'Someone played "Another Track"', time: '3 hours ago' },
		{ type: 'play', content: 'Someone played "Your Track Title"', time: '5 hours ago' }
	]);

	// Determine time period for stats
	let selectedPeriod = $state('week');
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
		<p class="text-muted-foreground">Welcome to your artist dashboard, {artistData.name}.</p>
	</div>

	<Tabs value={selectedPeriod} class="space-y-4">
		<TabsList>
			<TabsTrigger value="day" onclick={() => (selectedPeriod = 'day')}>Today</TabsTrigger>
			<TabsTrigger value="week" onclick={() => (selectedPeriod = 'week')}>This Week</TabsTrigger>
			<TabsTrigger value="month" onclick={() => (selectedPeriod = 'month')}>This Month</TabsTrigger>
			<TabsTrigger value="year" onclick={() => (selectedPeriod = 'year')}>This Year</TabsTrigger>
		</TabsList>

		<TabsContent value="day" class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Plays" value={artistData.totalPlays} trend={artistData.playsTrend} />
				<StatCard
					title="Followers"
					value={artistData.followers}
					trend={artistData.followersTrend}
				/>
				<StatCard
					title="Earnings"
					value={`$${artistData.totalEarnings.toFixed(2)}`}
					trend={artistData.earningsTrend}
				/>
				<StatCard
					title="Tips Received"
					value={artistData.recentTips}
					trend={artistData.tipsTrend}
				/>
			</div>
		</TabsContent>

		<TabsContent value="week" class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Plays" value={artistData.totalPlays} trend={artistData.playsTrend} />
				<StatCard
					title="Followers"
					value={artistData.followers}
					trend={artistData.followersTrend}
				/>
				<StatCard
					title="Earnings"
					value={`$${artistData.totalEarnings.toFixed(2)}`}
					trend={artistData.earningsTrend}
				/>
				<StatCard
					title="Tips Received"
					value={artistData.recentTips}
					trend={artistData.tipsTrend}
				/>
			</div>
		</TabsContent>

		<TabsContent value="month" class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Plays" value={artistData.totalPlays * 3} trend={'+15%'} />
				<StatCard title="Followers" value={artistData.followers * 2} trend={'+8%'} />
				<StatCard
					title="Earnings"
					value={`$${(artistData.totalEarnings * 3).toFixed(2)}`}
					trend={'+25%'}
				/>
				<StatCard title="Tips Received" value={artistData.recentTips * 4} trend={'+45%'} />
			</div>
		</TabsContent>

		<TabsContent value="year" class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Plays" value={artistData.totalPlays * 12} trend={'+120%'} />
				<StatCard title="Followers" value={artistData.followers * 8} trend={'+85%'} />
				<StatCard
					title="Earnings"
					value={`$${(artistData.totalEarnings * 12).toFixed(2)}`}
					trend={'+215%'}
				/>
				<StatCard title="Tips Received" value={artistData.recentTips * 15} trend={'+150%'} />
			</div>
		</TabsContent>
	</Tabs>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Activity Feed -->
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest plays, followers, and tips</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each recentActivity as activity}
						<div class="flex items-start gap-4 py-2">
							<!-- Icon based on activity type -->
							<div class="bg-primary/10 text-primary mt-1 rounded-full p-2">
								{#if activity.type === 'play'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg
									>
								{:else if activity.type === 'follow'}
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
										><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
											cx="9"
											cy="7"
											r="4"
										/><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path
											d="M16 3.13a4 4 0 0 1 0 7.75"
										/></svg
									>
								{:else if activity.type === 'tip'}
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
										><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg
									>
								{/if}
							</div>
							<div class="flex-1">
								<p class="text-sm font-medium leading-none">{activity.content}</p>
								<p class="text-muted-foreground text-sm">{activity.time}</p>
							</div>
						</div>
						{#if activity !== recentActivity[recentActivity.length - 1]}
							<Separator />
						{/if}
					{/each}
				</div>
			</CardContent>
			<CardFooter>
				<Button variant="outline" class="w-full">View All Activity</Button>
			</CardFooter>
		</Card>

		<!-- Quick Actions Card -->
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Manage your artist profile</CardDescription>
			</CardHeader>
			<CardContent class="space-y-2">
				<Button variant="outline" class="w-full justify-start">
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
						class="mr-2"
						><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
							points="17 8 12 3 7 8"
						/><line x1="12" x2="12" y1="3" y2="15" /></svg
					>
					Upload New Track
				</Button>
				<Button variant="outline" class="w-full justify-start">
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
						class="mr-2"
						><path d="M12 20h9" /><path
							d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
						/></svg
					>
					Edit Artist Profile
				</Button>
				<Button variant="outline" class="w-full justify-start">
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
						class="mr-2"
						><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" /><polygon
							points="18 2 22 6 12 16 8 16 8 12 18 2"
						/></svg
					>
					Create Announcement
				</Button>
				<Button variant="outline" class="w-full justify-start">
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
						class="mr-2"
						><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line
							x1="12"
							x2="12.01"
							y1="17"
							y2="17"
						/></svg
					>
					Get Analytics Help
				</Button>
			</CardContent>
		</Card>
	</div>

	<!-- Placeholder for charts -->
	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle>Plays Over Time</CardTitle>
				<CardDescription>Listening activity for your tracks</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="bg-muted flex h-[200px] items-center justify-center rounded-md">
					<p class="text-muted-foreground">Chart visualization will appear here</p>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Earnings Overview</CardTitle>
				<CardDescription>Revenue from tips and payments</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="bg-muted flex h-[200px] items-center justify-center rounded-md">
					<p class="text-muted-foreground">Chart visualization will appear here</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
