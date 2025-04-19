import { browser } from '$app/environment';
import type { Track } from '$lib/types';
import { getContext, setContext } from 'svelte';

export interface PlayerSettings {
	volume: number;
	muted: boolean;
	repeat: 'off' | 'all' | 'one';
	shuffle: boolean;
	crossfadeDuration: number; // in seconds
	//equalizerEnabled: boolean;
	//equalizerBands: number[]; // frequency bands adjustment
}

export class PlayerState {
	currentTrack = $state<Track | null>(null);
	queue = $state<Track[]>([]);
	queueIndex = $state(-1);

	isPlaying = $state(false);
	isBuffering = $state(false);
	currentTime = $state(0);
	duration = $state(0);

	// List either an album or a playlist
	currentListId = $state<null | string>(null);

	// Computed values
	progress = $derived(this.duration ? (this.currentTime / this.duration) * 100 : 0);
	formattedCurrentTime = $derived(this.formatTime(this.currentTime));
	formattedDuration = $derived(this.formatTime(this.duration));
	timeRemaining = $derived(this.formatTime(this.duration - this.currentTime));
	hasNext = $derived(this.queueIndex < this.queue.length - 1);
	hasPrevious = $derived(this.queueIndex > 0);

	// Player settings
	settings = $state<PlayerSettings>({
		volume: 0.2,
		muted: false,
		repeat: 'off',
		shuffle: false,
		crossfadeDuration: 0
		//equalizerEnabled: false,
		//equalizerBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 10-band EQ
	});

	// Audio HTML element reference (not reactive)
	private audioElement: HTMLAudioElement | null = null;

	// History (for forward/back navigation)
	playHistory = $state<Track[]>([]);

	constructor() {
		if (browser) {
			const audio = new Audio();
			this.setAudioElement(audio);

			$effect(() => {
				audio.volume = this.settings.volume;
			});
		}
	}

	setAudioElement(element: HTMLAudioElement) {
		this.audioElement = element;
		this.setupAudioListeners();
	}

	play() {
		if (this.audioElement && this.currentTrack) {
			if (!this.audioElement.src) {
				this.audioElement.src = this.currentTrack.audio_url;
			}

			this.audioElement.play().catch((error) => {
				console.error('Failed to play track', error);
			});
		}
	}

	pause() {
		if (this.audioElement) {
			this.audioElement.pause();
		}
	}

	togglePlayPause() {
		console.log('Before toggle - Current time:', this.currentTime);

		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
		console.log('After toggle - Current time:', this.currentTime);
	}

	seek(time: number) {
		if (this.audioElement) {
			this.audioElement.currentTime = time;
			this.currentTime = time;
		}
	}

	seekByPercentage(percentage: number) {
		if (this.audioElement && this.duration) {
			const time = (percentage / 100) * this.duration;
			this.seek(time);
		}
	}

	playTrack(track: Track, addToHistory = true) {
		// Add current track to history if exists
		if (this.currentTrack && addToHistory) {
			this.playHistory = [...this.playHistory, this.currentTrack];
		}

		this.currentTrack = track;
		this.currentTime = 0;

		if (this.audioElement) {
			this.audioElement.src = track.audio_url;
			this.play();
		}
	}

	playNextTrack() {
		if (this.hasNext) {
			this.queueIndex += 1;
			this.playTrack(this.queue[this.queueIndex]);
		} else if (this.settings.repeat === 'all' && this.queue.length > 0) {
			this.queueIndex = 0;
			this.playTrack(this.queue[0]);
		}
	}

	playPreviousTrack() {
		if (this.currentTime > 3) {
			// If we're more than 3 seconds into the track, restart it
			this.seek(0);
		} else if (this.hasPrevious) {
			this.queueIndex -= 1;
			this.playTrack(this.queue[this.queueIndex]);
		} else if (this.settings.repeat === 'all' && this.queue.length > 0) {
			this.queueIndex = this.queue.length - 1;
			this.playTrack(this.queue[this.queueIndex]);
		}
	}

	handleTrackEnd() {
		switch (this.settings.repeat) {
			case 'all':
				if (this.hasNext) {
					this.playNextTrack();
				} else {
					this.seek(0);
				}
				break;
			case 'one':
				this.seek(0);
				this.play();
				break;
			case 'off':
				break;
		}

		if (this.currentListId && !this.hasNext) {
			this.currentListId = null;
		}
	}

