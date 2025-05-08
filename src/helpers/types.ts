import { Track } from '@/constants/playbackService'

export type Playlist = {
	name: string
	tracks: Track[]
	artworkPreview: string
}

export type Artist = {
	name: string
	tracks: Track[]
}

export type TrackWithPlaylist = Track & { playlist?: string[] }
