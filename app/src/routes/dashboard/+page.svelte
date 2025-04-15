<script>
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let { data } = $props();

	const { user, artist } = data;
</script>

<div class="overflow-y-auto">
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col space-y-8">
			<div class="flex flex-col space-y-2">
				<h1 class="text-3xl font-bold">Welcome, {user.display_name || user.username}!</h1>
				<p class="text-muted-foreground">This is your dashboard.</p>
			</div>

			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Your Profile</CardTitle>
						<CardDescription>Manage your account details</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-muted-foreground text-sm">Username:</span>
								<span class="font-medium">{user.username}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground text-sm">Email:</span>
								<span class="font-medium"
									>{user.email}
									{#if !user.email_verified}
										<span class="ml-2 text-xs text-amber-600">(Unverified)</span>
									{/if}
								</span>
							</div>
							{#if user.wallet_address}
								<div class="flex justify-between">
									<span class="text-muted-foreground text-sm">Wallet:</span>
									<span class="max-w-[150px] truncate font-medium">{user.wallet_address}</span>
								</div>
							{/if}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" class="w-full">Edit Profile</Button>
					</CardFooter>
				</Card>

				<!-- Add more dashboard cards here -->
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Artist</CardTitle>
					<CardDescription>Manage Artist profile</CardDescription>
				</CardHeader>
				<CardContent>
					{#if artist}
						<div>
							Artist info:
							<pre>
						{JSON.stringify(artist, null, 2)}
					</pre>
						</div>
					{:else}
						<div>
							if user is artist, show info. Else we want to show a button to become artist, route to
							a form and let user create
						</div>

						<div>
							<form method="POST" action="?/registerArtist">
								<Button type="submit">Become Artist</Button>
							</form>
						</div>
					{/if}
				</CardContent>
			</Card>

			<div class="flex justify-end">
				<form action="/api/auth/logout" method="POST">
					<Button type="submit" variant="ghost">Sign Out</Button>
				</form>
			</div>
		</div>
	</div>
</div>