	setQueue(tracks: Track[], initialIndex = 0) {
		if (tracks.length === 0) return;

		this.queue = this.settings.shuffle ? this.shuffleArray([...tracks]) : [...tracks];
		this.queueIndex = initialIndex;

		if (initialIndex >= 0 && initialIndex < tracks.length) {
			this.playTrack(this.queue[initialIndex]);
		}
	}

	addToQueue(track: Track, playNext = false) {
		if (playNext) {
			const newQueue = [...this.queue];
			newQueue.splice(this.queueIndex + 1, 0, track);
			this.queue = newQueue;
		} else {
			this.queue = [...this.queue, track];
		}
	}

	clearQueue() {
		this.queue = [];
		this.queueIndex = -1;
	}

	toggleShuffle() {
		this.settings = {
			...this.settings,
			shuffle: !this.settings.shuffle
		};

		if (this.settings.shuffle && this.queue.length > 0) {
			// Save current track
			const currentTrack = this.currentTrack;

			// Shuffle the queue excluding the current track
			const remainingTracks = this.queue.filter((_, index) => index !== this.queueIndex);
			const shuffledRemaining = this.shuffleArray(remainingTracks);

			// Put current track at the beginning
			if (currentTrack) {
				this.queue = [currentTrack, ...shuffledRemaining];
				this.queueIndex = 0;
			} else {
				this.queue = shuffledRemaining;
			}
		}
	}

	toggleRepeat() {
		const modes: PlayerSettings['repeat'][] = ['off', 'all', 'one'];
		const currentIndex = modes.indexOf(this.settings.repeat);
		const nextIndex = (currentIndex + 1) % modes.length;

		this.settings = {
			...this.settings,
			repeat: modes[nextIndex]
		};
	}

	setVolume(volume: number) {
		if (volume < 0) volume = 0;
		if (volume > 1) volume = 1;

		this.settings = {
			...this.settings,
			volume,
			muted: volume === 0
		};

		if (this.audioElement) {
			this.audioElement.volume = volume;
		}
	}

	toggleMute() {
		const newMuted = !this.settings.muted;

		this.settings = {
			...this.settings,
			muted: newMuted
		};

		if (this.audioElement) {
			this.audioElement.muted = newMuted;
		}
	}

	removeFromQueue(index: number) {
		if (index < 0 || index >= this.queue.length) return;

		const newQueue = [...this.queue];
		newQueue.splice(index, 1);

		this.queue = newQueue;

		// Adjust current index if needed
		if (index < this.queueIndex) {
			this.queueIndex -= 1;
		} else if (index === this.queueIndex) {
			// We're removing the current track, play the next one
			this.playNextTrack();
		}
	}

	private setupAudioListeners() {
		if (!this.audioElement) return;

		this.audioElement.addEventListener('timeupdate', () => {
			if (this.audioElement) {
				this.currentTime = this.audioElement.currentTime;
			}
		});

		this.audioElement.addEventListener('durationchange', () => {
			if (this.audioElement) {
				this.duration = this.audioElement.duration;
			}
		});

		this.audioElement.addEventListener('playing', () => {
			this.isPlaying = true;
			this.isBuffering = false;
		});

		this.audioElement.addEventListener('pause', () => {
			this.isPlaying = false;
		});

		this.audioElement.addEventListener('waiting', () => {
			this.isBuffering = true;
		});

		this.audioElement.addEventListener('ended', () => {
			this.handleTrackEnd();
		});
	}

	formatTime(seconds: number): string {
		if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	private shuffleArray<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	// Utils
	// An album is pretty much "just a list"
	playList(list: { tracks: Track[]; id: string }) {
		const { tracks, id } = list;
		this.currentListId = id;

		tracks.forEach((t, i) => {
			if (i === 0) {
				this.playTrack(t);
			} else {
				this.addToQueue(t);
			}
		});
	}

	isListCurrentlyPlaying(list: { tracks: Track[]; id: string }) {
		return (this.currentListId === list.id && this.isPlaying);
	}
}

const PLAYER_CONTEXT_KEY = Symbol('playerContext');

export function setPlayerContext(player: PlayerState) {
	return setContext(PLAYER_CONTEXT_KEY, player);
}

export function getPlayerContext() {
	return getContext<ReturnType<typeof setPlayerContext>>(PLAYER_CONTEXT_KEY);
}
