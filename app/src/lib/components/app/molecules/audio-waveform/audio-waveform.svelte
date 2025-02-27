<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    
    // Props
    export let audioUrl: string | null = null;
    export let audioBlob: Blob | null = null;
    export let waveformData: number[] | null = null;
    export let currentTime: number = 0;
    export let duration: number = 0;
    export let barCount: number = 100;
    export let color: string = 'var(--primary)';
    export let backgroundColor: string = 'var(--secondary)';
    export let height: string = '64px';
    export let interactive: boolean = true;
    export let loading: boolean = false;
    export let showTimeline: boolean = true;
    
    // Runes
    let $waveform: number[] = [];
    let $isGenerating = false;
    let $isHovered = false;
    let $hoverPosition = 0;
    let $containerWidth = 0;
    let $containerElement: HTMLDivElement | null = null;
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
      seek: { time: number, percentage: number };
      generate: { waveform: number[] };
    }>();
    
    // Initialize waveform data
    onMount(async () => {
      if (waveformData) {
        $waveform = waveformData;
      } else if (audioUrl || audioBlob) {
        generateWaveform();
      } else {
        // Create a placeholder waveform
        $waveform = Array(barCount).fill(0).map(() => Math.random() * 100);
      }
    });
    
    // Generate waveform data from audio
    async function generateWaveform() {
      if (!audioUrl && !audioBlob) return;
      
      $isGenerating = true;
      
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const response = audioUrl ? await fetch(audioUrl) : audioBlob;
        const arrayBuffer = audioUrl ? await response.arrayBuffer() : await audioBlob!.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(rawData.length / barCount);
        const sampledData = [];
        
        for (let i = 0; i < barCount; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          
          sampledData.push((sum / blockSize) * 100);
        }
        
        // Normalize the data
        const multiplier = 100 / Math.max(...sampledData);
        $waveform = sampledData.map(val => Math.max(1, val * multiplier));
        
        dispatch('generate', { waveform: $waveform });
      } catch (error) {
        console.error('Error generating waveform:', error);
        // Fallback to random waveform
        $waveform = Array(barCount).fill(0).map(() => Math.random() * 100);
      }
      
      $isGenerating = false;
    }
    
    // Format time (seconds) to mm:ss
    function formatTime(seconds: number): string {
      if (isNaN(seconds)) return '0:00';
      
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Calculate current progress percentage
    function getProgressPercentage(): number {
      if (duration <= 0) return 0;
      return (currentTime / duration) * 100;
    }
    
    // Handle click on waveform to seek
    function handleWaveformClick(event: MouseEvent) {
      if (!interactive || !$containerElement) return;
      
      const rect = $containerElement.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const percentage = (clickPosition / rect.width) * 100;
      const seekTime = (percentage / 100) * duration;
      
      dispatch('seek', { time: seekTime, percentage });
    }
    
    // Handle mouse move for hover indicator
    function handleMouseMove(event: MouseEvent) {
      if (!interactive || !$containerElement) return;
      
      const rect = $containerElement.getBoundingClientRect();
      $hoverPosition = ((event.clientX - rect.left) / rect.width) * 100;
    }
  </script>
  
  <div 
    class="audio-waveform"
    class:loading={loading || $isGenerating}
    class:interactive
    style="--waveform-height: {height}; --waveform-color: {color}; --waveform-bg: {backgroundColor};"
    bind:clientWidth={$containerWidth}
  >
    <div 
      class="waveform-container"
      bind:this={$containerElement}
      on:click={handleWaveformClick}
      on:mousemove={handleMouseMove}
      on:mouseenter={() => $isHovered = true}
      on:mouseleave={() => $isHovered = false}
    >
      {#if loading || $isGenerating}
        <div class="loading-indicator">
          <div class="spinner"></div>
          <span>Generating waveform...</span>
        </div>
      {:else if $waveform.length > 0}
        {#each $waveform as amplitude, i}
          {@const progress = getProgressPercentage()}
          {@const isActive = (i / $waveform.length) * 100 <= progress}
          <div 
            class="waveform-bar" 
            class:active={isActive}
            class:current={progress >= (i / $waveform.length) * 100 && progress < ((i + 1) / $waveform.length) * 100}
            style="height: {amplitude}%"
          ></div>
        {/each}
        
        <div 
          class="progress-indicator"
          style="left: {getProgressPercentage()}%"
        ></div>
        
        {#if interactive && $isHovered}
          <div 
            class="hover-indicator"
            style="left: {$hoverPosition}%"
          ></div>
        {/if}
      {/if}
    </div>
    
    {#if showTimeline}
      <div class="waveform-time">
        <span class="current-time">{formatTime(currentTime)}</span>
        <span class="duration">{formatTime(duration)}</span>
      </div>
    {/if}
  </div>
  
  <style>
    .audio-waveform {
      width: 100%;
      position: relative;
    }
    
    .waveform-container {
      display: flex;
      align-items: center;
      height: var(--waveform-height, 64px);
      background-color: var(--waveform-bg, var(--secondary));
      border-radius: var(--radius);
      padding: 0 0.25rem;
      position: relative;
      overflow: hidden;
    }
    
    .waveform-bar {
      flex: 1;
      margin: 0 1px;
      background-color: var(--muted);
      min-height: 1px;
      transform-origin: bottom;
      transition: background-color 0.1s ease;
      position: relative;
      border-radius: 1px 1px 0 0;
      align-self: flex-end;
    }
    
    .waveform-bar.active {
      background-color: var(--waveform-color, var(--primary));
    }
    
    .waveform-bar.current {
      opacity: 0.8;
    }
    
    .progress-indicator {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: var(--foreground);
      z-index: 2;
      transform: translateX(-50%);
    }
    
    .hover-indicator {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 1;
      transform: translateX(-50%);
      pointer-events: none;
    }
    
    .waveform-time {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--muted-foreground);
      margin-top: 0.5rem;
    }
    
    .loading-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(var