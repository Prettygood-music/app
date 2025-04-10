# Templates in Atomic Design

Templates are a crucial part of the Atomic Design methodology. They sit between Organisms and Pages in the hierarchy, serving as the bridge between components and fully realized pages.

## What are Templates?

Templates are page-level objects that place components into a layout and articulate the underlying content structure. They focus on the page's underlying content structure rather than the final content.

In our application, templates:

1. Define the layout structure for specific page types
2. Organize organisms, molecules, and atoms into a cohesive whole
3. Provide a blueprint that can be reused across multiple pages
4. Accept props to customize their appearance and behavior

## How Templates Differ from Pages

- **Templates** define the structure, layout, and component organization
- **Pages** implement templates with specific content and data

Think of templates as a blueprint and pages as the actual buildings constructed from those blueprints.

## Template Organization

Each template in this directory follows this structure:

```
TemplateNameTemplate/
├── TemplateNameTemplate.svelte    # The main template component
├── TemplateNameTemplate.stories.svelte  # Storybook stories
└── README.md                      # Documentation
```

## Current Templates

- **ArtistDashboardTemplate**: Template for the artist dashboard that displays statistics, recent activity, and quick actions

## Creating New Templates

When creating a new template:

1. Create a dedicated folder for the template using PascalCase followed by "Template"
2. Create the main template component with the same name as the folder
3. Implement the template using existing atoms, molecules, and organisms
4. Make the template customizable through props
5. Add thorough documentation in a README.md file
6. Create comprehensive Storybook stories showing different states of the template

## Usage Example

```svelte
<script>
  import ArtistDashboardTemplate from '$lib/components/app/templates/ArtistDashboardTemplate/ArtistDashboardTemplate.svelte';
  
  // Page-specific data
  const artistData = { /* ... */ };
  
  // Page-specific handlers
  function handleViewAllActivity() { /* ... */ }
</script>

<ArtistDashboardTemplate 
  artistName={artistData.artistName}
  stats={artistData.stats}
  /* other props */
/>
```

## Best Practices

- Keep templates focused on structure and layout
- Avoid hardcoding content within templates
- Make templates responsive to work across device sizes
- Use props to make templates customizable
- Keep business logic in pages, not templates
- Document props thoroughly
- Create comprehensive stories to showcase template variations
