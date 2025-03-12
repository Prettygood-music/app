<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SearchBar from '$lib/components/molecules/SearchBar.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/SearchBar',
    component: SearchBar,
    tags: ['autodocs'],
    argTypes: {
      placeholder: { control: 'text' },
      value: { control: 'text' },
      onSubmit: { action: 'submitted' }
    }
  });
</script>

<Story
  name="Default"
  args={{
    placeholder: 'Search...',
    value: ''
  }}
/>

<Story
  name="WithValue"
  args={{
    placeholder: 'Search...',
    value: 'Electronic music'
  }}
/>

<Story
  name="CustomPlaceholder"
  args={{
    placeholder: 'Search for artists, albums, or tracks...',
    value: ''
  }}
/>

<Story
  name="InDarkMode"
  args={{
    placeholder: 'Search...',
    value: ''
  }}
>
  <div class="dark p-4 rounded bg-background">
    <SearchBar 
      placeholder="Search in dark mode..." 
      value="" 
    />
  </div>
</Story>