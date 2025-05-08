import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { colors } from './tokens'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	headerLargeTitle: true,
	headerLargeStyle: {
		backgroundColor: colors.background,
	},
	headerLargeTitleStyle: {
		color: colors.text,
	},
	headerTintColor: colors.text,
	// Cambiado a false para proporcionar un efecto sticky
	headerTransparent: false,
	headerBlurEffect: 'prominent',
	headerShadowVisible: false,
	// Añadimos un efecto de sombra sutil cuando se hace scroll
	headerStyle: {
		backgroundColor: colors.background,
	},
	// Configuración para respetar áreas seguras
	statusBarStyle: Platform.OS === 'ios' ? 'dark' : 'light',
	statusBarTranslucent: true,
	contentStyle: {
		paddingBottom: 0,
	},
}
