<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EnhancedStatCard from '../EnhancedStatCard.svelte';
	import { createRawSnippet } from 'svelte';

	// Icons for the stories
	const playIcon = createRawSnippet(() => ({
		render: () =>
			`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
	}));

	const dollarIcon = createRawSnippet(() => {
		return {
			render: () =>
				`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
		};
	});

	const userIcon = createRawSnippet(() => ({
		render: () =>
			`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
	}));

	const heartIcon = createRawSnippet(() => ({
		render: () =>
			`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
	}));

	const globeIcon = createRawSnippet(() => ({
		render: () =>
			`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
	}));

	const { Story } = defineMeta({
		title: 'Molecules/StatCard/Enhanced',
		component: EnhancedStatCard,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			value: { control: 'text' },
			trend: { control: 'text' },
			icon: { control: 'boolean' },
			subtitle: { control: 'text' },
			showDetails: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Streams"
	args={{
		title: 'Total Streams',
		value: '1,234',
		trend: '+12.3%',
		icon: playIcon,
		showDetails: false
	}}
/>

<Story
	name="Revenue"
	args={{
		title: 'Revenue',
		value: '$432.10',
		trend: '+8.1%',
		icon: dollarIcon,
		subtitle: 'Earnings this month',
		showDetails: false
	}}
/>

<Story
	name="NegativeTrend"
	args={{
		title: 'New Followers',
		value: '89',
		trend: '-5.4%',
		icon: userIcon,
		showDetails: false
	}}
/>

<Story
	name="WithDetails"
	args={{
		title: 'Monthly Listeners',
		value: '5,280',
		trend: '+2.8%',
		icon: globeIcon,
		showDetails: true
	}}
/>

<Story
	name="NoIcon"
	args={{
		title: 'Total Likes',
		value: '2,456',
		trend: '+18.2%',
		subtitle: 'Your content is being appreciated',
		showDetails: false
	}}
/>

<Story
	name="CompleteExample"
	args={{
		title: 'Favorites',
		value: '872',
		trend: '+11.9%',
		icon: heartIcon,
		subtitle: 'Users who added your tracks to favorites',
		showDetails: true
	}}
/>
