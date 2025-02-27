import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlayerState } from './player.svelte';
import type { Track } from '$lib/types';

// Mock implementation of HTMLAudioElement
class MockAudioElement {
	src: string = '';
	currentTime: number = 0;
	duration: number = 0;
	volume: number = 0.5;
	muted: boolean = false;
	paused: boolean = true;

	// Event listeners
	private listeners: Record<string, Array<() => void>> = {
		timeupdate: [],
		durationchange: [],
		playing: [],
		pause: [],
		waiting: [],
		ended: []
	};

	play() {
		this.paused = false;
		this.dispatchEvent('playing');
		return Promise.resolve();
	}

	pause() {
		this.paused = true;
		this.dispatchEvent('pause');
	}

	addEventListener(type: string, callback: () => void): void {
		if (!this.listeners[type]) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(callback);
	}

	dispatchEvent(type: string) {
		if (this.listeners[type]) {
			this.listeners[type].forEach((callback) => callback());
		}
	}

	// Helper to simulate timeupdate event with a specific time
	setCurrentTime(time: number) {
		this.currentTime = time;
		this.dispatchEvent('timeupdate');
	}

	// Helper to simulate duration change
	setDuration(duration: number) {
		this.duration = duration;
		this.dispatchEvent('durationchange');
	}

	// Helper to simulate track ended
	simulateEnded() {
		this.dispatchEvent('ended');
	}

	// Helper to simulate buffering
	simulateBuffering() {
		this.dispatchEvent('waiting');
	}
}

// Sample track data for testing
const createMockTrack = (id: string, title: string): Track => ({
	id,
	title,
	artist_id: 'artist-1',
	artist_name: 'Test Artist',
	album_id: 'album-1',
	album_name: 'Test Album',
	cover_url: '/test-cover.jpg',
	duration: 180, // 3 minutes
	playback_url: `/track-${id}.mp3`,
	published_at: '2025-01-01T00:00:00Z',
	genres: ['electronic'],
	play_count: 0
});

