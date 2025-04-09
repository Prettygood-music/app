<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Song interface
    export interface Song {
      id: string;
      title: string;
      artist: string;
      artistId: string;
      albumArt: string;
      duration?: number;
    }
    
    // Props
    export let song: Song;
    export let isPlaying: boolean = false;
    export let isSaved: boolean = false;
    export let showArtist: boolean = true;
    export let size: 'small' | 'medium' | 'large' = 'medium';
    export let playButtonLabel: string = 'Play';
    export let addButtonLabel: string = '+';
    
    // Runes
    let $isHovered = false;
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
      play: { id: string };
      save: { id: string, saved: boolean };
      click: { id: string };
      artistClick: { id: string };
    }>();
    
    // Size mappings
    const sizeMap = {
      small: {
        card: '160px',
        image: '120px',
        title: '0.875rem'
      },
      medium: {
        card: '200px',
        image: '160px',
        title: '1rem'
      },
      large: {
        card: '240px',
        image: '200px',
        title: '1.125rem'
      }
    };
    
    // Handle play button click
    function handlePlay(e: MouseEvent) {
      e.stopPropagation();
      dispatch('play', { id: song.id });
    }
    
    // Handle add/remove button click
    function handleSave(e: MouseEvent) {
      e.stopPropagation();
      dispatch('save', { id: song.id, saved: !isSaved });
    }
    
    // Handle card click
    function handleClick() {
      dispatch('click', { id: song.id });
    }
    
    // Handle artist click
    function handleArtistClick(e: MouseEvent) {
      e.stopPropagation();
      dispatch('artistClick', { id: song.artistId });
    }
  </script>
  
  <div 
    class="song-card {size}" 
    class:playing={isPlaying}
    class:hovered={$isHovered}
    style="--card-width: {sizeMap[size].card}; --image-size: {sizeMap[size].image}; --title-size: {sizeMap[size].title};"
    onclick={handleClick}
    on:mouseenter={() => $isHovered = true}
    on:mouseleave={() => $isHovered = false}
  >
    <div class="image-container">
      <img class="song-image" src={song.albumArt} alt="Cover for {song.title}" />
      
      <div class="overlay" class:visible={$isHovered || isPlaying}>
        <button 
          class="play-button" 
          class:playing={isPlaying}
          onclick={handlePlay}
        >
          {#if isPlaying}
            <svg viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          {:else}
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          {/if}
          <span>{isPlaying ? 'Pause' : playButtonLabel}</span>
        </button>
      </div>
    </div>
    
    <div class="song-details">
      <div class="song-title" title={song.title}>{song.title}</div>
      
      {#if showArtist}
        <button class="song-artist" onclick={handleArtistClick}>
          {song.artist}
        </button>
      {/if}
    </div>
    
    <div class="song-actions" class:visible={$isHovered}>
      <button 
        class="add-button" 
        class:saved={isSaved}
        onclick={handleSave}
        title={isSaved ? 'Remove from Library' : 'Add to Library'}
      >
        {#if isSaved}
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        {:else}
          {addButtonLabel}
        {/if}
      </button>
    </div>
  </div>
  
  <style>
    .song-card {
      position: relative;
      width: var(--card-width);
      border-radius: var(--radius);
      overflow: hidden;
      transition: transform 0.2s ease;
      cursor: pointer;
    }
    
    .song-card.hovered {
      transform: translateY(-4px);
    }
    
    .image-container {
      position: relative;
      width: var(--image-size);
      height: var(--image-size);
      margin: 0 auto;
      border-radius: calc(var(--radius) - 2px);
      overflow: hidden;
    }
    
    .song-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.3s ease;
    }
    
    .song-card.playing .song-image,
    .song-card.hovered .song-image {
      filter: brightness(0.7);
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: rgba(0, 0, 0, 0.3);
    }
    
    .overlay.visible {
      opacity: 1;
    }
    
    .play-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: var(--primary);
      color: var(--primary-foreground);
      border: none;
      border-radius: var(--radius);
      padding: 0.5rem 1rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .play-button:hover {
      background-color: color-mix(in srgb, var(--primary) 90%, black);
      transform: scale(1.05);
    }
    
    .play-button svg {
      width: 1.25rem;
      height: 1.25rem;
      fill: currentColor;
    }
    
    .play-button.playing {
      background-color: var(--foreground);
      color: var(--background);
    }
    
    .song-details {
      padding: 0.75rem 0.5rem;
      text-align: center;
    }
    
    .song-title {
      font-size: var(--title-size);
      font-weight: 500;
      margin-bottom: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .song-artist {
      font-size: 0.875rem;
      color: var(--muted-foreground);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .song-artist:hover {
      color: var(--primary);
      text-decoration: underline;
    }
    
    .song-actions {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .song-actions.visible {
      opacity: 1;
    }
    
    .add-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: var(--card);
      color: var(--foreground);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .add-button:hover {
      background-color: var(--secondary);
      transform: scale(1.1);
    }
    
    .add-button.saved {
      background-color: var(--primary);
      color: var(--primary-foreground);
    }
    
    .add-button.saved svg {
      width: 1.25rem;
      height: 1.25rem;
      fill: currentColor;
    }
    
    .song-card.small .song-actions {
      top: 0.25rem;
      right: 0.25rem;
    }
    
    .song-card.small .add-button {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 0.75rem;
    }
    
    .song-card.small .add-button.saved svg {
      width: 1rem;
      height: 1rem;
    }
  </style>