import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'

type AudioVisualizerProps = {
	color: string
	style?: any
}

export const AudioVisualizer = ({ color, style }: AudioVisualizerProps) => {
	// Create shared values for each bar
	const bar1Height = useSharedValue(3)
	const bar2Height = useSharedValue(3)
	const bar3Height = useSharedValue(3)
	const bar4Height = useSharedValue(3)
	const bar5Height = useSharedValue(3)

	useEffect(() => {
		// Animate each bar with different timings to create the audio visualizer effect
		bar1Height.value = withRepeat(
			withTiming(10, { duration: 500, easing: Easing.linear }),
			-1,
			true,
		)

		bar2Height.value = withDelay(
			100,
			withRepeat(withTiming(12, { duration: 400, easing: Easing.linear }), -1, true),
		)

		bar3Height.value = withDelay(
			200,
			withRepeat(withTiming(14, { duration: 450, easing: Easing.linear }), -1, true),
		)

		bar4Height.value = withDelay(
			150,
			withRepeat(withTiming(9, { duration: 550, easing: Easing.linear }), -1, true),
		)

		bar5Height.value = withDelay(
			250,
			withRepeat(withTiming(11, { duration: 500, easing: Easing.linear }), -1, true),
		)
	}, [])

	// Create animated styles for each bar
	const bar1Style = useAnimatedStyle(() => ({
		height: bar1Height.value,
	}))

	const bar2Style = useAnimatedStyle(() => ({
		height: bar2Height.value,
	}))

	const bar3Style = useAnimatedStyle(() => ({
		height: bar3Height.value,
	}))

	const bar4Style = useAnimatedStyle(() => ({
		height: bar4Height.value,
	}))

	const bar5Style = useAnimatedStyle(() => ({
		height: bar5Height.value,
	}))

	return (
		<View style={[styles.container, style]}>
			<Animated.View style={[styles.bar, bar1Style, { backgroundColor: color }]} />
			<Animated.View style={[styles.bar, bar2Style, { backgroundColor: color }]} />
			<Animated.View style={[styles.bar, bar3Style, { backgroundColor: color }]} />
			<Animated.View style={[styles.bar, bar4Style, { backgroundColor: color }]} />
			<Animated.View style={[styles.bar, bar5Style, { backgroundColor: color }]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 16,
		width: 16,
		gap: 1,
	},
	bar: {
		width: 2,
		backgroundColor: 'white',
		borderRadius: 1,
	},
})
