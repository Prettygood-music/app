<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StatCard from '../StatCard.svelte';

	const { Story } = defineMeta({
		title: 'Molecules/StatCard/Basic',
		component: StatCard,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			value: { control: 'text' },
			trend: { control: 'text' }
		}
	});
</script>

<Story
	name="Streams"
	args={{
		title: 'Total Streams',
		value: '1,234',
		trend: '+12.3%'
	}}
/>

<Story
	name="Revenue"
	args={{
		title: 'Revenue',
		value: '$432.10',
		trend: '+8.1%'
	}}
/>

<Story
	name="NegativeTrend"
	args={{
		title: 'New Followers',
		value: '89',
		trend: '-5.4%'
	}}
/>

<Story
	name="LargeNumbers"
	args={{
		title: 'Total Plays',
		value: '1,543,492',
		trend: '+24.5%'
	}}
/>

<Story
	name="Listeners"
	args={{
		title: 'Monthly Listeners',
		value: '5,280',
		trend: '+2.8%'
	}}
/>
