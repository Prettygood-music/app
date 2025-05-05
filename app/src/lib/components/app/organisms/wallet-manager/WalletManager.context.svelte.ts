import { getWallets, type Wallet, type WalletAccount } from '@mysten/wallet-standard';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const SUI_CLIENT = new SuiClient({ url: getFullnodeUrl('testnet') });

class WalletManager {
	#wallets: SvelteMap<string, Wallet> = $state(new SvelteMap());
	currentWallet = $state<Wallet | null>(null);

	account = $derived.by(() => {
		if (this.currentWallet) {
			return this.currentWallet.accounts.at(0) || null;
		} else {
			return null;
		}
	});

	balance: number = $state(0);
	isConnected = $derived(this.currentWallet !== null);

	get wallets() {
		return this.#wallets;
	}

	constructor() {
		const wallets = getWallets().get();
		wallets.forEach((w) => {
			if (!this.#wallets.has(w.name)) {
				this.#wallets.set(w.name, w);
			}
		});

        $effect(() => console.log(this.currentWallet?.accounts.map((a) => a.address)))

		$effect(() => {
			this.refreshBalance(this.account);
		});
	}

	async refreshBalance(account: WalletAccount | null) {
		if (account) {
			const suiBalance = await SUI_CLIENT.getBalance({
				owner: account.address
				// coinType is omitted or set to "0x2::sui::SUI" for native SUI
			});
			const nativeSuiBalance = suiBalance.totalBalance;
			this.balance = Number(nativeSuiBalance) / 1_000_000_000;
		} else {
			return 0;
		}
	}

	async connectTo(name: string) {
		const wallet = this.#wallets.get(name);
		if (!wallet) {
			throw `·Unexpected wallet ${name}`;
		}

		const features = wallet.features;
		if ('connect' in features['standard:connect']) {
			try {
				// @ts-expect-error Typescript being too obtuse here
				await features['standard:connect']!.connect();
				this.currentWallet = wallet;
			} catch (error) {
				this.currentWallet = null;
				console.error(error);
			} finally {
				//this.refreshBalance();
			}
		}
	}
	disconnect() {
		this.currentWallet.features['standard:disconnect'].disconnect();
		this.currentWallet = null;
	}

	async transferSui(amount: number, to: string) {
		if (!this.currentWallet) {
			throw 'No wallet connected';
		}
		const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
		const txb = new Transaction();
		const [coin] = txb.splitCoins(txb.gas, [amountInMist]);

		txb.transferObjects([coin], to);

		try {
			const { bytes, signature } = await this.currentWallet.features[
				'sui:signTransaction'
			].signTransaction({
				transaction: txb,
				account: this.account!,
				chain: 'sui:testnet'
			});

			const result = await SUI_CLIENT.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {}
			});

			console.dir(result);
		} catch (error) {
			console.error(error);
		} finally {
			this.refreshBalance();
		}
	}
}

const SYMBOL_KEY = 'prettygood:wallet';

export function setWalletManager(): WalletManager {
	return setContext(Symbol.for(SYMBOL_KEY), new WalletManager());
}

export function getWalletManager(): WalletManager {
	return getContext(Symbol.for(SYMBOL_KEY));
}
