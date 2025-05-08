import { colors } from '@/constants/tokens'
import { useEffect, useState } from 'react'
import ImageColors from 'react-native-image-colors'

// Define the IOSImageColors type directly instead of importing it
type IOSImageColors = {
	background: string
	primary: string
	secondary: string
	detail?: string
}

export const usePlayerBackground = (imageUrl: string) => {
	const [imageColors, setImageColors] = useState<IOSImageColors | null>(null)

	useEffect(() => {
		ImageColors.getColors(imageUrl, {
			fallback: colors.background,
			cache: true,
			key: imageUrl,
		}).then((colors) => setImageColors(colors as IOSImageColors))
	}, [imageUrl])

	return { imageColors }
}
