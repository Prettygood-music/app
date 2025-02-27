<script lang="ts">
	// Status type definition
	type UserStatus = 'online' | 'away' | 'busy' | 'offline';
	
	// Props
	export let image: string;
	export let name: string;
	export let role: string = '';
	export let status: UserStatus = 'offline';
	export let showInfo: boolean = true;
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let interactive: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	
	// Runes
	let $isHovered = false;
	
	// Status color mapping
	const statusColors = {
	  online: 'var(--success, #10b981)',
	  away: 'var(--warning, #f59e0b)',
	  busy: 'var(--destructive)',
	  offline: 'var(--muted-foreground)'
	};
  
	// Size mapping for avatar
	const sizeMap = {
	  small: {
		avatar: '2rem',
		status: '0.5rem',
		fontSize: '0.75rem'
	  },
	  medium: {
		avatar: '2.5rem',
		status: '0.625rem',
		fontSize: '0.875rem'
	  },
	  large: {
		avatar: '3.5rem',
		status: '0.75rem',
		fontSize: '1rem'
	  }
	};
  
	// Handle click events
	function handleClick() {
	  if (interactive && onClick) {
		onClick();
	  }
	}
  </script>
  
  <div 
	class="user-avatar {size}" 
	class:interactive
	class:hovered={$isHovered}
	style="--status-color: {statusColors[status]}"
	on:mouseenter={() => $isHovered = true}
	on:mouseleave={() => $isHovered = false}
	on:click={handleClick}
	on:keydown={(e) => { if (e.key === 'Enter' && interactive) handleClick(); }}
	tabindex={interactive ? 0 : undefined}
	role={interactive ? 'button' : undefined}
  >
	<div class="avatar-container">
	  <img src={image} alt={`${name}'s avatar`} />
	  <span class="user-status {status}"></span>
	</div>
	
	{#if showInfo}
	  <div class="user-info">
		<span class="user-name">{name}</span>
		{#if role}
		  <span class="user-role">{role}</span>
		{/if}
	  </div>
	{/if}
  </div>
  
  <style>
	.user-avatar {
	  display: flex;
	  align-items: center;
	  gap: 0.75rem;
	  position: relative;
	}
	
	.avatar-container {
	  position: relative;
	  flex-shrink: 0;
	}
	
	.user-avatar.small img {
	  width: 2rem;
	  height: 2rem;
	}
	
	.user-avatar.medium img {
	  width: 2.5rem;
	  height: 2.5rem;
	}
	
	.user-avatar.large img {
	  width: 3.5rem;
	  height: 3.5rem;
	}
	
	img {
	  border-radius: 50%;
	  object-fit: cover;
	}
	
	.user-status {
	  position: absolute;
	  bottom: 0;
	  right: 0;
	  border-radius: 50%;
	  background-color: var(--status-color);
	  border: 2px solid var(--background);
	}
	
	.user-avatar.small .user-status {
	  width: 0.5rem;
	  height: 0.5rem;
	}
	
	.user-avatar.medium .user-status {
	  width: 0.625rem;
	  height: 0.625rem;
	}
	
	.user-avatar.large .user-status {
	  width: 0.75rem;
	  height: 0.75rem;
	}
	
	.user-info {
	  display: flex;
	  flex-direction: column;
	  min-width: 0;
	}
	
	.user-avatar.small .user-info {
	  font-size: 0.75rem;
	}
	
	.user-avatar.medium .user-info {
	  font-size: 0.875rem;
	}
	
	.user-avatar.large .user-info {
	  font-size: 1rem;
	}
	
	.user-name {
	  font-weight: 500;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	.user-role {
	  font-size: 0.75em;
	  color: var(--muted-foreground);
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	.interactive {
	  cursor: pointer;
	  transition: transform 0.2s ease;
	}
	
	.interactive.hovered {
	  transform: translateY(-2px);
	}
	
	.interactive:focus-visible {
	  outline: 2px solid var(--ring);
	  outline-offset: 2px;
	  border-radius: var(--radius);
	}
  </style>