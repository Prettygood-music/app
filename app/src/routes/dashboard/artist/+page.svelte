<script lang="ts">
	import ArtistDashboardTemplate, {
		type StatData
	} from '$lib/components/app/templates/ArtistDashboardTemplate/ArtistDashboardTemplate.svelte';

	// This will come from the load function in +page.ts later
	let { data } = $props();

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

	let stats: StatData = {
		totalEarnings:
			data.artistData.payments.map((payment) => payment.amount).reduce((a, b) => a + b, 0) || 0,

		recentTips: data.artistData.tipCount.at(0)?.count || 0,
		totalPlays: data.artistData.artist_play_counts.at(0)?.play_count || 0,

		followers: data.artistData.followerCount.at(0)?.count || 0
	};
</script>

<ArtistDashboardTemplate
	artistName={data.artist.artist_name}
	{stats}
	onViewAllActivity={handleViewAllActivity}
	onUploadTrack={handleUploadTrack}
	onEditProfile={handleEditProfile}
	onCreateAnnouncement={handleCreateAnnouncement}
	onGetHelp={handleGetHelp}
/>
