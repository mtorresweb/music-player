import { BlurView } from 'expo-blur'
import React, { useState } from 'react'
import {
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'

type Action = {
	id: string
	title: string
	image?: string
}

type ContextMenuProps = {
	actions: Action[]
	onPressAction: (event: { nativeEvent: { event: string } }) => void
	children: React.ReactNode
}

export const ContextMenu = ({ actions, onPressAction, children }: ContextMenuProps) => {
	const [visible, setVisible] = useState(false)
	const [position, setPosition] = useState({ top: 0, left: 0 })

	const handlePress = (e: any) => {
		// Get touch position for menu placement
		setPosition({
			top: e.nativeEvent.pageY,
			left: e.nativeEvent.pageX,
		})
		setVisible(true)
	}

	const handleActionPress = (id: string) => {
		onPressAction({ nativeEvent: { event: id } })
		setVisible(false)
	}

	return (
		<>
			<TouchableOpacity onLongPress={handlePress} delayLongPress={500}>
				{children}
			</TouchableOpacity>

			<Modal
				transparent
				visible={visible}
				animationType="fade"
				onRequestClose={() => setVisible(false)}
			>
				<TouchableWithoutFeedback onPress={() => setVisible(false)}>
					<View style={styles.modalOverlay}>
						<BlurView intensity={30} style={styles.blur}>
							<View
								style={[
									styles.menuContainer,
									{
										top: position.top,
										left: position.left,
									},
								]}
							>
								{actions.map((action) => (
									<TouchableOpacity
										key={action.id}
										style={styles.menuItem}
										onPress={() => handleActionPress(action.id)}
									>
										<Text style={styles.menuText}>{action.title}</Text>
									</TouchableOpacity>
								))}
							</View>
						</BlurView>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
	},
	blur: {
		flex: 1,
	},
	menuContainer: {
		position: 'absolute',
		backgroundColor: '#2A2A2A',
		borderRadius: 10,
		padding: 4,
		minWidth: 150,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	menuItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	menuText: {
		color: 'white',
		fontSize: 16,
	},
})
