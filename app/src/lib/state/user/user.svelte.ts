import type { User } from '$lib/types/user';
import { getContext, setContext } from 'svelte';

export class UserState {
	user = $state<User | null>(null);

	constructor(user: User | null) {
		this.user = user;
	}

	onAuthChange(user: User | null) {
		this.user = user;
	}
}

const USER_CONTEXT_KEY = Symbol('userContext');

export function setUserContext(user: UserState) {
	return setContext(USER_CONTEXT_KEY, user);
}

export function getUserContext() {
	return getContext<ReturnType<typeof setUserContext>>(USER_CONTEXT_KEY);
}
