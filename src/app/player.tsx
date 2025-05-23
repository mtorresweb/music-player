import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { SafeLayout } from '@/components/ui/SafeLayout'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { useActiveTrack } from '@/hooks/useActiveTrack'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { useTrackPlayerFavorite } from '@/hooks/useTrackPlayerFavorite'
import { defaultStyles, utilsStyles } from '@/styles'
import { FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PlayerScreen = () => {
	const activeTrack = useActiveTrack()
	const { imageColors } = usePlayerBackground(activeTrack?.artwork ?? unknownTrackImageUri)
	const { isFavorite, toggleFavorite } = useTrackPlayerFavorite()
	const insets = useSafeAreaInsets()

	if (!activeTrack) {
		return (
			<SafeLayout style={{ justifyContent: 'center' }}>
				<ActivityIndicator color={colors.icon} />
			</SafeLayout>
		)
	}

	return (
		<SafeLayout style={{ padding: 0 }}>
			<LinearGradient
				style={{ flex: 1 }}
				colors={
					imageColors
						? [imageColors.background, imageColors.primary]
						: [colors.background, colors.background]
				}
			>
				<View
					style={[
						styles.overlayContainer,
						{
							paddingTop: insets.top,
							paddingBottom: insets.bottom,
							paddingLeft: insets.left + screenPadding.horizontal,
							paddingRight: insets.right + screenPadding.horizontal,
						},
					]}
				>
					<DismissPlayerSymbol />

					<View style={{ flex: 1, marginTop: 70 }}>
						<View style={styles.artworkImageContainer}>
							<Image
								source={{
									uri: activeTrack.artwork ?? unknownTrackImageUri,
								}}
								contentFit="cover"
								transition={300}
								style={styles.artworkImage}
							/>
						</View>

						<View style={{ flex: 1 }}>
							<View style={{ marginTop: 'auto' }}>
								<View style={{ height: 60 }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										{/* Track title */}
										<View style={styles.trackTitleContainer}>
											<MovingText
												text={activeTrack.title ?? ''}
												animationThreshold={30}
												style={styles.trackTitleText}
											/>
										</View>

										{/* Favorite button icon */}
										<FontAwesome
											name={isFavorite ? 'heart' : 'heart-o'}
											size={20}
											color={isFavorite ? colors.primary : colors.icon}
											style={{ marginHorizontal: 14 }}
											onPress={toggleFavorite}
										/>
									</View>

									{/* Track artist */}
									{activeTrack.artist && (
										<Text numberOfLines={1} style={[styles.trackArtistText, { marginTop: 6 }]}>
											{activeTrack.artist}
										</Text>
									)}
								</View>

								<PlayerProgressBar style={{ marginTop: 32 }} />

								<PlayerControls style={{ marginTop: 40 }} />
							</View>

							<PlayerVolumeBar style={{ marginTop: 'auto', marginBottom: 30 }} />

							<View style={utilsStyles.centeredRow}>
								<PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
							</View>
						</View>
					</View>
				</View>
			</LinearGradient>
		</SafeLayout>
	)
}

const DismissPlayerSymbol = () => {
	const { top } = useSafeAreaInsets()

	return (
		<View
			style={{
				position: 'absolute',
				top: 8,
				left: 0,
				right: 0,
				flexDirection: 'row',
				justifyContent: 'center',
			}}
		>
			<View
				accessible={false}
				style={{
					width: 50,
					height: 8,
					borderRadius: 8,
					backgroundColor: '#fff',
					opacity: 0.7,
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	overlayContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	artworkImageContainer: {
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 12,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: 22,
		fontWeight: '700',
	},
	trackArtistText: {
		...defaultStyles.text,
		fontSize: fontSize.base,
		opacity: 0.8,
		maxWidth: '90%',
	},
})

export default PlayerScreen
