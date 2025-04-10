<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ArtistDashboardTemplate from './ArtistDashboardTemplate.svelte';
	import { action } from '@storybook/addon-actions';

	// Mock data for our stories
	const mockArtistData = {
		artistName: 'Electronic Dreams',
		stats: {
			day: {
				totalPlays: 1235,
				playsTrend: '+8.2%',
				followers: 245,
				followersTrend: '+2.1%',
				totalEarnings: 87.50,
				earningsTrend: '+11.4%',
				recentTips: 3,
				tipsTrend: '+50.0%'
			},
			week: {
				totalPlays: 8642,
				playsTrend: '+12.3%',
				followers: 312,
				followersTrend: '+5.8%',
				totalEarnings: 435.25,
				earningsTrend: '+18.7%',
				recentTips: 12,
				tipsTrend: '+33.3%'
			},
			month: {
				totalPlays: 32568,
				playsTrend: '+15.7%',
				followers: 876,
				followersTrend: '+7.9%',
				totalEarnings: 1845.75,
				earningsTrend: '+21.3%',
				recentTips: 45,
				tipsTrend: '+28.6%'
			},
			year: {
				totalPlays: 248950,
				playsTrend: '+103.4%',
				followers: 3245,
				followersTrend: '+75.2%',
				totalEarnings: 12678.50,
				earningsTrend: '+132.8%',
				recentTips: 187,
				tipsTrend: '+94.7%'
			}
		},
		recentActivity: [
			{ type: 'play', content: 'Someone played "Midnight Symphony"', time: '2 minutes ago' },
			{ type: 'follow', content: 'New follower: SoundExplorer', time: '15 minutes ago' },
			{ type: 'tip', content: 'Received a 10 SUI tip from MusicLover42', time: '1 hour ago' },
			{ type: 'play', content: 'Someone played "Electric Dreams"', time: '2 hours ago' },
			{ type: 'follow', content: 'New follower: RhythmHunter', time: '3 hours ago' },
			{ type: 'play', content: 'Someone played "Ambient Waves"', time: '4 hours ago' }
		],
		onViewAllActivity: action('View All Activity clicked'),
		onUploadTrack: action('Upload Track clicked'),
		onEditProfile: action('Edit Profile clicked'),
		onCreateAnnouncement: action('Create Announcement clicked'),
		onGetHelp: action('Get Help clicked')
	};

	// A more minimalist version with fewer recent activities
	const minimalistData = {
		...mockArtistData,
		artistName: 'Minimal Artist',
		recentActivity: mockArtistData.recentActivity.slice(0, 3)
	};

	// A new artist with less impressive stats
	const newArtistData = {
		artistName: 'New Artist',
		stats: {
			day: {
				totalPlays: 42,
				playsTrend: '+100%',
				followers: 12,
				followersTrend: '+20%',
				totalEarnings: 5.00,
				earningsTrend: '+150%',
				recentTips: 1,
				tipsTrend: 'N/A'
			},
			week: {
				totalPlays: 156,
				playsTrend: '+120%',
				followers: 24,
				followersTrend: '+33%',
				totalEarnings: 18.75,
				earningsTrend: '+200%',
				recentTips: 2,
				tipsTrend: '+100%'
			},
			month: {
				totalPlays: 320,
				playsTrend: 'N/A',
				followers: 35,
				followersTrend: 'N/A',
				totalEarnings: 42.50,
				earningsTrend: 'N/A',
				recentTips: 3,
				tipsTrend: 'N/A'
			},
			year: {
				totalPlays: 320,
				playsTrend: 'N/A',
				followers: 35,
				followersTrend: 'N/A',
				totalEarnings: 42.50,
				earningsTrend: 'N/A',
				recentTips: 3,
				tipsTrend: 'N/A'
			}
		},
		recentActivity: [
			{ type: 'follow', content: 'New follower: FirstFan', time: '10 minutes ago' },
			{ type: 'play', content: 'Someone played "My First Track"', time: '30 minutes ago' },
			{ type: 'tip', content: 'Received a 5 SUI tip from SupportiveListener', time: '1 day ago' }
		],
		onViewAllActivity: action('View All Activity clicked'),
		onUploadTrack: action('Upload Track clicked'),
		onEditProfile: action('Edit Profile clicked'),
		onCreateAnnouncement: action('Create Announcement clicked'),
		onGetHelp: action('Get Help clicked')
	};

	// A super successful artist with impressive stats
	const successfulArtistData = {
		artistName: 'Platinum Records',
		stats: {
			day: {
				totalPlays: 45689,
				playsTrend: '+3.2%',
				followers: 3245,
				followersTrend: '+1.1%',
				totalEarnings: 1587.25,
				earningsTrend: '+2.4%',
				recentTips: 67,
				tipsTrend: '+5.0%'
			},
			week: {
				totalPlays: 287435,
				playsTrend: '+5.3%',
				followers: 15876,
				followersTrend: '+2.8%',
				totalEarnings: 8932.50,
				earningsTrend: '+7.7%',
				recentTips: 345,
				tipsTrend: '+8.3%'
			},
			month: {
				totalPlays: 1245689,
				playsTrend: '+8.7%',
				followers: 48765,
				followersTrend: '+4.9%',
				totalEarnings: 35876.25,
				earningsTrend: '+10.3%',
				recentTips: 1234,
				tipsTrend: '+12.6%'
			},
			year: {
				totalPlays: 15384756,
				playsTrend: '+22.4%',
				followers: 387654,
				followersTrend: '+35.2%',
				totalEarnings: 387654.50,
				earningsTrend: '+42.8%',
				recentTips: 13456,
				tipsTrend: '+45.7%'
			}
		},
		recentActivity: [
			{ type: 'play', content: 'Someone played "Mega Hit"', time: '1 minute ago' },
			{ type: 'play', content: 'Someone played "Chart Topper"', time: '1 minute ago' },
			{ type: 'follow', content: 'New follower: FamousFan123', time: '2 minutes ago' },
			{ type: 'tip', content: 'Received a 100 SUI tip from BigSupporter', time: '5 minutes ago' },
			{ type: 'play', content: 'Someone played "Platinum Single"', time: '5 minutes ago' },
			{ type: 'follow', content: 'New follower: Industry_Pro', time: '10 minutes ago' }
		],
		onViewAllActivity: action('View All Activity clicked'),
		onUploadTrack: action('Upload Track clicked'),
		onEditProfile: action('Edit Profile clicked'),
		onCreateAnnouncement: action('Create Announcement clicked'),
		onGetHelp: action('Get Help clicked')
	};

	const { Story } = defineMeta({
		title: 'Templates/ArtistDashboardTemplate',
		component: ArtistDashboardTemplate,
		tags: ['autodocs'],
		argTypes: {
			artistName: { control: 'text' },
			stats: { control: 'object' },
			recentActivity: { control: 'object' },
			onViewAllActivity: { action: 'onViewAllActivity' },
			onUploadTrack: { action: 'onUploadTrack' },
			onEditProfile: { action: 'onEditProfile' },
			onCreateAnnouncement: { action: 'onCreateAnnouncement' },
			onGetHelp: { action: 'onGetHelp' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		...mockArtistData
	}}
/>

<Story
	name="Minimalist"
	args={{
		...minimalistData
	}}
/>

<Story
	name="New Artist"
	args={{
		...newArtistData
	}}
/>

<Story
	name="Successful Artist"
	args={{
		...successfulArtistData
	}}
/>
