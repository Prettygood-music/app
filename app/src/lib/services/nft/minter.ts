import { ADMIN_CAP_ID, MINTER_PRIVATE_KEY, SUPABASE_ADMIN_KEY } from '$env/static/private';
import { PUBLIC_PACKAGE_ID, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { Transaction } from '@mysten/sui/transactions';
import {} from '@mysten/sui/utils';
import { createClientV2 } from '@prettygood/database';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

class Minter {
	db: ReturnType<typeof createClientV2>;
	baseURL = 'https://prettygood.music';
	client: SuiClient;
	signer: Ed25519Keypair;

	constructor(supabase: ReturnType<typeof createClientV2>, privateKey: string) {
		this.db = supabase;
		this.client = new SuiClient({
			url: getFullnodeUrl('testnet')
		});
		this.signer = Ed25519Keypair.fromSecretKey(privateKey);
	}

	async mintAchievement(id: string, recipient: string) {
		const { data: achievementData } = await this.db
			.from('achievements')
			.select('*')
			.eq('id', id)
			.single();

		if (!achievementData) {
			throw `Achievement ${id} does not exist`;
		}

		const { data: userData, error: userError } = await this.db
			.from('users')
			.select('*')
			.eq('wallet_address', recipient)
			.single();

		if (!userData) {
			console.error(userError);
			throw "Couldn't find user data";
		}

		const txb = new Transaction();

		txb.moveCall({
			target: `${PUBLIC_PACKAGE_ID}::music_achievements::mint_achievement`,
			arguments: [
				txb.object(ADMIN_CAP_ID),
				txb.pure.address(recipient),
				txb.pure.string(achievementData.title),
				txb.pure.string(achievementData.description),
				txb.pure.string(`${this.baseURL}${achievementData.image}`),
				txb.pure.string(achievementData.category),
				txb.pure.string(achievementData.rarity)
			]
		});

		const result = await this.client.signAndExecuteTransaction({
			signer: this.signer,
			transaction: txb,
			options: {
				showEffects: true,
				showEvents: true
			}
		});

		let objectID: string | null = null;

		if (result.effects && result.effects.created && result.effects.created.length > 0) {
			for (const obj of result.effects.created) {
				if (typeof obj.owner !== 'string' && 'AddressOwner' in obj.owner) {
					if (obj.owner.AddressOwner === recipient) {
						objectID = obj.reference.objectId;
					}
				}
			}
		}

		if (!objectID) {
			throw `Couldn't find the object id for transaction ${result.digest}`;
		}

		await this.db.from('user_achievements').insert({
			user_id: userData.id,
			achievement_id: achievementData.id,
			blockchain_address: objectID
		});
	}
}

export const MINTER = new Minter(
	createClientV2(PUBLIC_SUPABASE_URL, SUPABASE_ADMIN_KEY),
	MINTER_PRIVATE_KEY
);
