import { AudioEvent, AudioPlayer } from '@/constants/playbackService'
import { useCallback, useEffect, useState } from 'react'

export const useTrackPlayerVolume = () => {
	const [volume, setVolume] = useState<number | undefined>(undefined)

	const getVolume = useCallback(() => {
		const currentVolume = AudioPlayer.getVolume()
		setVolume(currentVolume)
	}, [])

	const updateVolume = useCallback(async (newVolume: number) => {
		if (newVolume < 0 || newVolume > 1) return

		setVolume(newVolume)
		await AudioPlayer.setVolume(newVolume)
	}, [])

	useEffect(() => {
		getVolume()

		// Listen for volume changes that might happen elsewhere
		const volumeListener = AudioPlayer.addEventListener(AudioEvent.VolumeChange, (newVolume) => {
			setVolume(newVolume)
		})

		return () => {
			volumeListener()
		}
	}, [getVolume])

	return { volume, updateVolume }
}
