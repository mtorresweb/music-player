import { AudioPlayer, Track } from '@/constants/playbackService'
import { useFavorites } from '@/store/library'
import { useQueue } from '@/store/queue'
import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { PropsWithChildren } from 'react'
import { match } from 'ts-pattern'

type TrackShortcutsMenuProps = PropsWithChildren<{ track: Track }>

export const TrackShortcutsMenu = ({ track, children }: TrackShortcutsMenuProps) => {
	const router = useRouter()

	const isFavorite = track.rating === 1

	const { toggleTrackFavorite } = useFavorites()
	const { activeQueueId } = useQueue()

	const handlePressAction = (id: string) => {
		match(id)
			.with('add-to-favorites', async () => {
				toggleTrackFavorite(track)

				// if the tracks is in the favorite queue, add it
				if (activeQueueId?.startsWith('favorites')) {
					await AudioPlayer.add(track)
				}
			})
			.with('remove-from-favorites', async () => {
				toggleTrackFavorite(track)

				// if the track is in the favorites queue, we need to remove it
				if (activeQueueId?.startsWith('favorites')) {
					const queue = AudioPlayer.getQueue()

					const trackToRemove = queue.findIndex((queueTrack) => queueTrack.url === track.url)

					if (trackToRemove !== -1) {
						await AudioPlayer.remove(track.id)
					}
				}
			})
			.with('add-to-playlist', () => {
				// it opens the addToPlaylist modal
				// @ts-expect-error it should work
				router.push({ pathname: '(modals)/addToPlaylist', params: { trackUrl: track.url } })
			})
			.otherwise(() => console.warn(`Unknown menu action ${id}`))
	}

	return (
		<MenuView
			onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
			actions={[
				{
					id: isFavorite ? 'remove-from-favorites' : 'add-to-favorites',
					title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
					image: isFavorite ? 'star.fill' : 'star',
				},
				{
					id: 'add-to-playlist',
					title: 'Add to playlist',
					image: 'plus',
				},
			]}
		>
			{children}
		</MenuView>
	)
}
