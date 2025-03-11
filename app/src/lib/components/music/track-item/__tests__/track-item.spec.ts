import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TrackItem from '../track-item.svelte';

const mockTrack = {
    id: "track-1",
    title: "Recursive Rhythms",
    artist_id: "artist-1",
    artist_name: "Nina Netcode",
    album_id: "album-1",
    album_name: "Async Awakenings",
    cover_url: "https://example.com/cover.jpg",
    duration: 245, // 4:05
    playback_url: "#",
    published_at: "2023-05-15",
    genres: ["Electronic", "Ambient"],
    play_count: 1245678
};

describe('TrackItem Component', () => {
    // Helper function to render the component with props
    const renderComponent = (props = {}) => {
        return render(TrackItem, { 
            track: mockTrack,
            index: 0,
            showIndex: true,
            ...props 
        });
    };

    it('renders track information correctly', () => {
        renderComponent();
        
        // Check if track title is rendered
        expect(screen.getByText('Recursive Rhythms')).toBeInTheDocument();
        
        // Check if play count is formatted and displayed
        expect(screen.getByText('1.2M plays')).toBeInTheDocument();
        
        // Check if duration is formatted correctly (4:05)
        expect(screen.getByText('4:05')).toBeInTheDocument();
        
        // Check if track index is displayed
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('handles missing cover image gracefully', () => {
        const trackWithoutCover = { ...mockTrack, cover_url: null };
        renderComponent({ track: trackWithoutCover });
        
        // Component should still render without errors
        expect(screen.getByText('Recursive Rhythms')).toBeInTheDocument();
    });

    it('formats play count correctly for different ranges', () => {
        // Test for thousands
        renderComponent({ track: { ...mockTrack, play_count: 5432 } });
        expect(screen.getByText('5.4K plays')).toBeInTheDocument();
        
        // Test for small numbers
        renderComponent({ track: { ...mockTrack, play_count: 42 } });
        expect(screen.getByText('42 plays')).toBeInTheDocument();
        
        // Test for millions
        renderComponent({ track: { ...mockTrack, play_count: 42000000 } });
        expect(screen.getByText('42.0M plays')).toBeInTheDocument();
    });

    it('hides index when showIndex is false', () => {
        renderComponent({ showIndex: false });
        
        // The track number shouldn't be present
        const indexElements = screen.queryAllByText('1');
        expect(indexElements.length).toBe(0);
    });

    it('handles click events properly', async () => {
        // Mock console.log to check if it's called
        console.log = vi.fn();
        
        renderComponent();
        
        // Find the play button (it's hidden by default, visible on hover)
        const playButton = screen.getByRole('button', { hidden: true });
        
        // Simulate click
        await fireEvent.click(playButton);
        
        // Check if console.log was called
        expect(console.log).toHaveBeenCalledWith('Liked track: Recursive Rhythms');
    });

    it('formats duration correctly', () => {
        // Test 1:05
        renderComponent({ track: { ...mockTrack, duration: 65 } });
        expect(screen.getByText('1:05')).toBeInTheDocument();
        
        // Test 10:00
        renderComponent({ track: { ...mockTrack, duration: 600 } });
        expect(screen.getByText('10:00')).toBeInTheDocument();
        
        // Test 0:30
        renderComponent({ track: { ...mockTrack, duration: 30 } });
        expect(screen.getByText('0:30')).toBeInTheDocument();
    });
});