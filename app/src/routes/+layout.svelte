<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	import { browser } from '$app/environment';
	import MobilePlayerBar from '$lib/components/app/organisms/player-bar/mobile-player-bar.svelte';
	import PlayerBar from '$lib/components/app/organisms/player-bar/player-bar.svelte';
	import ConnectionStatus from '$lib/components/app/molecules/connection-status/connection-status.svelte';
	import { PlayerState, setPlayerContext } from '$lib/state/player.svelte';
	import Navbar from '$lib/components/organisms/navigation/Navbar.svelte';

	import { invalidate, onNavigate } from '$app/navigation';
	import Seo from '$lib/components/app/organisms/player-bar/seo.svelte';
	import { setUserContext, UserState } from '$lib/state/user/user.svelte';
	import { setAnalyticsContext } from '$lib/services';
	import { onMount } from 'svelte';
	import { DEPENDS } from '$lib/constants';

	import SkSeo from 'sk-seo';
	import { page } from '$app/state';
	import { setWalletManager } from '$lib/components/app/organisms/wallet-manager/WalletManager.context.svelte';

	let { children, data } = $props();
	let { session, supabase } = $derived(data);

	const userState = new UserState(data.user, data.supabase);
	$effect(() => {
		userState.user = data.user;
	});
	setUserContext(userState);

	const playerState = new PlayerState();
	setPlayerContext(playerState);

	if(browser){

		setWalletManager();
	}

	const analytics = setAnalyticsContext(data.user?.id || null, data.supabase);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate(DEPENDS.AUTH);
			}

			userState.user = newSession?.user || null;
		});
		return () => data.subscription.unsubscribe();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect(() => {
		analytics.changeUserId(data.user?.id || null);
	});

	async function onDisconnect() {
		await supabase.auth.signOut();
	}
</script>

<SkSeo
	openGraph={true}
	title="Pretty Good Music"
	imageURL={page.url.origin + '/api/og'}
	description="Pretty Good music, for everyone."
></SkSeo>
<Seo></Seo>
<ParaglideJS {i18n}>
	<Toaster />

	<div class="bg-background flex h-screen w-screen flex-col overflow-hidden" id="content">
		<Navbar {onDisconnect} />
		<main class="flex flex-1 flex-col overflow-y-hidden [&>*]:mb-12">
			{@render children()}
		</main>
		<div class="shrink-0">
			<PlayerBar></PlayerBar>
		</div>
	</div>

	{#if browser}
		<ConnectionStatus />
	{/if}
</ParaglideJS>

<style global>
</style>
