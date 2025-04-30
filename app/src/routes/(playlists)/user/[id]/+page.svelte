<script lang="ts">
	import { TrackItem } from '$lib/components/music';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { LINKS } from '$lib/constants.js';
	import type { Track } from '$lib/types/player';
	import { generateGradient } from '$lib/utils.js';

	import BarChartIcon from 'lucide-svelte/icons/bar-chart-2';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import CoinsIcon from 'lucide-svelte/icons/coins';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ListMusicIcon from 'lucide-svelte/icons/list-music';
	import MusicIcon from 'lucide-svelte/icons/music';
	import ShareIcon from 'lucide-svelte/icons/share-2';
	import UserIcon from 'lucide-svelte/icons/user';
	import WalletIcon from 'lucide-svelte/icons/wallet';
	import Card from '../../playlist/[id]/card.svelte';

	// Page data from load function
	let { data } = $props();

	// Get data from the load function
	let user = $state(data.user);
	let isCurrentUser = $state(data.isCurrentUser);
	let playlists = $state(data.playlists);
	let likedTracks = $derived(data.likedTracks);
	let recentlyPlayed = $state(data.user.play_history.flatMap((item) => item.tracks));
	let followers = $state<number>(data.followers);
	let following = $state<number>(data.user.following[0].count);
	let joinDate = $state<string>(data.joinDate);
	let stats = $state(data.stats);

	// Using Svelte 5 runes for state management
	let selectedTab = $state('overview');
	let isFollowing = $state(false);

	// Format a date to a readable format (Month Year)
	function formatJoinDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long'
		}).format(date);
	}

	// Toggle following status
	function toggleFollow() {
		isFollowing = !isFollowing;
		console.log(`${isFollowing ? 'Following' : 'Unfollowed'} user: ${user.display_name}`);

		// In a real app, this would call an API to follow/unfollow the user
		if (isFollowing) {
			followers++;
		} else {
			followers--;
		}
	}

	// Share profile
	function shareProfile() {
		console.log(`Sharing profile: ${user.display_name}`);
		// In a real app, this would open a share dialog
	}

	// Tip user
	function tipUser() {
		console.log(`Tipping user: ${user.display_name}`);
		// In a real app, this would open the crypto wallet flow
	}

	// Truncate wallet address for display
	function truncateWalletAddress(address: string | null): string {
		if (!address) return '';
		return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
	}
</script>

<svelte:head>
	<title>{user.display_name} | prettygood.music</title>
	<meta name="description" content="Check out {user.display_name}'s profile on prettygood.music" />
</svelte:head>

