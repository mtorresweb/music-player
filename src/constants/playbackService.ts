import { EventEmitter } from 'events'
import { Audio } from 'expo-av'
import { Platform } from 'react-native'

// Custom event types for our audio player
export enum AudioEvent {
	Play = 'play',
	Pause = 'pause',
	Stop = 'stop',
	Next = 'next',
	Previous = 'previous',
	Ended = 'ended',
	LoadedData = 'loadeddata',
	Error = 'error',
	VolumeChange = 'volumechange',
	ProgressUpdate = 'progressupdate',
}

// Define our own PlaybackStatus type since expo-av doesn't export it directly
interface PlaybackStatus {
	isLoaded: boolean
	error?: string
	uri?: string
	positionMillis?: number
	durationMillis?: number
	shouldPlay?: boolean
	isPlaying?: boolean
	isBuffering?: boolean
	rate?: number
	didJustFinish?: boolean
	volume?: number
	isLooping?: boolean
	// Add other properties that might be needed
}

// Track interface to match what we had with react-native-track-player
export interface Track {
	id: string
	url: string
	title?: string
	artist?: string
	artwork?: string
	duration?: number
	[key: string]: any
}

// Define a type for event listeners
type EventListener = (...args: any[]) => void

// Audio player class
class AudioPlayerService {
	private sound: Audio.Sound | null = null
	private currentTrack: Track | null = null
	private queue: Track[] = []
	private currentIndex: number = 0
	private isPlaying: boolean = false
	private volume: number = 0.5
	private isLooping: boolean = false
	private eventEmitter = new EventEmitter()
	// Fix the type to use number instead of NodeJS.Timeout
	private progressUpdateInterval: number | null = null
	// Track active event listeners to prevent memory leaks
	private activeListeners: Map<AudioEvent, Set<EventListener>> = new Map()

	constructor() {
		// Set a higher limit for event listeners to prevent warnings
		this.eventEmitter.setMaxListeners(20)
		this.init()
	}

	private async init() {
		// Request audio permission on Android
		if (Platform.OS === 'android') {
			await Audio.requestPermissionsAsync()
		}

		// Configure audio mode
		await Audio.setAudioModeAsync({
			playsInSilentModeIOS: true,
			staysActiveInBackground: true,
			shouldDuckAndroid: true,
		})
	}

	// Event handling with listener tracking
	public addEventListener(event: AudioEvent, listener: EventListener) {
		// Track this listener to prevent duplicates
		if (!this.activeListeners.has(event)) {
			this.activeListeners.set(event, new Set())
		}

		const listeners = this.activeListeners.get(event)!
		// Only add if it's not already listening
		if (!listeners.has(listener)) {
			listeners.add(listener)
			this.eventEmitter.addListener(event, listener)
		}

		// Return cleanup function
		return () => {
			if (listeners.has(listener)) {
				listeners.delete(listener)
				this.eventEmitter.removeListener(event, listener)
			}
		}
	}

	public removeEventListener(event: AudioEvent, listener: EventListener) {
		const listeners = this.activeListeners.get(event)
		if (listeners && listeners.has(listener)) {
			listeners.delete(listener)
			this.eventEmitter.removeListener(event, listener)
		}
	}

	// Queue management
	public async setQueue(tracks: Track[]) {
		this.queue = [...tracks]
		this.currentIndex = 0
		if (this.queue.length > 0) {
			await this.loadTrack(this.queue[0])
		}
	}

	public async add(track: Track) {
		this.queue.push(track)
		if (this.queue.length === 1) {
			await this.loadTrack(track)
		}
	}

	public async remove(id: string) {
		const index = this.queue.findIndex((track) => track.id === id)
		if (index !== -1) {
			this.queue.splice(index, 1)
			if (index === this.currentIndex && this.sound) {
				await this.sound.unloadAsync()
				this.sound = null
				this.currentTrack = null

				if (this.queue.length > 0) {
					this.currentIndex = Math.min(index, this.queue.length - 1)
					await this.loadTrack(this.queue[this.currentIndex])
				}
			} else if (index < this.currentIndex) {
				this.currentIndex--
			}
		}
	}

	public getQueue(): Track[] {
		return [...this.queue]
	}

	public getCurrentTrack(): Track | null {
		return this.currentTrack
	}

