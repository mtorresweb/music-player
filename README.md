# Music Player

Music Player is a modern and feature-rich music player application built with React Native and Expo. It allows users to browse, play, and manage their music library with a sleek and intuitive interface.

## Features

- **Playlists**: Create and manage playlists to organize your favorite tracks.
- **Favorites**: Mark tracks as favorites for quick access.
- **Artists**: Browse tracks by artists and view their details.
- **Search**: Quickly find songs, playlists, or artists using the search functionality.
- **Audio Player**: Enjoy seamless playback with features like play, pause, skip, shuffle, and repeat.
- **Volume Control**: Adjust the volume directly within the app.
- **Custom Audio Player**: Built using `expo-av` for a smooth and customizable playback experience.
- **Dark Mode**: A visually appealing dark theme for better user experience.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/music-player.git
   cd music-player
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start
   ```

4. Run the app on your device or emulator:
   - For Android: `npm run android`
   - For iOS: `npm run ios`

## Project Structure

The project is organized as follows:

```
src/
  app/          # Application screens and navigation
  components/   # Reusable UI components
  constants/    # App-wide constants (e.g., colors, layout)
  helpers/      # Utility functions and types
  hooks/        # Custom React hooks
  store/        # State management using Zustand
  styles/       # Shared styles
  types/        # TypeScript type definitions
assets/         # Static assets (images, data, etc.)
```

## Technologies Used

- **React Native**: For building the mobile application.
- **Expo**: To streamline development and provide additional tools.
- **Zustand**: For state management.
- **TypeScript**: For type safety and better developer experience.
- **react-native-reanimated**: For smooth animations.
- **expo-av**: For audio playback.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to the open-source community for providing the tools and libraries used in this project.
- Special thanks to [TrackTribe](https://www.tracktribe.com/) and other artists for the demo tracks used in the app.
- This project is based on the repository by [CodeWithGionatha-Labs](https://github.com/CodeWithGionatha-Labs/music-player).