<div class="pb-16">
	<!-- Profile Header with Cover/Background -->
	<div class="from-muted/70 to-background relative min-h-[200px] bg-gradient-to-b">
		<div class="container mx-auto px-4 py-8">
			<div class="flex flex-col items-center gap-6 md:flex-row md:items-end">
				<!-- User Avatar -->
				<Avatar class="border-background h-32 w-32 border-4">
					<AvatarImage src={user?.avatar_url || ''} alt={user.display_name} />
					<AvatarFallback>
						<div
							class="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
							style="background: {generateGradient(user.username)};"
						>
							{(user.display_name || user.username).substring(0, 1).toUpperCase()}
						</div>
					</AvatarFallback>
				</Avatar>

				<!-- User Info -->
				<div class="flex-1 text-center md:text-left">
					<h1 class="text-3xl font-bold">{user.display_name}</h1>
					<p class="text-muted-foreground">@{user.username}</p>

					<div class="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
						<div class="flex items-center gap-2">
							<Badge variant="outline" class="flex items-center gap-1">
								<UserIcon class="h-3 w-3" />
								<span>{following} following</span>
							</Badge>
						</div>

						<div class="flex items-center gap-2">
							<Badge variant="outline" class="flex items-center gap-1">
								<ListMusicIcon class="h-3 w-3" />
								<span>{playlists.length} playlists</span>
							</Badge>
						</div>

						{#if user.wallet_address}
							<div class="flex items-center gap-2">
								<Badge variant="outline" class="flex items-center gap-1">
									<WalletIcon class="h-3 w-3" />
									<span>{truncateWalletAddress(user.wallet_address)}</span>
								</Badge>
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons (only shown if not viewing own profile) -->
				{#if !isCurrentUser}
					<div class="flex gap-2">
						<Button variant={isFollowing ? 'secondary' : 'default'} onclick={toggleFollow}>
							{isFollowing ? 'Following' : 'Follow'}
						</Button>

						<Button variant="ghost" size="icon" onclick={shareProfile}>
							<ShareIcon class="h-5 w-5" />
						</Button>

						{#if user.wallet_address}
							<Button variant="outline" onclick={tipUser} class="gap-2">
								<CoinsIcon class="h-4 w-4" />
								Tip
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Main Content Tabs -->
	<div class="container mx-auto px-4 py-6">
		<Tabs value={selectedTab} onValueChange={(value) => (selectedTab = value)}>
			<TabsList class="mb-6 grid w-full grid-cols-4 gap-2 md:flex md:w-auto md:grid-cols-none">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="playlists">Playlists</TabsTrigger>
				<TabsTrigger value="liked">Liked Tracks</TabsTrigger>
				<TabsTrigger value="about">About</TabsTrigger>
			</TabsList>

			<!-- Overview Tab -->
			<TabsContent value="overview" class="space-y-8">
				<!-- Recently Played Section -->
				{#if recentlyPlayed.length > 0}
					<section>
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-bold">Recently Played</h2>
						</div>

						<div class="space-y-1">
							{#each data.latestTracks as track, i}
								<TrackItem {track} index={i} />
							{/each}
						</div>
					</section>
				{/if}

				<!-- Public Playlists -->
				{#if playlists.length > 0}
					<section>
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-bold">Public Playlists</h2>
							<!-- <Button variant="link" href="/user/{user.id}/playlists">See All</Button> -->
						</div>

						<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{#each playlists.slice(0, 5) as playlist}
								<Card {playlist} tracks={playlist.tracks} creator={user}></Card>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Liked Tracks Section -->
				{#if likedTracks.length > 0}
					<section class="">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-bold">Liked Tracks</h2>
							<!-- <Button variant="link" href="/user/{user.id}/liked">See All</Button> -->
						</div>

						<div class="space-y-1">
							{#each likedTracks.slice(0, 5) as track, i}
								<TrackItem {track} index={i} />
							{/each}
						</div>
					</section>
				{/if}
			</TabsContent>

			<!-- Playlists Tab -->
			<TabsContent value="playlists">
				<h2 class="mb-4 text-2xl font-bold">Playlists</h2>

				{#if playlists.length > 0}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each playlists as playlist}
							<Card {playlist} tracks={playlist.tracks} creator={user}></Card>
						{/each}
					</div>
				{:else}
					<div
						class="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
					>
						<ListMusicIcon class="text-muted-foreground mb-4 h-12 w-12" />
						<h3 class="mb-1 text-lg font-medium">No playlists yet</h3>
						<p class="text-muted-foreground text-sm">
							{isCurrentUser
								? 'Create your first playlist to get started!'
								: "This user hasn't created any playlists yet."}
						</p>
						{#if isCurrentUser}
							<Button variant="default" class="mt-4" href="/create-playlist">
								Create Playlist
							</Button>
						{/if}
					</div>
				{/if}
			</TabsContent>

			<!-- Liked Tracks Tab -->
			<TabsContent value="liked">
				<h2 class="mb-6 text-2xl font-bold">Liked Tracks</h2>

				{#if likedTracks.length > 0}
					<div class="space-y-1">
						{#each likedTracks as track, i}
							<TrackItem {track} index={i} />
						{/each}
					</div>
				{:else}
					<div
						class="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
					>
						<HeartIcon size={24} class="text-muted-foreground mb-4" />
						<h3 class="mb-1 text-lg font-medium">No liked tracks yet</h3>
						<p class="text-muted-foreground text-sm">
							{isCurrentUser
								? 'Like some tracks to see them here!'
								: "This user hasn't liked any tracks yet."}
						</p>
						{#if isCurrentUser}
							<Button variant="default" class="mt-4" href="/discover">Discover Music</Button>
						{/if}
					</div>
				{/if}
			</TabsContent>

			<!-- About Tab -->
			<TabsContent value="about">
				<div class="max-w-3xl space-y-8">
					<section>
						<h2 class="mb-4 text-2xl font-bold">About {user.display_name}</h2>

						<div class="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-12">
							<div>
								<h3 class="mb-4 text-lg font-semibold">Profile</h3>
								<dl class="space-y-3">
									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<UserIcon class="mr-2 h-4 w-4" />
											Username
										</dt>
										<dd class="flex-1">@{user.username}</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<CalendarIcon class="mr-2 h-4 w-4" />
											Joined
										</dt>
										<dd class="flex-1">{formatJoinDate(joinDate)}</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<UserIcon class="mr-2 h-4 w-4" />
											Followers
										</dt>
										<dd class="flex-1">{followers}</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<UserIcon class="mr-2 h-4 w-4" />
											Following
										</dt>
										<dd class="flex-1">{following}</dd>
									</div>
								</dl>
							</div>

							<div>
								<h3 class="mb-4 text-lg font-semibold">Music Stats</h3>
								<dl class="space-y-3">
									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<ListMusicIcon class="mr-2 h-4 w-4" />
											Playlists
										</dt>
										<dd class="flex-1">{playlists.length}</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<HeartIcon class="mr-2 h-4 w-4" />
											Liked Tracks
										</dt>
										<dd class="flex-1">{likedTracks.length}</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<BarChartIcon class="mr-2 h-4 w-4" />
											Listening Time
										</dt>
										<dd class="flex-1">{stats.listeningHours} hours</dd>
									</div>

									<div class="flex items-start">
										<dt class="text-muted-foreground flex w-40 items-center text-sm">
											<MusicIcon class="mr-2 h-4 w-4" />
											Top Genre
										</dt>
										<dd class="flex-1">{stats.topGenre}</dd>
									</div>
								</dl>
							</div>
						</div>
					</section>

					{#if user.wallet_address}
						<Separator />

						<section>
							<h3 class="mb-4 text-lg font-semibold">Wallet</h3>
							<div class="bg-muted/30 rounded-md p-4">
								<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div>
										<p class="text-muted-foreground text-sm">Wallet Address</p>
										<p class="font-mono text-sm">{user.wallet_address}</p>
									</div>

									{#if !isCurrentUser}
										<Button variant="outline" class="w-full gap-2 md:w-auto" onclick={tipUser}>
											<CoinsIcon class="h-4 w-4" />
											Tip {user.display_name}
										</Button>
									{/if}
								</div>
							</div>
						</section>
					{/if}

					<Separator />

					<section>
						<h3 class="mb-4 text-lg font-semibold">Activity</h3>
						<div class="space-y-3">
							{#if stats.recentActivity.length > 0}
								{#each stats.recentActivity as activity}
									<div class="bg-muted/30 rounded-md p-3">
										<div class="flex items-center gap-3">
											{#if activity.type === 'like'}
												<div
													class="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full"
												>
													<HeartIcon class="h-4 w-4" />
												</div>
											{:else if activity.type === 'play'}
												<div
													class="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full"
												>
													<MusicIcon class="h-4 w-4" />
												</div>
											{:else if activity.type === 'playlist'}
												<div
													class="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full"
												>
													<ListMusicIcon class="h-4 w-4" />
												</div>
											{/if}
											<div>
												<p class="text-sm">{activity.description}</p>
												<p class="text-muted-foreground text-xs">{activity.time}</p>
											</div>
										</div>
									</div>
								{/each}
							{:else}
								<p class="text-muted-foreground py-4 text-center">No recent activity</p>
							{/if}
						</div>
					</section>
				</div>
			</TabsContent>
		</Tabs>
	</div>
</div>
