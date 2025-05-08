import { FloatingPlayer } from '@/components/FloatingPlayer'
import { SafeLayout } from '@/components/ui/SafeLayout'
import { colors, fontSize } from '@/constants/tokens'
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabsNavigation = () => {
	const insets = useSafeAreaInsets()

	return (
		<SafeLayout noBottomInset>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: colors.primary,
					tabBarLabelStyle: {
						fontSize: fontSize.xs,
						fontWeight: '500',
					},
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 8,
						height: 60 + insets.bottom,
						paddingBottom: insets.bottom,
						backgroundColor: 'rgba(30, 30, 30, 0.85)', // Añadiendo un fondo semi-opaco
					},
					tabBarBackground: () => (
						<View
							style={{
								...StyleSheet.absoluteFillObject,
								overflow: 'hidden',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
							}}
						>
							{/* Capa base con color más opaco */}
							<View
								style={{
									...StyleSheet.absoluteFillObject,
									backgroundColor: 'rgba(20, 20, 20, 0.8)',
								}}
							/>

							{/* Capa de blur encima con menor intensidad */}
							<BlurView
								intensity={35} // Reducida de 95 a 35 para menor transparencia
								style={{
									...StyleSheet.absoluteFillObject,
								}}
							/>
						</View>
					),
				}}
			>
				<Tabs.Screen
					name="favorites"
					options={{
						title: 'Favorites',
						tabBarIcon: ({ color }) => <FontAwesome name="heart" size={20} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="playlists"
					options={{
						title: 'Playlists',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="playlist-play" size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="(songs)"
					options={{
						title: 'Songs',
						tabBarIcon: ({ color }) => (
							<Ionicons name="musical-notes-sharp" size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="artists"
					options={{
						title: 'Artists',
						tabBarIcon: ({ color }) => <FontAwesome6 name="users-line" size={20} color={color} />,
					}}
				/>
			</Tabs>

			<FloatingPlayer
				style={{
					position: 'absolute',
					left: 8 + insets.left,
					right: 8 + insets.right,
					bottom: 78 + insets.bottom,
				}}
			/>
		</SafeLayout>
	)
}

export default TabsNavigation
