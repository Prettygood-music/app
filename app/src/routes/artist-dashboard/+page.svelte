<script lang="ts">
	import ArtistDashboardTemplate from '$lib/components/app/templates/ArtistDashboardTemplate/ArtistDashboardTemplate.svelte';

	// This will come from the load function in +page.ts later
	let artistData = $state({
		artistName: 'Your Artist Name',
		stats: {
			day: {
				totalPlays: 24689,
				playsTrend: '+12%',
				followers: 1243,
				followersTrend: '+5%',
				totalEarnings: 1289.45,
				earningsTrend: '+23%',
				recentTips: 7,
				tipsTrend: '+40%'
			},
			week: {
				totalPlays: 24689,
				playsTrend: '+12%',
				followers: 1243,
				followersTrend: '+5%',
				totalEarnings: 1289.45,
				earningsTrend: '+23%',
				recentTips: 7,
				tipsTrend: '+40%'
			},
			month: {
				totalPlays: 74067,
				playsTrend: '+15%',
				followers: 2486,
				followersTrend: '+8%',
				totalEarnings: 3868.35,
				earningsTrend: '+25%',
				recentTips: 28,
				tipsTrend: '+45%'
			},
			year: {
				totalPlays: 296268,
				playsTrend: '+120%',
				followers: 9944,
				followersTrend: '+85%',
				totalEarnings: 15473.40,
				earningsTrend: '+215%',
				recentTips: 105,
				tipsTrend: '+150%'
			}
		}
	});

	// Placeholder recent activity data
	let recentActivity = $state([
		{ type: 'play', content: 'Someone played "Your Track Title"', time: '5 minutes ago' },
		{ type: 'follow', content: 'New follower: User123', time: '20 minutes ago' },
		{ type: 'tip', content: 'Received a 5 SUI tip from User456', time: '2 hours ago' },
		{ type: 'play', content: 'Someone played "Another Track"', time: '3 hours ago' },
		{ type: 'play', content: 'Someone played "Your Track Title"', time: '5 hours ago' }
	]);
	
	// Event handlers
	function handleViewAllActivity() {
		// Navigate to full activity page
		console.log('View all activity clicked');
	}
	
	function handleUploadTrack() {
		// Navigate to track upload page
		console.log('Upload track clicked');
	}
	
	function handleEditProfile() {
		// Navigate to profile edit page
		console.log('Edit profile clicked');
	}
	
	function handleCreateAnnouncement() {
		// Navigate to announcement creation page
		console.log('Create announcement clicked');
	}
	
	function handleGetHelp() {
		// Open help dialog
		console.log('Get help clicked');
	}
</script>

<ArtistDashboardTemplate 
	artistName={artistData.artistName}
	stats={artistData.stats}
	recentActivity={recentActivity}
	onViewAllActivity={handleViewAllActivity}
	onUploadTrack={handleUploadTrack}
	onEditProfile={handleEditProfile}
	onCreateAnnouncement={handleCreateAnnouncement}
	onGetHelp={handleGetHelp}
/>
