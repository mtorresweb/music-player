import { AudioPlayer } from '@/constants/playbackService'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

/**
 * Hook to handle app state changes and manage audio playback accordingly
 */
export const useAppStateHandler = () => {
	useEffect(() => {
		const handleAppStateChange = async (nextAppState: AppStateStatus) => {
			// When app comes to the foreground (active)
			if (nextAppState === 'active') {
				// Check if audio player thinks it's playing but audio might be paused by system
				if (AudioPlayer.getPlayerState().isPlaying) {
					const status = await AudioPlayer.getActualPlaybackStatus()

					// If the player thinks it's playing but actual playback is paused
					if (
						status &&
						status.isLoaded &&
						!status.isPlaying &&
						AudioPlayer.getPlayerState().isPlaying
					) {
						// Restart playback
						await AudioPlayer.play()
					}
				}
			}
		}

		// Subscribe to app state changes
		const subscription = AppState.addEventListener('change', handleAppStateChange)

		return () => {
			subscription.remove()
		}
	}, [])
}
