import { colors } from '@/constants/tokens'
import { useAppStateHandler } from '@/hooks/useAppStateHandler'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// We don't need to register the TrackPlayer service anymore
// since we're using our custom AudioPlayer
// TrackPlayer.registerPlaybackService(() => playbackService)

SplashScreen.preventAutoHideAsync()

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />

			<Stack.Screen
				name="player"
				options={{
					presentation: 'card',
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="(modals)/addToPlaylist"
				options={{
					presentation: 'modal',
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTitle: 'Add to playlist',
					headerTitleStyle: {
						color: colors.text,
					},
				}}
			/>
		</Stack>
	)
}

const App = () => {
	const [isReady, setIsReady] = useState(false)

	// We don't need the TrackPlayer initialization
	// useEffect(() => {
	//   const initializeApp = async () => {
	//     try {
	//       await TrackPlayer.setupPlayer()
	//       console.log('TrackPlayer initialized successfully')
	//     } catch (error) {
	//       if (error instanceof Error &&
	//         error.message &&
	//         !error.message.includes('player is already initialized')) {
	//         console.error('Error initializing TrackPlayer:', error)
	//       }
	//     }
	//   }
	//
	//   initializeApp()
	// }, [])

	const handleTrackPlayerLoaded = useCallback(() => {
		setIsReady(true)
		SplashScreen.hideAsync().catch(console.error)
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPlayerState()

	// Add app state handler to manage audio playback when app changes state
	useAppStateHandler()

	if (!isReady) {
		return null
	}

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />

				<StatusBar style="auto" />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}

export default App
