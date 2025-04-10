<script lang="ts">
	import TokenInfo from '$lib/components/auth/TokenInfo.svelte';
	import { page } from '$app/stores';
</script>

<div class="overflow-y-auto">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-3xl font-bold">Account Profile</h1>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-12">
			<!-- Main profile section -->
			<div class="space-y-6 md:col-span-8">
				<div class="bg-card rounded-lg border p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Profile Information</h2>

					{#if $page.data.user}
						<div class="grid grid-cols-[120px_1fr] gap-y-2">
							<span class="font-medium">User ID:</span>
							<span class="font-mono text-sm">{$page.data.user.id}</span>

							<span class="font-medium">Username:</span>
							<span>{$page.data.user.username}</span>

							<span class="font-medium">Email:</span>
							<span>{$page.data.user.email}</span>

							<span class="font-medium">Role:</span>
							<span class="capitalize">{$page.data.user.role}</span>

							<span class="font-medium">Email Status:</span>
							<span class={$page.data.user.email_verified ? 'text-green-600' : 'text-orange-600'}>
								{$page.data.user.email_verified ? 'Verified' : 'Not Verified'}
							</span>

							{#if $page.data.user.wallet_address}
								<span class="font-medium">Wallet:</span>
								<span class="font-mono text-sm">{$page.data.user.wallet_address}</span>
							{/if}
						</div>

						<div class="mt-6 flex justify-end">
							<a
								href="/settings/account"
								class="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
							>
								Edit Profile
							</a>
						</div>
					{:else}
						<div class="bg-muted rounded-md p-4 text-center">
							<p>You are not logged in.</p>
						</div>
					{/if}
				</div>

				<!-- Authentication info for debugging -->
				<div class="bg-card rounded-lg border p-6 shadow-sm">
					<TokenInfo />
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6 md:col-span-4">
				<div class="bg-card rounded-lg border p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Account Security</h2>

					<ul class="space-y-3">
						<li>
							<a
								href="/settings/security/password"
								class="hover:bg-muted block rounded p-3 transition-colors"
							>
								Change Password
							</a>
						</li>
						<li>
							<a
								href="/settings/security/email"
								class="hover:bg-muted block rounded p-3 transition-colors"
							>
								Update Email
							</a>
						</li>
						{#if !$page.data.user?.wallet_address}
							<li>
								<a
									href="/settings/wallet"
									class="hover:bg-muted block rounded p-3 transition-colors"
								>
									Connect Wallet
								</a>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
