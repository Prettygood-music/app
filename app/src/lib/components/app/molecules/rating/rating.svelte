<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	// Props
	export let value: number = 0;
	export let count: number | null = null;
	export let maxStars: number = 5;
	export let interactive: boolean = false;
	export let precision: 'full' | 'half' | 'quarter' = 'half';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let readonly: boolean = false;
	
	// Runes
	let $hoveredValue = 0;
	
	// Event dispatcher
	const dispatch = createEventDispatcher<{
	  change: { value: number, previousValue: number };
	  hover: { value: number };
	}>();
	
	// Size mapping
	const sizeMap = {
	  small: '0.75rem',
	  medium: '1rem',
	  large: '1.25rem'
	};
	
	// Helper to determine how to render a star at a specific position
	function getStarType(position: number): 'filled' | 'half-filled' | 'quarter-filled' | 'three-quarter-filled' | 'empty' {
	  // Use hovered value when hovering and interactive
	  const ratingValue = ($hoveredValue > 0 && interactive) ? $hoveredValue : value;
	  
	  const difference = ratingValue - position;
	  
	  if (difference >= 0) return 'filled';
	  if (precision === 'full') return 'empty';
	  
	  // For half-star precision
	  if (precision === 'half') {
		if (difference >= -0.5) return 'half-filled';
		return 'empty';
	  }
	  
	  // For quarter-star precision
	  if (difference >= -0.25) return 'three-quarter-filled';
	  if (difference >= -0.5) return 'half-filled';
	  if (difference >= -0.75) return 'quarter-filled';
	  return 'empty';
	}
	
	// Calculate the value when hovering at a specific position
	function getValueAtPosition(position: number, event: MouseEvent): number {
	  if (!interactive || readonly) return value;
	  
	  const target = event.currentTarget as HTMLElement;
	  const rect = target.getBoundingClientRect();
	  const width = rect.width;
	  const x = event.clientX - rect.left;
	  const starWidth = width / maxStars;
	  const starPosition = Math.floor(position);
	  const fraction = (x - (starPosition * starWidth)) / starWidth;
	  
	  if (precision === 'full') {
		return starPosition + 1;
	  } else if (precision === 'half') {
		return starPosition + (fraction > 0.5 ? 1 : 0.5);
	  } else {
		if (fraction < 0.25) return starPosition + 0.25;
		if (fraction < 0.5) return starPosition + 0.5;
		if (fraction < 0.75) return starPosition + 0.75;
		return starPosition + 1;
	  }
	}
	
	// Handle mouse hover
	function handleMouseMove(position: number, event: MouseEvent) {
	  if (!interactive || readonly) return;
	  
	  const newValue = getValueAtPosition(position, event);
	  $hoveredValue = newValue;
	  dispatch('hover', { value: newValue });
	}
	
	// Handle mouse leave
	function handleMouseLeave() {
	  $hoveredValue = 0;
	}
	
	// Handle click to set rating
	function handleClick(position: number, event: MouseEvent) {
	  if (!interactive || readonly) return;
	  
	  const previousValue = value;
	  const newValue = getValueAtPosition(position, event);
	  
	  // Toggle if clicking on the current value
	  if (Math.abs(newValue - value) < 0.1) {
		value = 0;
	  } else {
		value = newValue;
	  }
	  
	  dispatch('change', { value, previousValue });
	}
  </script>
  
  <div 
	class="rating {size}" 
	class:interactive
	class:readonly
	style="--star-size: {sizeMap[size]};"
	on:mouseleave={handleMouseLeave}
  >
	{#each Array(maxStars) as _, i}
	  <span 
		class="star {getStarType(i + 1)}" 
		on:mousemove={(e) => handleMouseMove(i, e)}
		on:click={(e) => handleClick(i, e)}
	  ></span>
	{/each}
	
	{#if count !== null}
	  <span class="rating-count">({count})</span>
	{/if}
  </div>
  
  <style>
	.rating {
	  display: inline-flex;
	  align-items: center;
	  gap: 0.125rem;
	}
	
	.rating.interactive {
	  cursor: pointer;
	}
	
	.rating.readonly {
	  pointer-events: none;
	}
	
	.star {
	  position: relative;
	  display: inline-block;
	  width: var(--star-size);
	  height: var(--star-size);
	  font-size: var(--star-size);
	  color: var(--muted);
	}
	
	.star::before,
	.star::after {
	  content: '★';
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  overflow: hidden;
	}
	
	.star::before {
	  color: var(--muted);
	}
	
	.star.filled::after {
	  color: var(--warning, #f59e0b);
	  width: 100%;
	}
	
	.star.three-quarter-filled::after {
	  color: var(--warning, #f59e0b);
	  width: 75%;
	}
	
	.star.half-filled::after {
	  color: var(--warning, #f59e0b);
	  width: 50%;
	}
	
	.star.quarter-filled::after {
	  color: var(--warning, #f59e0b);
	  width: 25%;
	}
	
	.star.empty::after {
	  width: 0;
	}
	
	.rating-count {
	  margin-left: 0.25rem;
	  font-size: 0.75em;
	  color: var(--muted-foreground);
	}
	
	.rating.small .star {
	  font-size: 0.75rem;
	}
	
	.rating.medium .star {
	  font-size: 1rem;
	}
	
	.rating.large .star {
	  font-size: 1.25rem;
	}
  </style>