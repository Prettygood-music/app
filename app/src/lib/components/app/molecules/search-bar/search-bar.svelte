<script lang="ts">
    import { onMount } from 'svelte';
    
    // Props
    export let placeholder: string = "Search for artists, songs, or albums";
    export let onSearch: (query: string) => void;
    
    // Runes
    let $searchQuery = "";
    let $isFocused = false;
    
    // Handle search submission
    function handleSubmit() {
      if ($searchQuery.trim()) {
        onSearch($searchQuery);
      }
    }
    
    // Handle keydown events (submit on enter)
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }
  </script>
  
  <div class="search-bar" class:focused={$isFocused}>
    <input 
      type="text" 
      bind:value={$searchQuery} 
      {placeholder} 
      on:keydown={handleKeydown}
      on:focus={() => $isFocused = true}
      on:blur={() => $isFocused = false}
    />
    <button class="search-button" onclick={handleSubmit}>
      <svg class="search-icon" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </button>
  </div>
  
  <style>
    .search-bar {
      display: flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--secondary);
      transition: all 0.2s ease;
    }
    
    .search-bar.focused {
      border-color: var(--ring);
      box-shadow: 0 0 0 2px rgba(var(--ring) / 0.1);
    }
    
    input {
      flex: 1;
      border: none;
      padding: 0.75rem 1rem;
      background: transparent;
      font-size: 0.9rem;
      outline: none;
    }
    
    .search-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--muted-foreground);
      transition: color 0.2s ease;
    }
    
    .search-button:hover {
      color: var(--foreground);
    }
    
    .search-icon {
      width: 1.25rem;
      height: 1.25rem;
      fill: currentColor;
    }
  </style>