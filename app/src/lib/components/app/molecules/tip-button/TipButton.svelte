<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { CoinsIcon } from 'lucide-svelte';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { MediaQuery } from 'svelte/reactivity';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');

	let { recipient }: { recipient: string } = $props();

	let Component = $derived.by(() => {
		return isDesktop.current ? Dialog : Drawer;
	});

	import { onMount } from 'svelte';
	import { getWalletManager } from '../../organisms/wallet-manager/WalletManager.context.svelte';
	import Sui from '$lib/assets/logos/sui.svelte';
	import { toast } from 'svelte-sonner';

	const walletManager = getWalletManager();

	onMount(() => {
		walletManager.currentWallet;
	});

	let amount = $state<number>(null!);
	async function sendTip() {
		const transfer = walletManager.transferSui(amount, recipient);

		toast.promise(transfer, {
			loading: 'Sending tip...',
			success: (data) => {
				return 'Thank you for tipping!';
			},
			error: "Error... Your tip couldn't be sent."
		});
		open = false;
	}
</script>

<Component.Root bind:open>
	<Component.Trigger class={buttonVariants({ variant: 'outline' })}>
		<CoinsIcon class="h-4 w-4" />
		Tip
	</Component.Trigger>

	<Component.Content class="md:max-w-[425px]">
		{#if walletManager.isConnected}
			{@const wallet = walletManager.currentWallet!}
			<Component.Header>
				<Component.Title>Tip User</Component.Title>
				<Component.Description>Tip this user for his content</Component.Description>
			</Component.Header>
			<form class="grid items-start gap-4" onsubmit={() => sendTip()}>
				<div class="grid gap-2">
					<Label for="amount">Amount (Sui)</Label>
					<div class="relative mt-1">
						<Input
							id="amount"
							class="pr-12"
							type="number"
							required
							max={walletManager.balance}
							min="0.01"
							bind:value={amount}
							step="0.01"
						/>
						<div
							class="bg-muted absolute inset-y-0 right-0 flex flex-col items-center justify-center rounded-r-md px-2.5"
						>
							<div></div>
							<Sui></Sui>
						</div>
					</div>
					<div class="text-right text-xs">
						{walletManager.balance.toFixed(2)} SUI available
					</div>
				</div>
				<Button type="submit" variant="outline">
					<img src={wallet.icon} alt={wallet.name} width="24" />
					Send tip</Button
				>
			</form>
		{:else}
			<Component.Header>
				<Component.Title>Connect Wallet</Component.Title>
				<Component.Description>Select a wallet to connect to.</Component.Description>
			</Component.Header>
			<div class="mt-6 flex items-center justify-center gap-4">
				{#each walletManager.wallets as [name, wallet]}
					<button
						class="hover:bg-muted group flex flex-col items-center rounded p-4 duration-300"
						onclick={() => walletManager.connectTo(name)}
					>
						<img src={wallet.icon} class="w-16" alt={name} />

						<div
							class="text-muted-foreground group-hover:text-foreground mt-2 break-before-all text-xs"
						>
							{name}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</Component.Content>
</Component.Root>
