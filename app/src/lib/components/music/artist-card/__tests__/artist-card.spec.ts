import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ArtistCard from '../artist-card.svelte';

describe('ArtistCard Component', () => {
	// Sample props
	const defaultProps = {
		id: 'artist-1',
		name: 'Nina Netcode',
		avatarUrl: 'https://example.com/avatar.jpg',
		size: 'default',
		className: ''
	};

	// Helper function to render the component with props
	const renderComponent = (props = {}) => {
		return render(ArtistCard, {
			...defaultProps,
			...props
		});
	};

	it('renders artist information correctly', () => {
		renderComponent();

		// Check if artist name is rendered
		expect(screen.getByText('Nina Netcode')).toBeInTheDocument();

		// Check if "Artist" label is displayed
		expect(screen.getByText('Artist')).toBeInTheDocument();
	});

	it('handles missing avatar gracefully', () => {
		renderComponent({ avatarUrl: null });

		// Component should still render without errors
		expect(screen.getByText('Nina Netcode')).toBeInTheDocument();

		// Should show fallback with initials
		expect(screen.getByText('Ni')).toBeInTheDocument();
	});

	it('applies size classes correctly', () => {
		// Test default size
		const { container, unmount } = renderComponent({ size: 'default' });
		expect(container.firstChild).toHaveClass('w-[160px]');
		unmount();

		// Test small size
		const { container: smallContainer, unmount: smallUnmount } = renderComponent({ size: 'sm' });
		expect(smallContainer.firstChild).toHaveClass('w-[120px]');
		smallUnmount();

		// Test large size
		const { container: largeContainer } = renderComponent({ size: 'lg' });
		expect(largeContainer.firstChild).toHaveClass('w-[200px]');
	});

	it('applies custom class names', () => {
		const { container } = renderComponent({ className: 'custom-test-class' });
		expect(container.firstChild).toHaveClass('custom-test-class');
	});

	it('generates correct fallback with different names', () => {
		// Test with simple name
		renderComponent({ name: 'John Doe', avatarUrl: null });
		expect(screen.getByText('Jo')).toBeInTheDocument();

		// Test with single name
		renderComponent({ name: 'Madonna', avatarUrl: null });
		expect(screen.getByText('Ma')).toBeInTheDocument();

		// TODO: Test with empty name (edge case)
		//renderComponent({ name: '', avatarUrl: null });
		//expect(screen.getByText('')).toBeInTheDocument();
	});

	it('navigates to artist page on click', async () => {
		// Mock window.location.href
		const originalLocation = window.location;
		// @ts-expect-error only for testing
		delete window.location;
		window.location = { href: '' } as unknown as Location & string;

		renderComponent();

		// Find the avatar
		const avatar = screen.getByRole('img', { hidden: true });

		// Simulate click
		await fireEvent.click(avatar);

		// Check if navigation happened
		expect(window.location.href).toBe('/artist/artist-1');

		// Restore window.location
		// @ts-expect-error only for testing
		window.location = originalLocation;
	});
});
