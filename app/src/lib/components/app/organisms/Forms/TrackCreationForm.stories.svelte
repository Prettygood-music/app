<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TrackCreationForm from './TrackCreationForm.svelte';

  export const { Story } = defineMeta({
    title: 'App/Organisms/Forms/TrackCreationForm',
    component: TrackCreationForm,
    tags: ['autodocs'],
    argTypes: {
      onSubmit: { action: 'submitted' },
      initialValues: { control: 'object' },
      albums: { control: 'object' }
    }
  });

  // Mock albums for the stories
  const mockAlbums = [
    { id: 'album-1', title: 'My First Album' },
    { id: 'album-2', title: 'Second Album' },
    { id: 'album-3', title: 'Greatest Hits' }
  ];
</script>

<Story 
  name="Default"
  args={{
    onSubmit: async (data) => console.log('Form submitted:', data),
    albums: mockAlbums
  }}
/>

<Story 
  name="With Initial Values"
  args={{
    onSubmit: async (data) => console.log('Form submitted:', data),
    albums: mockAlbums,
    initialValues: {
      title: 'My Awesome Track',
      genre: ['Electronic', 'Pop'],
      explicit: true,
      release_date: '2025-05-01'
    }
  }}
/>
