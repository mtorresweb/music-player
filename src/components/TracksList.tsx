import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { AudioPlayer, Track } from '@/constants/playbackService'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { Image } from 'expo-image'
import { FlatList, FlatListProps, Text, View } from 'react-native'
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
	const { activeQueueId, setActiveQueueId } = useQueue()

	const handleTrackSelect = async (selectedTrack: Track) => {
		const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

		if (trackIndex === -1) return

		// Check if we're changing queue or selecting within the same queue
		const isChangingQueue = id !== activeQueueId

		if (isChangingQueue) {
			// We're changing to a new queue
			// Reset the player and build a new queue
			await AudioPlayer.reset()

			// Add all tracks to the queue in order
			for (const track of tracks) {
				await AudioPlayer.add(track)
			}

			// Set the active queue ID
			setActiveQueueId(id)

			// Jump directly to the selected track by index
			await AudioPlayer.skipToIndex(trackIndex)

			// Play the selected track
			await AudioPlayer.play()
		} else {
			// We're selecting a track within the same queue
			// Get the current queue
			const queue = AudioPlayer.getQueue()

			// Find the selected track in the queue by URL
			const selectedIndex = queue.findIndex((t) => t.url === selectedTrack.url)

			if (selectedIndex !== -1) {
				// Jump directly to the selected track
				await AudioPlayer.skipToIndex(selectedIndex)

				// Play the track
				await AudioPlayer.play()
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

					<Image source={{ uri: unknownTrackImageUri }} style={utilsStyles.emptyContentImage} />
				</View>
			}
			renderItem={({ item: track }) => (
				<TracksListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
			{...flatlistProps}
		/>
	)
}
