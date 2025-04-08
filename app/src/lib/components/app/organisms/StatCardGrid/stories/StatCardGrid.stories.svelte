<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StatCardGrid from '../StatCardGrid.svelte';
	import { createRawSnippet } from 'svelte';

	// Icons for the stories
	const playIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
	}));

	const dollarIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
	}));
	
	const userIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
	}));
	
	const heartIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
	}));
	
	const globeIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
	}));
	
	const clockIcon = createRawSnippet(() => ({
		render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
	}));

	// Default stats for the stories
	const threeStats = [
		{
			title: 'Total Streams',
			value: '12,543',
			trend: '+16.3%',
			icon: playIcon
		},
		{
			title: 'Revenue',
			value: '$785.25',
			trend: '+12.1%',
			icon: dollarIcon,
			subtitle: 'Earnings this month'
		},
		{
			title: 'New Followers',
			value: '457',
			trend: '+23.8%',
			icon: userIcon
		}
	];
	
	const fourStats = [
		...threeStats,
		{
			title: 'Avg. Listen Time',
			value: '2:45',
			trend: '+8.2%',
			icon: clockIcon,
			subtitle: 'Minutes per session'
		}
	];
	
	const sixStats = [
		...fourStats,
		{
			title: 'Total Favorites',
			value: '3,872',
			trend: '+11.9%',
			icon: heartIcon,
		},
		{
			title: 'Global Reach',
			value: '45',
			trend: '+4.7%',
			icon: globeIcon,
			subtitle: 'Countries with listeners'
		}
	];

	const { Story } = defineMeta({
		title: 'Organisms/StatCardGrid',
		component: StatCardGrid,
		tags: ['autodocs'],
		argTypes: {
			stats: { control: 'object' },
			columns: { control: { type: 'select', options: [1, 2, 3, 4] } }
		}
	});
</script>

<Story
	name="ThreeColumns"
	args={{
		stats: threeStats,
		columns: 3
	}}
/>

<Story
	name="TwoColumns"
	args={{
		stats: fourStats,
		columns: 2
	}}
/>

<Story
	name="FourColumns"
	args={{
		stats: fourStats,
		columns: 4
	}}
/>

<Story
	name="OneColumn"
	args={{
		stats: threeStats,
		columns: 1
	}}
/>

<Story
	name="SixCards"
	args={{
		stats: sixStats,
		columns: 3
	}}
/>

<Story
	name="MixedCardDetails"
	args={{
		stats: [
			{
				title: 'Total Streams',
				value: '12,543',
				trend: '+16.3%',
				icon: playIcon
			},
			{
				title: 'Revenue',
				value: '$785.25',
				trend: '+12.1%',
				icon: dollarIcon,
				subtitle: 'Earnings this month',
				showDetails: true
			},
			{
				title: 'Avg. Listen Time',
				value: '2:45',
				trend: '-3.8%',
				icon: clockIcon,
				subtitle: 'Minutes per session'
			}
		],
		columns: 3
	}}
/>
