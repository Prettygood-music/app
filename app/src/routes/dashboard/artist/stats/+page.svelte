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
	import { formatDuration } from '$lib/utils';
	let { data } = $props();

	let topTracks = $derived(data.tracks_with_details);

	let geoData = $state([
		{ country: 'United States', listeners: 4256, percentage: 42 },
		{ country: 'United Kingdom', listeners: 1843, percentage: 18 },
		{ country: 'Germany', listeners: 954, percentage: 9 },
		{ country: 'Canada', listeners: 724, percentage: 7 },
		{ country: 'Australia', listeners: 524, percentage: 5 },
		{ country: 'Other', listeners: 1923, percentage: 19 }
	]);

	let selectedMetric = $state('plays');
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Stats & Analytics</h1>
			<p class="text-muted-foreground">Track your music performance metrics</p>
		</div>
	</div>

	<Tabs value="overview" class="space-y-4">
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="plays">Plays</TabsTrigger>
			<TabsTrigger value="audience">Audience</TabsTrigger>
			<TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
		</TabsList>

		<TabsContent value="overview" class="space-y-4">
			<!-- Overview Stats Cards -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Total Plays</CardTitle>
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
							class="text-muted-foreground"><polygon points="5 3 19 12 5 21 5 3" /></svg
						>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">24,689</div>
						<p class="text-muted-foreground text-xs">+12% from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Unique Listeners</CardTitle>
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
							class="text-muted-foreground"
							><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
								cx="9"
								cy="7"
								r="4"
							/><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg
						>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">10,224</div>
						<p class="text-muted-foreground text-xs">+8% from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">New Followers</CardTitle>
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
							class="text-muted-foreground"
							><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
								cx="8.5"
								cy="7"
								r="4"
							/><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg
						>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">312</div>
						<p class="text-muted-foreground text-xs">+15% from last month</p>
					</CardContent>
				</Card>
			</div>

			<!-- Charts -->
			<div class="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Plays Over Time</CardTitle>
						<CardDescription>Daily play count for the selected period</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Line chart visualization will appear here</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Tracks</CardTitle>
						<CardDescription>Your most played tracks</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2">
							{#each topTracks as track, i}
								<div
									class="flex items-center justify-between pb-2 {i < topTracks.length - 1
										? 'border-b'
										: ''}"
								>
									<div class="flex items-center gap-2">
										<div
											class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
										>
											{i + 1}
										</div>
										<div>
											<p class="text-sm font-medium">{track.title}</p>
											<p class="text-muted-foreground text-xs">
												{formatDuration(track.duration || 0)}
											</p>
										</div>
									</div>
									<div class="text-right">
										<p class="text-sm font-medium">
											{(track.play_count || 0).toLocaleString()} Plays
										</p>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" class="w-full">View All Tracks</Button>
					</CardFooter>
				</Card>
			</div>

			<!-- Geographic Distribution -->
			<Card>
				<CardHeader>
					<CardTitle>Geographic Distribution</CardTitle>
					<CardDescription>Where your listeners are located</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Map visualization will appear here</p>
						</div>

						<div>
							<div class="space-y-3">
								{#each geoData as geo}
									<div class="space-y-1">
										<div class="flex items-center justify-between">
											<span class="text-sm font-medium">{geo.country}</span>
											<span class="text-muted-foreground text-sm"
												>{geo.listeners.toLocaleString()} listeners</span
											>
										</div>
										<div class="bg-muted h-2 overflow-hidden rounded">
											<div class="bg-primary h-full" style="width: {geo.percentage}%"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="plays" class="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Playback Analytics</CardTitle>
					<CardDescription>Detailed play statistics for your tracks</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="flex flex-col gap-2 sm:flex-row">
							<Select.Root
								type="single"
								value={selectedMetric}
								onValueChange={(value) => (selectedMetric = value)}
							>
								<Select.Trigger class="w-[180px]">
									<!-- <Select.Value placeholder="Select metric" /> -->
									Select Metric
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="plays">Total Plays</Select.Item>
									<Select.Item value="unique">Unique Listeners</Select.Item>
									<Select.Item value="completion">Completion Rate</Select.Item>
									<Select.Item value="skips">Skip Rate</Select.Item>
								</Select.Content>
							</Select.Root>

							<div class="flex gap-2">
								<Button variant="outline" size="sm">Daily</Button>
								<Button variant="outline" size="sm">Weekly</Button>
								<Button variant="outline" size="sm">Monthly</Button>
							</div>
						</div>

						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Detailed play metrics chart will appear here</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div class="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Play Sessions by Time of Day</CardTitle>
						<CardDescription>When people listen to your music</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Heatmap visualization will appear here</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Track Completion Rate</CardTitle>
						<CardDescription>How much of your tracks people listen to</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Completion curve chart will appear here</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</TabsContent>

		<TabsContent value="audience" class="space-y-4">
			<div class="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Follower Growth</CardTitle>
						<CardDescription>How your audience is growing over time</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Follower growth chart will appear here</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Listener Retention</CardTitle>
						<CardDescription>How many listeners come back to your music</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
							<p class="text-muted-foreground">Retention heatmap will appear here</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Audience Demographics</CardTitle>
					<CardDescription>Insights about your listeners (data is anonymized)</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<h3 class="mb-2 text-sm font-medium">Platform Usage</h3>
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<span class="text-sm">Mobile</span>
									<span class="text-muted-foreground text-sm">64%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 64%"></div>
								</div>

								<div class="flex items-center justify-between">
									<span class="text-sm">Desktop</span>
									<span class="text-muted-foreground text-sm">28%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 28%"></div>
								</div>

								<div class="flex items-center justify-between">
									<span class="text-sm">Tablet</span>
									<span class="text-muted-foreground text-sm">5%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 5%"></div>
								</div>

								<div class="flex items-center justify-between">
									<span class="text-sm">Other</span>
									<span class="text-muted-foreground text-sm">3%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 3%"></div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="traffic" class="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Traffic Sources</CardTitle>
					<CardDescription>Where listeners discover your music</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="bg-muted flex h-[300px] items-center justify-center rounded-md">
						<p class="text-muted-foreground">Traffic sources chart will appear here</p>
					</div>
				</CardContent>
			</Card>

			<div class="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Top External Referrers</CardTitle>
						<CardDescription>Websites sending traffic to your music</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
									>
										1
									</div>
									<div>
										<p class="text-sm font-medium">Social Media Platform</p>
										<p class="text-muted-foreground text-xs">42% of referrals</p>
									</div>
								</div>
								<p class="text-sm font-medium">4,256 plays</p>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
									>
										2
									</div>
									<div>
										<p class="text-sm font-medium">Music Blog</p>
										<p class="text-muted-foreground text-xs">24% of referrals</p>
									</div>
								</div>
								<p class="text-sm font-medium">2,432 plays</p>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
									>
										3
									</div>
									<div>
										<p class="text-sm font-medium">Other Streaming Service</p>
										<p class="text-muted-foreground text-xs">16% of referrals</p>
									</div>
								</div>
								<p class="text-sm font-medium">1,624 plays</p>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
									>
										4
									</div>
									<div>
										<p class="text-sm font-medium">Your Website</p>
										<p class="text-muted-foreground text-xs">11% of referrals</p>
									</div>
								</div>
								<p class="text-sm font-medium">1,116 plays</p>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md"
									>
										5
									</div>
									<div>
										<p class="text-sm font-medium">Other Sources</p>
										<p class="text-muted-foreground text-xs">7% of referrals</p>
									</div>
								</div>
								<p class="text-sm font-medium">712 plays</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Discovery Methods</CardTitle>
						<CardDescription>How people find your music</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Search</span>
									<span class="text-muted-foreground text-sm">35%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 35%"></div>
								</div>
							</div>

							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Playlists</span>
									<span class="text-muted-foreground text-sm">28%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 28%"></div>
								</div>
							</div>

							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Direct Links</span>
									<span class="text-muted-foreground text-sm">18%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 18%"></div>
								</div>
							</div>

							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Recommendations</span>
									<span class="text-muted-foreground text-sm">12%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 12%"></div>
								</div>
							</div>

							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Other</span>
									<span class="text-muted-foreground text-sm">7%</span>
								</div>
								<div class="bg-muted h-2 overflow-hidden rounded">
									<div class="bg-primary h-full" style="width: 7%"></div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Playlist Appearances</CardTitle>
					<CardDescription>Public playlists featuring your music</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="relative overflow-x-auto">
						<table class="w-full text-left text-sm">
							<thead class="bg-muted/50 text-xs uppercase">
								<tr>
									<th scope="col" class="px-4 py-3">Playlist Name</th>
									<th scope="col" class="px-4 py-3">Creator</th>
									<th scope="col" class="px-4 py-3">Followers</th>
									<th scope="col" class="px-4 py-3">Plays Generated</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b">
									<td class="px-4 py-3 font-medium">Best New Indie</td>
									<td class="px-4 py-3">Platform Editorial</td>
									<td class="px-4 py-3">45.2K</td>
									<td class="px-4 py-3">1,254</td>
								</tr>
								<tr class="border-b">
									<td class="px-4 py-3 font-medium">Underground Gems</td>
									<td class="px-4 py-3">Music Blogger</td>
									<td class="px-4 py-3">12.8K</td>
									<td class="px-4 py-3">856</td>
								</tr>
								<tr class="border-b">
									<td class="px-4 py-3 font-medium">Chill Vibes</td>
									<td class="px-4 py-3">User123</td>
									<td class="px-4 py-3">8.5K</td>
									<td class="px-4 py-3">642</td>
								</tr>
								<tr class="border-b">
									<td class="px-4 py-3 font-medium">Weekend Mix</td>
									<td class="px-4 py-3">Platform Editorial</td>
									<td class="px-4 py-3">32.1K</td>
									<td class="px-4 py-3">412</td>
								</tr>
								<tr>
									<td class="px-4 py-3 font-medium">Fresh Finds</td>
									<td class="px-4 py-3">Platform Algorithm</td>
									<td class="px-4 py-3">78.6K</td>
									<td class="px-4 py-3">326</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
				<CardFooter>
					<Button variant="outline" class="w-full">View All Playlists</Button>
				</CardFooter>
			</Card>
		</TabsContent>
	</Tabs>
</div>
