<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let address: string;
  export let truncateLength: number = 4;
  export let showIcon: boolean = true;
  export let copyEnabled: boolean = true;
  export let label: string = '';
  
  // Runes
  let $isCopied = false;
  let $copyTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    copy: { address: string };
    click: { address: string };
  }>();
  
  // Truncate address to form 0x1234...5678
  function truncateAddress(addr: string): string {
    if (addr.length <= truncateLength * 2 + 2) return addr;
    
    const prefix = addr.slice(0, truncateLength + 2); // +2 for '0x'
    const suffix = addr.slice(-truncateLength);
    
    return `${prefix}...${suffix}`;
  }
  
  // Copy address to clipboard
  async function copyAddress() {
    if (!copyEnabled) return;
    
    try {
      await navigator.clipboard.writeText(address);
      $isCopied = true;
      dispatch('copy', { address });
      
      // Reset copied state after 2 seconds
      if ($copyTimeout) clearTimeout($copyTimeout);
      $copyTimeout = setTimeout(() => {
        $isCopied = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  }
  
  // Handle click on the address
  function handleClick() {
    dispatch('click', { address });
  }
</script>

<div class="wallet-address" onclick={handleClick}>
  {#if showIcon}
    <svg class="wallet-icon" viewBox="0 0 24 24">
      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  {/if}
  
  {#if label}
    <span class="address-label">{label}</span>
  {/if}
  
  <span class="address-text">{truncateAddress(address)}</span>
  
  {#if copyEnabled}
    <button class="copy-button" onclick|stopPropagation={copyAddress}>
      {#if $isCopied}
        <svg class="check-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      {:else}
        <svg class="copy-icon" viewBox="0 0 24 24">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      {/if}
    </button>
  {/if}
</div>

<style>
  .wallet-address {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--secondary);
    border-radius: var(--radius);
    font-family: var(--font-mono, monospace);
    font-size: 0.875rem;
    max-width: 100%;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .wallet-address:hover {
    background-color: color-mix(in srgb, var(--secondary) 95%, var(--foreground));
  }
  
  .wallet-icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    fill: var(--muted-foreground);
  }
  
  .address-label {
    color: var(--muted-foreground);
    font-weight: 500;
    font-family: var(--font-sans);
  }
  
  .address-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--foreground);
  }
  
  .copy-button {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: none;
    border: none;
    border-radius: 50%;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .copy-button:hover {
    background-color: color-mix(in srgb, var(--secondary) 80%, var(--foreground));
    color: var(--foreground);
  }
  
  .copy-icon, .check-icon {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }
  
  .check-icon {
    color: var(--primary);
  }
</style>