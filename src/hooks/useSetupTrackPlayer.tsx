import { AudioPlayer } from '@/constants/playbackService'
import { useEffect, useRef } from 'react'

const setupPlayer = async () => {
	try {
		// Set initial volume
		await AudioPlayer.setVolume(0.3)

		// Set default repeat mode (false = no repeat)
		await AudioPlayer.setRepeatMode(false)

		return true
	} catch (error) {
		console.error('Error setting up audio player:', error)
		return false
	}
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
	const isInitialized = useRef(false)

	useEffect(() => {
		if (isInitialized.current) return

		let mounted = true

		const setup = async () => {
			try {
				const isSetup = await setupPlayer()

				if (mounted && isSetup) {
					isInitialized.current = true
					onLoad?.()
				}
			} catch (error) {
				console.error('Failed to setup AudioPlayer', error)
			}
		}

		setup()

		return () => {
			mounted = false
		}
	}, [onLoad])
}
