<script lang="ts">
	// Track interface
	export interface Track {
	  id: string;
	  title: string;
	  artist: string;
	  albumArt: string;
	  duration: number; // in seconds
	}
  
	// Props
	export let track: Track;
	export let index: number;
	export let isPlaying: boolean = false;
	export let isLiked: boolean = false;
	export let onPlay: (id: string) => void;
	export let onLike: (id: string, liked: boolean) => void;
	export let onOptions: (id: string) => void;
	
	// Runes
	let $isHovered = false;
  
	// Format duration to mm:ss
	function formatDuration(seconds: number): string {
	  const mins = Math.floor(seconds / 60);
	  const secs = seconds % 60;
	  return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
  </script>
  
  <div 
	class="track-item" 
	class:playing={isPlaying}
	class:hovered={$isHovered}
	on:mouseenter={() => $isHovered = true}
	on:mouseleave={() => $isHovered = false}
  >
	<div class="track-number">{index + 1}</div>
	<img class="track-image" src={track.albumArt} alt="Album Cover" />
	<div class="track-info">
	  <div class="track-title">{track.title}</div>
	  <div class="track-artist">{track.artist}</div>
	</div>
	<div class="track-duration">{formatDuration(track.duration)}</div>
	<div class="track-actions">
	  <button 
		class="like-button" 
		class:liked={isLiked} 
		onclick={() => onLike(track.id, !isLiked)}
	  >
		<svg class="heart-icon" viewBox="0 0 24 24">
		  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
		</svg>
	  </button>
	  <button class="more-button" onclick={() => onOptions(track.id)}>
		<svg class="more-icon" viewBox="0 0 24 24">
		  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
		</svg>
	  </button>
	</div>
  </div>
  
  <style>
	.track-item {
	  display: grid;
	  grid-template-columns: 2rem 3rem 1fr auto auto;
	  align-items: center;
	  padding: 0.5rem 1rem;
	  border-radius: var(--radius);
	  transition: background-color 0.2s ease;
	}
	
	.track-item.hovered {
	  background-color: var(--secondary);
	}
	
	.track-item.playing {
	  background-color: var(--accent);
	}
	
	.track-number {
	  color: var(--muted-foreground);
	  font-size: 0.875rem;
	}
	
	.track-image {
	  width: 2.5rem;
	  height: 2.5rem;
	  border-radius: calc(var(--radius) - 2px);
	  object-fit: cover;
	}
	
	.track-info {
	  margin-left: 0.75rem;
	  overflow: hidden;
	}
	
	.track-title {
	  font-weight: 500;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	.track-artist {
	  font-size: 0.875rem;
	  color: var(--muted-foreground);
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	.track-duration {
	  color: var(--muted-foreground);
	  font-size: 0.875rem;
	  margin-right: 1rem;
	}
	
	.track-actions {
	  display: flex;
	  gap: 0.5rem;
	}
	
	button {
	  background: none;
	  border: none;
	  cursor: pointer;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  color: var(--muted-foreground);
	  width: 2rem;
	  height: 2rem;
	  border-radius: 50%;
	  transition: all 0.2s ease;
	}
	
	button:hover {
	  background-color: var(--secondary);
	  color: var(--foreground);
	}
	
	.heart-icon, .more-icon {
	  width: 1.25rem;
	  height: 1.25rem;
	  fill: currentColor;
	}
	
	.liked {
	  color: var(--primary);
	}
  </style>