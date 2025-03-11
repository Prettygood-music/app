import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import AlbumCard from '../album-card.svelte';

const mockAlbum = {
    id: "album-1",
    title: "Async Awakenings",
    artist_id: "artist-1",
    artist_name: "Nina Netcode",
    cover_url: "https://example.com/cover.jpg",
    release_date: "2023-05-15",
    track_count: 12,
    tracks: []
};

describe('AlbumCard Component', () => {
    // Helper function to render the component with props
    const renderComponent = (props = {}) => {
        return render(AlbumCard, { 
            album: mockAlbum,
            size: 'default',
            aspectRatio: 'square',
            className: '',
            ...props 
        });
    };

    it('renders album information correctly', () => {
        renderComponent();
        
        // Check if album title is rendered
        expect(screen.getByText('Async Awakenings')).toBeInTheDocument();
        
        // Check if year and track count are displayed
        expect(screen.getByText('2023 • 12 tracks')).toBeInTheDocument();
    });

    it('handles missing cover image gracefully', () => {
        const albumWithoutCover = { ...mockAlbum, cover_url: null };
        renderComponent({ album: albumWithoutCover });
        
        // Component should still render without errors
        expect(screen.getByText('Async Awakenings')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
        // Test small size
        const { container, unmount } = renderComponent({ size: 'sm' });
        expect(container.firstChild).toHaveClass('max-w-[150px]');
        unmount();
        
        // Test large size
        const { container: largeContainer } = renderComponent({ size: 'lg' });
        expect(largeContainer.firstChild).toHaveClass('max-w-[250px]');
    });

    it('applies aspect ratio classes correctly', () => {
        // Test portrait aspect ratio
        const { container, unmount } = renderComponent({ aspectRatio: 'portrait' });
        expect(container.querySelector('.aspect-\\[3\\/4\\]')).toBeInTheDocument();
        unmount();
        
        // Test video aspect ratio
        const { container: videoContainer, unmount: videoUnmount } = renderComponent({ aspectRatio: 'video' });
        expect(videoContainer.querySelector('.aspect-video')).toBeInTheDocument();
        videoUnmount();
        
        // Test square aspect ratio
        const { container: squareContainer } = renderComponent({ aspectRatio: 'square' });
        expect(squareContainer.querySelector('.aspect-square')).toBeInTheDocument();
    });

    it('applies custom class names', () => {
        const { container } = renderComponent({ className: 'custom-test-class' });
        expect(container.firstChild).toHaveClass('custom-test-class');
    });

    it('handles click events properly', async () => {
        // Mock console.log to check if it's called
        console.log = vi.fn();
        
        renderComponent();
        
        // Find the clickable album cover
        const albumCover = screen.getByRole('img', { hidden: true });
        
        // Simulate click
        await fireEvent.click(albumCover);
        
        // Check if console.log was called
        expect(console.log).toHaveBeenCalledWith('Playing album: Async Awakenings');
    });

    it('formats release year correctly', () => {
        // Test different years
        renderComponent({ album: { ...mockAlbum, release_date: '2020-01-01' } });
        expect(screen.getByText('2020 • 12 tracks')).toBeInTheDocument();
        
        renderComponent({ album: { ...mockAlbum, release_date: '1999-12-31' } });
        expect(screen.getByText('1999 • 12 tracks')).toBeInTheDocument();
    });
});