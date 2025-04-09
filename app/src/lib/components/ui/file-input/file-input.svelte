<script lang="ts">
	import { cn } from '$lib/utils';

	/*
	export let id: string = '';
	export let name: string = '';
	export let accept: string = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let error: string | null = null;
	export let className: string = '';
  */
	let {
		id,
		name,
		accept,
		required,
		disabled,
		error,
		className
	}: {
		id: string;
		name: string;
		accept: string;
		required: boolean;
		disabled: boolean;
		error: string | null;
		className: string;
	} = $props();

	let inputElement: HTMLInputElement;
	let dragActive = $state(false);
	let fileSelected = $state(false);
	let fileName = $state('');

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;

		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			handleFileSelection(file);

			// Manually dispatch a change event
			const changeEvent = new Event('change', { bubbles: true });
			inputElement.dispatchEvent(changeEvent);
		}
	}

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			const file = input.files[0];
			handleFileSelection(file);
		} else {
			fileSelected = false;
			fileName = '';
		}
	}

	function handleFileSelection(file: File) {
		fileSelected = true;
		fileName = file.name;

		// Set the file to the input element
		if (inputElement) {
			// Create a DataTransfer object to set files
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			inputElement.files = dataTransfer.files;
		}
	}

	function handleBrowseClick() {
		if (!disabled) {
			inputElement.click();
		}
	}
</script>

<div class={cn('relative w-full', className)}>
	<button
		class={cn(
			'flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
			dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
			fileSelected ? 'bg-muted/20' : '',
			error ? 'border-destructive' : '',
			disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
			'hover:bg-muted/20'
		)}
		ondragenter={handleDragEnter}
		ondragleave={handleDragLeave}
		ondragover={handleDragOver}
		ondrop={handleDrop}
		onclick={handleBrowseClick}
	>
		<input
			type="file"
			{id}
			{name}
			{accept}
			{required}
			{disabled}
			bind:this={inputElement}
			onchange={handleChange}
			class="sr-only"
		/>

		<div class="p-4 text-center">
			{#if fileSelected}
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
					class="text-primary mx-auto mb-2"
				>
					<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
				</svg>
				<p class="max-w-full truncate text-sm font-medium">{fileName}</p>
				<p class="text-muted-foreground mt-1 text-xs">Click to replace</p>
			{:else}
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
					class="text-muted-foreground mx-auto mb-2"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="17 8 12 3 7 8"></polyline>
					<line x1="12" y1="3" x2="12" y2="15"></line>
				</svg>
				<p class="text-sm font-medium">Drag and drop or click to browse</p>
				{#if accept}
					<p class="text-muted-foreground mt-1 text-xs">
						Accepts: {accept.replace('audio/*', 'audio files').replace('image/*', 'images')}
					</p>
				{/if}
			{/if}
		</div>
	</button>

	{#if error}
		<p class="text-destructive mt-1 text-sm">{error}</p>
	{/if}
</div>
