<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { clickOutside } from './clickOutside'; // Create a custom action for click outside
	
	// Define share option type
	interface ShareOption {
	  id: string;
	  label: string;
	  icon: string; // SVG path data
	  color?: string;
	}
	
	// Props
	export let shareUrl: string = '';
	export let title: string = '';
	export let entityId: string;
	export let entityType: 'track' | 'album' | 'playlist' | 'artist' | 'user' = 'track';
	export let options: ShareOption[] = [
	  {
		id: 'twitter',
		label: 'Twitter',
		icon: 'M22 5.16c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 3.5 17.26 3 16 3c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z',
		color: '#1DA1F2'
	  },
	  {
		id: 'facebook',
		label: 'Facebook',
		icon: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z',
		color: '#3b5998'
	  },
	  {
		id: 'copy-link',
		label: 'Copy Link',
		icon: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'
	  }
	];
	export let dropdownPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	export let buttonSize: 'small' | 'medium' | 'large' = 'medium';
	export let includeEmbedCode: boolean = false;
	
	// Runes
	let $isOpen = false;
	let $isCopied = false;
	let $copyTimeout: ReturnType<typeof setTimeout> | null = null;
	
	// Event dispatcher
	const dispatch = createEventDispatcher<{
	  share: { platform: string, url: string, title: string, entityId: string, entityType: string };
	  copy: { url: string };
	}>();
	
	// Size mappings
	const sizeMap = {
	  small: {
		button: '1.75rem',
		icon: '0.875rem'
	  },
	  medium: {
		button: '2.25rem',
		icon: '1.125rem'
	  },
	  large: {
		button: '2.75rem',
		icon: '1.375rem'
	  }
	};
	
	// Toggle dropdown
	function toggleDropdown() {
	  $isOpen = !$isOpen;
	}
	
	// Close dropdown
	function closeDropdown() {
	  $isOpen = false;
	}
	
	// Handle share option click
	function handleShareClick(option: ShareOption) {
	  let shareLink = '';
	  
	  switch (option.id) {
		case 'twitter':
		  shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
		  window.open(shareLink, '_blank');
		  break;
		case 'facebook':
		  shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
		  window.open(shareLink, '_blank');
		  break;
		case 'copy-link':
		  copyToClipboard();
		  break;
		default:
		  // For custom share options
		  break;
	  }
	  
	  dispatch('share', {
		platform: option.id,
		url: shareUrl,
		title,
		entityId,
		entityType
	  });
	  
	  closeDropdown();
	}
	
	// Copy URL to clipboard
	async function copyToClipboard() {
	  try {
		await navigator.clipboard.writeText(shareUrl);
		$isCopied = true;
		dispatch('copy', { url: shareUrl });
		
		// Reset copied state after 2 seconds
		if ($copyTimeout) clearTimeout($copyTimeout);
		$copyTimeout = setTimeout(() => {
		  $isCopied = false;
		}, 2000);
	  } catch (error) {
		console.error('Failed to copy URL:', error);
	  }
	}
	
	// Get embed code for the entity
	function getEmbedCode(): string {
	  const baseUrl = 'https://prettygood.music';
	  return `<iframe src="${baseUrl}/embed/${entityType}/${entityId}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
	}
	
	// Cleanup timeout on component destruction
	onMount(() => {
	  return () => {
		if ($copyTimeout) clearTimeout($copyTimeout);
	  };
	});
  </script>
  
  <div 
	class="share-group {buttonSize}"
	use:clickOutside={{ callback: closeDropdown }}
	style="--button-size: {sizeMap[buttonSize].button}; --icon-size: {sizeMap[buttonSize].icon};"
  >
	<button 
	  class="share-button" 
	  class:active={$isOpen}
	  onclick={toggleDropdown}
	  aria-label="Share"
	  aria-expanded={$isOpen}
	>
	  <svg class="share-icon" viewBox="0 0 24 24">
		<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
	  </svg>
	</button>
	
	{#if $isOpen}
	  <div class="share-dropdown {dropdownPosition}">
		<div class="dropdown-header">
		  Share
		  <button class="close-button" onclick={closeDropdown}>
			<svg viewBox="0 0 24 24" width="16" height="16">
			  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
			</svg>
		  </button>
		</div>
		
		<div class="share-options">
		  {#each options as option}
			<button 
			  class="share-option"
			  class:copied={option.id === 'copy-link' && $isCopied}
			  style={option.color ? `--option-color: ${option.color}` : ''}
			  onclick={() => handleShareClick(option)}
			>
			  <svg class="option-icon" viewBox="0 0 24 24">
				<path d={option.icon} />
			  </svg>
			  <span>{option.id === 'copy-link' && $isCopied ? 'Copied!' : option.label}</span>
			</button>
		  {/each}
		</div>
		
		{#if includeEmbedCode}
		  <div class="embed-section">
			<div class="embed-header">Embed</div>
			<div class="embed-code">
			  <code>{getEmbedCode()}</code>
			  <button class="copy-embed" onclick={() => navigator.clipboard.writeText(getEmbedCode())}>
				<svg viewBox="0 0 24 24" width="16" height="16">
				  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
				</svg>
			  </button>
			</div>
		  </div>
		{/if}
	  </div>
	{/if}
  </div>
  
  <style>
	.share-group {
	  position: relative;
	  display: inline-block;
	}
	
	.share-button {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: var(--button-size);
	  height: var(--button-size);
	  border-radius: 50%;
	  background: none;
	  border: none;
	  color: var(--muted-foreground);
	  cursor: pointer;
	  transition: all 0.2s ease;
	}
	
	.share-button:hover, .share-button.active {
	  background-color: var(--secondary);
	  color: var(--foreground);
	}
	
	.share-icon {
	  width: var(--icon-size);
	  height: var(--icon-size);
	  fill: currentColor;
	}
	
	.share-dropdown {
	  position: absolute;
	  z-index: 10;
	  min-width: 200px;
	  background-color: var(--card);
	  border-radius: var(--radius);
	  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	  padding: 0.5rem;
	  border: 1px solid var(--border);
	}
	
	.share-dropdown.top {
	  bottom: calc(var(--button-size) + 0.5rem);
	  left: 50%;
	  transform: translateX(-50%);
	}
	
	.share-dropdown.bottom {
	  top: calc(var(--button-size) + 0.5rem);
	  left: 50%;
	  transform: translateX(-50%);
	}
	
	.share-dropdown.left {
	  right: calc(var(--button-size) + 0.5rem);
	  top: 50%;
	  transform: translateY(-50%);
	}
	
	.share-dropdown.right {
	  left: calc(var(--button-size) + 0.5rem);
	  top: 50%;
	  transform: translateY(-50%);
	}
	
	.dropdown-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 0.5rem;
	  font-weight: 500;
	  border-bottom: 1px solid var(--border);
	  margin-bottom: 0.5rem;
	}
	
	.close-button {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  background: none;
	  border: none;
	  color: var(--muted-foreground);
	  cursor: pointer;
	  padding: 0.25rem;
	  border-radius: 50%;
	}
	
	.close-button:hover {
	  background-color: var(--secondary);
	  color: var(--foreground);
	}
	
	.close-button svg {
	  fill: currentColor;
	}
	
	.share-options {
	  display: flex;
	  flex-direction: column;
	  gap: 0.25rem;
	}
	
	.share-option {
	  display: flex;
	  align-items: center;
	  gap: 0.75rem;
	  padding: 0.5rem;
	  border-radius: var(--radius);
	  background: none;
	  border: none;
	  cursor: pointer;
	  transition: background-color 0.2s ease;
	  color: var(--foreground);
	  text-align: left;
	}
	
	.share-option:hover {
	  background-color: var(--secondary);
	}
	
	.option-icon {
	  width: 1.25rem;
	  height: 1.25rem;
	  fill: var(--option-color, currentColor);
	}
	
	.copied {
	  background-color: var(--primary);
	  color: var(--primary-foreground);
	}
	
	.copied:hover {
	  background-color: var(--primary);
	}
	
	.embed-section {
	  margin-top: 0.5rem;
	  padding-top: 0.5rem;
	  border-top: 1px solid var(--border);
	}
	
	.embed-header {
	  font-weight: 500;
	  font-size: 0.875rem;
	  margin-bottom: 0.5rem;
	  padding: 0 0.5rem;
	}
	
	.embed-code {
	  position: relative;
	  background-color: var(--secondary);
	  border-radius: var(--radius);
	  padding: 0.5rem;
	  font-family: var(--font-mono, monospace);
	  font-size: 0.75rem;
	  color: var(--muted-foreground);
	  max-height: 60px;
	  overflow-y: auto;
	}
	
	.copy-embed {
	  position: absolute;
	  top: 0.25rem;
	  right: 0.25rem;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  background-color: var(--card);
	  border: none;
	  border-radius: var(--radius);
	  padding: 0.25rem;
	  color: var(--muted-foreground);
	  cursor: pointer;
	}
	
	.copy-embed:hover {
	  color: var(--foreground);
	}
	
	.copy-embed svg {
	  fill: currentColor;
	}
  </style>
  
  <script context="module">
	// Custom action for handling clicks outside an element
	export function clickOutside(node: HTMLElement, { callback }: { callback: () => void }) {
	  function handleClick(event: MouseEvent) {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
		  callback();
		}
	  }
	  
	  document.addEventListener('click', handleClick, true);
	  
	  return {
		destroy() {
		  document.removeEventListener('click', handleClick, true);
		}
	  };
	}
  </script>