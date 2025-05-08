import { AudioEvent, AudioPlayer } from '@/constants/playbackService'
import { useEffect } from 'react'

export const useLogTrackPlayerState = () => {
	useEffect(() => {
		const playListener = AudioPlayer.addEventListener(AudioEvent.Play, () => {
			console.log('Playback state: playing')
		})

		const pauseListener = AudioPlayer.addEventListener(AudioEvent.Pause, () => {
			console.log('Playback state: paused')
		})

		const errorListener = AudioPlayer.addEventListener(AudioEvent.Error, (error) => {
			console.warn('An error occurred: ', error)
		})

		const loadedListener = AudioPlayer.addEventListener(AudioEvent.LoadedData, (track) => {
			console.log('Track changed to:', track.title)
		})

		return () => {
			// Clean up listeners
			playListener()
			pauseListener()
			errorListener()
			loadedListener()
		}
	}, [])
}
