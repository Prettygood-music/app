<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import { SearchBar, CompactSearchBar, EnhancedSearchBar } from '$lib/components/search';
</script>

<Meta
  title="Components/Search"
  component={SearchBar}
  argTypes={{
    initialValue: { control: 'text' },
    placeholder: { control: 'text' },
    buttonText: { control: 'text' },
    showButton: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg']
    }
  }}
/>

<Template let:args>
  <div class="p-4 max-w-3xl mx-auto space-y-8">
    <h2 class="text-xl font-semibold mb-2">Basic Search Bar</h2>
    <SearchBar {...args} />
    
    <h2 class="text-xl font-semibold mb-2 pt-6">Compact Search Bar</h2>
    <CompactSearchBar initialValue={args.initialValue} placeholder={args.placeholder} />
    
    <h2 class="text-xl font-semibold mb-2 pt-6">Enhanced Search Bar with Suggestions</h2>
    <EnhancedSearchBar 
      initialValue={args.initialValue} 
      placeholder={args.placeholder}
      buttonText={args.buttonText}
      showButton={args.showButton}
      fullWidth={args.fullWidth}
      size={args.size}
    />
    
    <div class="mt-8 pt-8 border-t">
      <h3 class="text-lg font-medium mb-4">Different Sizes</h3>
      <div class="space-y-4">
        <SearchBar size="sm" placeholder="Small search bar" />
        <SearchBar size="default" placeholder="Default search bar" />
        <SearchBar size="lg" placeholder="Large search bar" />
      </div>
    </div>
  </div>
</Template>

<Story
  name="Default"
  args={{
    initialValue: '',
    placeholder: 'Search for something...',
    buttonText: 'Search',
    showButton: true,
    fullWidth: true,
    size: 'default'
  }}
/>

<Story
  name="With Initial Value"
  args={{
    initialValue: 'rock music',
    placeholder: 'Search for something...',
    buttonText: 'Search',
    showButton: true,
    fullWidth: true,
    size: 'default'
  }}
/>

<Story
  name="Without Button"
  args={{
    initialValue: '',
    placeholder: 'Search for something...',
    buttonText: 'Search',
    showButton: false,
    fullWidth: true,
    size: 'default'
  }}
/>
