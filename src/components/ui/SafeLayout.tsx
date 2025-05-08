import { StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SafeLayoutProps {
	children: React.ReactNode
	style?: ViewStyle
	noTopInset?: boolean
	noBottomInset?: boolean
}

export const SafeLayout = ({
	children,
	style,
	noTopInset = false,
	noBottomInset = false,
}: SafeLayoutProps) => {
	const insets = useSafeAreaInsets()

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: noTopInset ? 0 : insets.top,
					paddingBottom: noBottomInset ? 0 : insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
				style,
			]}
		>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
