import { AudioPlayer } from '@/constants/playbackService'
import { useCallback, useEffect, useState } from 'react'

// Simple enum to match the TrackPlayer RepeatMode
export enum RepeatMode {
	Off = 0,
	Queue = 1,
	Track = 2,
}

export const useTrackPlayerRepeatMode = () => {
	// Convert boolean isLooping to our RepeatMode enum
	const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off)

	const changeRepeatMode = useCallback(async (mode: RepeatMode) => {
		// In our simplified implementation, we only support Off (false) and Track (true) repeat modes
		const isLooping = mode === RepeatMode.Track
		await AudioPlayer.setRepeatMode(isLooping)

		setRepeatMode(isLooping ? RepeatMode.Track : RepeatMode.Off)
	}, [])

	useEffect(() => {
		// Get the current repeat mode from AudioPlayer
		const isLooping = AudioPlayer.getRepeatMode()
		setRepeatMode(isLooping ? RepeatMode.Track : RepeatMode.Off)
	}, [])

	return { repeatMode, changeRepeatMode }
}
