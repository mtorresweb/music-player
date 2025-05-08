import { AudioEvent, AudioPlayer, Track } from '@/constants/playbackService'
import { useEffect, useState } from 'react'

/**
 * A custom hook that returns the currently active track from our AudioPlayer
 * This replaces the useActiveTrack hook from react-native-track-player
 */
export const useActiveTrack = (): Track | null => {
	const [activeTrack, setActiveTrack] = useState<Track | null>(AudioPlayer.getCurrentTrack())

	useEffect(() => {
		// Update track when a new track is loaded
		const loadedDataListener = AudioPlayer.addEventListener(AudioEvent.LoadedData, (track) => {
			setActiveTrack(track)
		})

		return () => {
			// Cleanup
			loadedDataListener()
		}
	}, [])

	return activeTrack
}
