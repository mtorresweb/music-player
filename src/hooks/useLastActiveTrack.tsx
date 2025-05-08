import { Track } from '@/constants/playbackService'
import { useActiveTrack } from '@/hooks/useActiveTrack'
import { useEffect, useState } from 'react'

export const useLastActiveTrack = () => {
	const activeTrack = useActiveTrack()
	const [lastActiveTrack, setLastActiveTrack] = useState<Track | null>()

	useEffect(() => {
		if (!activeTrack) return

		setLastActiveTrack(activeTrack)
	}, [activeTrack])

	return lastActiveTrack
}