	// Basic playback controls
	private async loadTrack(track: Track) {
		// First stop any active playback before unloading
		if (this.sound) {
			try {
				// Stop first to ensure immediate playback cessation
				await this.sound.stopAsync()
				// Then unload to free resources
				await this.sound.unloadAsync()
			} catch (error) {
				console.error('Error stopping previous track:', error)
			}
			// Set to null to ensure we don't reference stale sound objects
			this.sound = null
		}

		try {
			const { sound } = await Audio.Sound.createAsync(
				{ uri: track.url },
				{
					shouldPlay: this.isPlaying,
					volume: this.volume,
					isLooping: this.isLooping,
				},
				this.onPlaybackStatusUpdate,
			)

			this.sound = sound
			this.currentTrack = track

			this.eventEmitter.emit(AudioEvent.LoadedData, track)

			if (this.isPlaying) {
				await this.sound.playAsync()
			}

			this.startProgressUpdates()
		} catch (error) {
			console.error('Error loading track:', error)
			this.eventEmitter.emit(AudioEvent.Error, error)
		}
	}

	private onPlaybackStatusUpdate = (status: PlaybackStatus) => {
		if (!status.isLoaded) {
			if (status.error) {
				console.error(`Error: ${status.error}`)
				this.eventEmitter.emit(AudioEvent.Error, status.error)
			}
			return
		}

		if (status.didJustFinish && !status.isLooping) {
			this.eventEmitter.emit(AudioEvent.Ended)
			this.skipToNext()
		}
	}

	private startProgressUpdates() {
		this.stopProgressUpdates()
		this.progressUpdateInterval = setInterval(async () => {
			if (this.sound && this.isPlaying) {
				const status = (await this.sound.getStatusAsync()) as PlaybackStatus
				if (status.isLoaded) {
					this.eventEmitter.emit(AudioEvent.ProgressUpdate, {
						position: status.positionMillis ? status.positionMillis / 1000 : 0,
						duration: status.durationMillis ? status.durationMillis / 1000 : 0,
					})
				}
			}
		}, 1000)
	}

	private stopProgressUpdates() {
		if (this.progressUpdateInterval) {
			clearInterval(this.progressUpdateInterval)
			this.progressUpdateInterval = null
		}
	}

	public async play() {
		if (this.sound) {
			await this.sound.playAsync()
			this.isPlaying = true
			this.eventEmitter.emit(AudioEvent.Play)
			this.startProgressUpdates()
		}
	}

	public async pause() {
		if (this.sound) {
			await this.sound.pauseAsync()
			this.isPlaying = false
			this.eventEmitter.emit(AudioEvent.Pause)
			this.stopProgressUpdates()
		}
	}

	public async stop() {
		if (this.sound) {
			await this.sound.stopAsync()
			this.isPlaying = false
			this.eventEmitter.emit(AudioEvent.Stop)
			this.stopProgressUpdates()
		}
	}

	public async skipToNext() {
		if (this.queue.length === 0) return

		this.currentIndex = (this.currentIndex + 1) % this.queue.length
		await this.loadTrack(this.queue[this.currentIndex])
		this.eventEmitter.emit(AudioEvent.Next)

		if (this.isPlaying) {
			await this.play()
		}
	}

	public async skipToPrevious() {
		if (this.queue.length === 0) return

		this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length
		await this.loadTrack(this.queue[this.currentIndex])
		this.eventEmitter.emit(AudioEvent.Previous)

		if (this.isPlaying) {
			await this.play()
		}
	}

	public async skipToIndex(index: number) {
		if (this.queue.length === 0 || index < 0 || index >= this.queue.length) return

		// Only load a new track if the index has changed
		if (index !== this.currentIndex) {
			this.currentIndex = index
			await this.loadTrack(this.queue[this.currentIndex])
			this.eventEmitter.emit(AudioEvent.Next)
		}

		// Play the track if we were already playing
		if (this.isPlaying) {
			await this.play()
		}

		return this.queue[this.currentIndex]
	}

	public async seekTo(position: number) {
		if (this.sound) {
			await this.sound.setPositionAsync(position * 1000)
		}
	}

	public async setVolume(volume: number) {
		this.volume = Math.max(0, Math.min(1, volume))
		if (this.sound) {
			await this.sound.setVolumeAsync(this.volume)
			this.eventEmitter.emit(AudioEvent.VolumeChange, this.volume)
		}
	}

	public getVolume(): number {
		return this.volume
	}

	public async setRepeatMode(isLooping: boolean) {
		this.isLooping = isLooping
		if (this.sound) {
			await this.sound.setIsLoopingAsync(isLooping)
		}
	}

	public getRepeatMode(): boolean {
		return this.isLooping
	}

	public getPlayerState(): { isPlaying: boolean } {
		return { isPlaying: this.isPlaying }
	}

	public async reset() {
		if (this.sound) {
			this.stopProgressUpdates()
			await this.sound.unloadAsync()
			this.sound = null
		}
		this.queue = []
		this.currentIndex = 0
		this.currentTrack = null
		this.isPlaying = false
	}
}

// Create singleton instance
export const AudioPlayer = new AudioPlayerService()

// Legacy functions to match TrackPlayer API
export const playbackService = async () => {
	// No need for this with expo-av, but kept for compatibility
	console.log('Audio playback service initialized with expo-av')
}
