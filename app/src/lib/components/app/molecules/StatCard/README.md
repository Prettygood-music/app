# Stat Card Components

This directory contains stat card components that are used to display statistical information with trend indicators.

## Components

### StatCard

A basic component for displaying statistical information with a trend indicator.

- **Props**:
  - `title`: The title of the statistic
  - `value`: The value to display
  - `trend`: The trend value (e.g., "+12.3%", "-5.4%")

### EnhancedStatCard

An enhanced version of the StatCard with additional features.

- **Props**:
  - `title`: The title of the statistic
  - `value`: The value to display
  - `trend`: The trend value (e.g., "+12.3%", "-5.4%")
  - `icon`: (Optional) An SVG icon to display next to the title
  - `subtitle`: (Optional) A subtitle text to display under the value
  - `showDetails`: (Optional) Whether to show detailed information

## Stories

Each component has colocated stories in the `stories` directory. The stories demonstrate various configurations and uses of the components.

## Usage Examples

### Basic StatCard

```svelte
<script>
  import StatCard from '$lib/components/app/molecules/StatCard/StatCard.svelte';
</script>

<StatCard 
  title="Total Streams" 
  value="1,234" 
  trend="+12.3%" 
/>
```

### Enhanced StatCard

```svelte
<script>
  import EnhancedStatCard from '$lib/components/app/molecules/StatCard/EnhancedStatCard.svelte';
  import { createRawSnippet } from 'svelte';
  
  const playIcon = createRawSnippet(() => ({
    render: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
  }));
</script>

<EnhancedStatCard 
  title="Total Streams" 
  value="1,234" 
  trend="+12.3%" 
  icon={playIcon}
  subtitle="Global streams"
  showDetails={true}
/>
```
