import { AudioEvent, AudioPlayer } from '@/constants/playbackService'
import { useEffect, useState } from 'react'

/**
 * Custom hook to replace useIsPlaying from TrackPlayer
 * Provides the current playing state of the audio player
 */
export const useIsPlaying = () => {
	const [playing, setPlaying] = useState(AudioPlayer.getPlayerState().isPlaying)

	useEffect(() => {
		const playListener = AudioPlayer.addEventListener(AudioEvent.Play, () => {
			setPlaying(true)
		})

		const pauseListener = AudioPlayer.addEventListener(AudioEvent.Pause, () => {
			setPlaying(false)
		})

		const stopListener = AudioPlayer.addEventListener(AudioEvent.Stop, () => {
			setPlaying(false)
		})

		return () => {
			playListener()
			pauseListener()
			stopListener()
		}
	}, [])

	return { playing }
}
