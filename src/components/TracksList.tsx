import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { AudioPlayer, Track } from '@/constants/playbackService'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useRef } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({
	id,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const { activeQueueId, setActiveQueueId } = useQueue()

	const handleTrackSelect = async (selectedTrack: Track) => {
		const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

		if (trackIndex === -1) return

		const isChangingQueue = id !== activeQueueId

		if (isChangingQueue) {
			const beforeTracks = tracks.slice(0, trackIndex)
			const afterTracks = tracks.slice(trackIndex + 1)

			// Reset the player
			await AudioPlayer.reset()

			// We construct the new queue
			// First add the selected track
			await AudioPlayer.add(selectedTrack)

			// Then add tracks after the selected one
			for (const track of afterTracks) {
				await AudioPlayer.add(track)
			}

			// Then add tracks before the selected one (to wrap around)
			for (const track of beforeTracks) {
				await AudioPlayer.add(track)
			}

			await AudioPlayer.play()

			queueOffset.current = trackIndex
			setActiveQueueId(id)
		} else {
			const nextTrackIndex =
				trackIndex - queueOffset.current < 0
					? tracks.length + trackIndex - queueOffset.current
					: trackIndex - queueOffset.current

			// In our AudioPlayer implementation, we need to skip to the specific track
			// Get the current queue
			const queue = AudioPlayer.getQueue()
			if (nextTrackIndex >= 0 && nextTrackIndex < queue.length) {
				// Skip to the right track
				let currentIndex = 0
				// Skip forward
				while (currentIndex < nextTrackIndex) {
					await AudioPlayer.skipToNext()
					currentIndex++
				}
				// Skip backward
				while (currentIndex > nextTrackIndex) {
					await AudioPlayer.skipToPrevious()
					currentIndex--
				}
				AudioPlayer.play()
			}
		}
	}

	return (
		<FlatList
			data={tracks}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No songs found</Text>

					<Image
						source={{ uri: unknownTrackImageUri }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			renderItem={({ item: track }) => (
				<TracksListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
			{...flatlistProps}
		/>
	)
}