describe('PlayerState', () => {
	let playerState: PlayerState;
	let mockAudio: MockAudioElement;

	beforeEach(() => {
		// Setup for each test
		playerState = new PlayerState();
		mockAudio = new MockAudioElement();

		playerState.setAudioElement(mockAudio as unknown as HTMLAudioElement);
	});

	afterEach(() => {
		// Cleanup
		vi.restoreAllMocks();
	});

	test('should initialize with default values', () => {
		expect(playerState.currentTrack).toBeNull();
		expect(playerState.queue).toEqual([]);
		expect(playerState.queueIndex).toBe(-1);
		expect(playerState.isPlaying).toBe(false);
		expect(playerState.isBuffering).toBe(false);
		expect(playerState.currentTime).toBe(0);
		expect(playerState.duration).toBe(0);
		expect(playerState.settings.volume).toBe(0.8);
		expect(playerState.settings.muted).toBe(false);
		expect(playerState.settings.repeat).toBe('off');
		expect(playerState.settings.shuffle).toBe(false);
	});

	test('should play and pause tracks', () => {
		const mockTrack = createMockTrack('1', 'Test Track');
		playerState.playTrack(mockTrack);

		// Verify track is loaded
		expect(playerState.currentTrack).toEqual(mockTrack);
		expect(mockAudio.src).toBe(mockTrack.playback_url);

		// Verify play() works
		expect(playerState.isPlaying).toBe(true);

		// Test pause
		playerState.pause();
		expect(playerState.isPlaying).toBe(false);

		// Test togglePlayPause
		playerState.togglePlayPause();
		expect(playerState.isPlaying).toBe(true);

		playerState.togglePlayPause();
		expect(playerState.isPlaying).toBe(false);
	});

	test('should handle seeking', () => {
		const mockTrack = createMockTrack('1', 'Test Track');
		playerState.playTrack(mockTrack);

		// Set duration to test seekByPercentage
		mockAudio.setDuration(200);

		// Test seek to specific time
		playerState.seek(50);
		expect(playerState.currentTime).toBe(50);
		expect(mockAudio.currentTime).toBe(50);

		// Test seekByPercentage
		playerState.seekByPercentage(25); // 25% of 200 seconds = 50 seconds
		expect(mockAudio.currentTime).toBe(50);
	});

	test('should manage queue operations', () => {
		const track1 = createMockTrack('1', 'Track 1');
		const track2 = createMockTrack('2', 'Track 2');
		const track3 = createMockTrack('3', 'Track 3');

		// Set queue with initial track
		playerState.setQueue([track1, track2, track3], 0);

		expect(playerState.queue).toEqual([track1, track2, track3]);
		expect(playerState.queueIndex).toBe(0);
		expect(playerState.currentTrack).toEqual(track1);

		// Test playNextTrack
		playerState.playNextTrack();
		expect(playerState.queueIndex).toBe(1);
		expect(playerState.currentTrack).toEqual(track2);

		// Test playPreviousTrack
		playerState.playPreviousTrack();
		expect(playerState.queueIndex).toBe(0);
		expect(playerState.currentTrack).toEqual(track1);

		// Test addToQueue
		const track4 = createMockTrack('4', 'Track 4');
		playerState.addToQueue(track4);
		expect(playerState.queue).toEqual([track1, track2, track3, track4]);

		// Test addToQueue with playNext
		const track5 = createMockTrack('5', 'Track 5');
		playerState.addToQueue(track5, true);
		expect(playerState.queue).toEqual([track1, track5, track2, track3, track4]);

		// Test removeFromQueue
		playerState.removeFromQueue(1); // Remove track5
		expect(playerState.queue).toEqual([track1, track2, track3, track4]);

		// Test clearQueue
		playerState.clearQueue();
		expect(playerState.queue).toEqual([]);
		expect(playerState.queueIndex).toBe(-1);
	});

	test('should handle track end behavior based on repeat settings', () => {
		const track1 = createMockTrack('1', 'Track 1');
		const track2 = createMockTrack('2', 'Track 2');

		playerState.setQueue([track1, track2], 0);

		// Test default behavior (repeat: 'off')
		mockAudio.simulateEnded();
		expect(playerState.queueIndex).toBe(1);
		expect(playerState.currentTrack).toEqual(track2);

		// Test repeat: 'one'
		playerState.settings = {
			...playerState.settings,
			repeat: 'one'
		};

		// Mock the seek and play methods
		const seekSpy = vi.spyOn(playerState, 'seek');
		const playSpy = vi.spyOn(playerState, 'play');

		mockAudio.simulateEnded();
		expect(seekSpy).toHaveBeenCalledWith(0);
		expect(playSpy).toHaveBeenCalled();

		// Test repeat: 'all' when at the end of queue
		playerState.settings = {
			...playerState.settings,
			repeat: 'all'
		};

		// Reset spies
		seekSpy.mockReset();
		playSpy.mockReset();

		// Simulate being at the end of the queue
		playerState.queueIndex = 1;
		mockAudio.simulateEnded();
		expect(playerState.queueIndex).toBe(0);
		expect(playerState.currentTrack).toEqual(track1);
	});

	test('should handle volume and mute controls', () => {
		// Test setVolume
		playerState.setVolume(0.5);
		expect(playerState.settings.volume).toBe(0.5);
		expect(mockAudio.volume).toBe(0.5);

		// Test volume boundaries
		playerState.setVolume(-0.1);
		expect(playerState.settings.volume).toBe(0);

		playerState.setVolume(1.1);
		expect(playerState.settings.volume).toBe(1);

		// Test toggleMute
		playerState.toggleMute();
		expect(playerState.settings.muted).toBe(true);
		expect(mockAudio.muted).toBe(true);

		playerState.toggleMute();
		expect(playerState.settings.muted).toBe(false);
		expect(mockAudio.muted).toBe(false);
	});

	test('should handle repeat mode toggling', () => {
		// Initial state: repeat = 'off'
		expect(playerState.settings.repeat).toBe('off');

		// First toggle: off -> all
		playerState.toggleRepeat();
		expect(playerState.settings.repeat).toBe('all');

		// Second toggle: all -> one
		playerState.toggleRepeat();
		expect(playerState.settings.repeat).toBe('one');

		// Third toggle: one -> off
		playerState.toggleRepeat();
		expect(playerState.settings.repeat).toBe('off');
	});

	test('should handle shuffle mode toggling', () => {
		const track1 = createMockTrack('1', 'Track 1');
		const track2 = createMockTrack('2', 'Track 2');
		const track3 = createMockTrack('3', 'Track 3');

		playerState.setQueue([track1, track2, track3], 0);

		// Mock shuffleArray to make test deterministic
		// Using type assertion with 'as any' only for the private method access
		const shuffleSpy = vi.spyOn(playerState as never, 'shuffleArray').mockImplementation((arr) => {
			// Return a predictable "shuffled" array
			// @ts-expect-error can't expect ts to know here
			return [arr[2], arr[0], arr[1]];
		});

		// Enable shuffle
		playerState.toggleShuffle();
		expect(playerState.settings.shuffle).toBe(true);

		// Since we're at index 0, the current track should remain at position 0,
		// and the rest should be "shuffled"
		expect(playerState.queue[0]).toEqual(track1);

		// Disable shuffle
		playerState.toggleShuffle();
		expect(playerState.settings.shuffle).toBe(false);

		// Restore original method
		shuffleSpy.mockRestore();
	});

	test('should add tracks to play history', () => {
		const track1 = createMockTrack('1', 'Track 1');
		const track2 = createMockTrack('2', 'Track 2');

		// Play first track
		playerState.playTrack(track1);
		expect(playerState.playHistory).toEqual([]);

		// Play second track (should add first to history)
		playerState.playTrack(track2);
		expect(playerState.playHistory).toEqual([track1]);

		// Play first track again
		playerState.playTrack(track1);
		expect(playerState.playHistory).toEqual([track1, track2]);
	});

	test('should format time correctly', () => {
		expect(playerState.formatTime(0)).toBe('0:00');
		expect(playerState.formatTime(30)).toBe('0:30');
		expect(playerState.formatTime(60)).toBe('1:00');
		expect(playerState.formatTime(90)).toBe('1:30');
		expect(playerState.formatTime(3600)).toBe('60:00');
		expect(playerState.formatTime(3661)).toBe('61:01');

		// Edge cases
		expect(playerState.formatTime(NaN)).toBe('0:00');
		expect(playerState.formatTime(Infinity)).toBe('0:00');
	});

	test('should correctly calculate derived values', () => {
		// Set up initial state
		const track = createMockTrack('1', 'Test Track');
		playerState.playTrack(track);

		// Set duration
		mockAudio.setDuration(100);
		expect(playerState.duration).toBe(100);

		// Set current time and check progress
		mockAudio.setCurrentTime(25);
		expect(playerState.currentTime).toBe(25);
		expect(playerState.progress).toBe(25); // 25/100 * 100

		// Check formatted times
		expect(playerState.formattedCurrentTime).toBe('0:25');
		expect(playerState.formattedDuration).toBe('1:40');
		expect(playerState.timeRemaining).toBe('1:15'); // 100-25 = 75 seconds
	});

	test('should handle playPreviousTrack based on currentTime', () => {
		const track1 = createMockTrack('1', 'Track 1');
		const track2 = createMockTrack('2', 'Track 2');

		playerState.setQueue([track1, track2], 1);

		// If less than 3 seconds in, should go to previous track
		mockAudio.setCurrentTime(2);
		playerState.playPreviousTrack();
		expect(playerState.queueIndex).toBe(0);
		expect(playerState.currentTrack).toEqual(track1);

		// If more than 3 seconds in, should restart current track
		playerState.setQueue([track1, track2], 1);
		mockAudio.setCurrentTime(5);
		playerState.playPreviousTrack();
		expect(playerState.queueIndex).toBe(1); // Index should not change
		expect(playerState.currentTime).toBe(0); // But time should reset
	});
});
