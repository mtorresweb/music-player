import { AudioEvent, AudioPlayer } from '@/constants/playbackService'
import { useFavorites } from '@/store/library'
import { useCallback, useEffect, useState } from 'react'

export const useTrackPlayerFavorite = () => {
	const [activeTrack, setActiveTrack] = useState(AudioPlayer.getCurrentTrack())

	// Listen for track changes
	useEffect(() => {
		const loadedListener = AudioPlayer.addEventListener(AudioEvent.LoadedData, (track) => {
			setActiveTrack(track)
		})

		return () => {
			loadedListener()
		}
	}, [])

	const { favorites, toggleTrackFavorite } = useFavorites()

	const isFavorite = favorites.find((track) => track.url === activeTrack?.url)?.rating === 1

	// Update application internal state only, as we're not using TrackPlayer anymore
	const toggleFavorite = useCallback(() => {
		if (activeTrack) {
			// Update track metadata in our custom implementation if needed
			// (No direct equivalent to updateMetadataForTrack in our implementation)

			// Update the app internal state
			toggleTrackFavorite(activeTrack)
		}
	}, [isFavorite, toggleTrackFavorite, activeTrack])

	return { isFavorite, toggleFavorite }
}
