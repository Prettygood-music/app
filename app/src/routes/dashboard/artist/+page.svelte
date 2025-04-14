<script lang="ts">
	import ArtistDashboardTemplate from '$lib/components/app/templates/ArtistDashboardTemplate/ArtistDashboardTemplate.svelte';
	import { artistData, recentActivity } from './data';

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
</script>

<ArtistDashboardTemplate
	artistName={data.artist.artist_name}
	onViewAllActivity={handleViewAllActivity}
	onUploadTrack={handleUploadTrack}
	onEditProfile={handleEditProfile}
	onCreateAnnouncement={handleCreateAnnouncement}
	onGetHelp={handleGetHelp}
/>
