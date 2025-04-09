<!-- SearchBar.svelte -->
<script>
  // Props
  let { placeholder = 'Search...', value = $bindable(''), onSubmit } = $props();

  // State
  let isFocused = $state(false);

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value);
    }
  }
</script>

<form class="relative w-full" onsubmit={handleSubmit}>
  <div class="relative">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
    <input
      type="search"
      {placeholder}
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
      bind:value
      on:focus={() => (isFocused = true)}
      on:blur={() => (isFocused = false)}
    />
  </div>
</form>