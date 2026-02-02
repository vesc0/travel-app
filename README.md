# Travel Map App

A React Native mobile application for tracking visited countries with maps and statistics.

## Contents

- [Features](#features)  
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Built With](#built-with)
- [Development](#development)
- [Screenshots](#screenshots)

## Features

- **World Map** - Visualize visited countries on a zoomable map
- **Country Selection** - Search and select countries from a comprehensive list with flags
- **Travel Statistics** - View travel progress with detailed analytics
- **Continental Breakdown** - See travel patterns across different continents
- **Dark/Light Theme** - Automatic theme support based on device settings
- **Cross-platform** - Works on iOS, Android, and Web
- **Persistent Storage** - Saves travel data locally
- **Visual Charts** - Chart-based representation of your travel statistics

## Getting Started

### Prerequisites

- **Node.js** (v16 or newer)
- **npm** or **yarn**
- **iOS**: Xcode (for iOS development)
- **Android**: Android Studio (for Android development)
- **Expo CLI**: [Installation guide](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository
```bash
git clone https://github.com/vesc0/travel-app.git
cd travel-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your device/simulator

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

## Project Structure

```
travel-app/
├── app/                      # Expo Router app directory
│   ├── (tabs)/               # Tabbed navigation screens
│   │   ├── map.tsx           # Interactive map screen
│   │   ├── profile.tsx       # User profile screen
│   │   └── stats.tsx         # Statistics screen
│   ├── _layout.tsx           # Root layout
│   └── index.tsx             # Home screen
├── components/               # Reusable React components
│   ├── SimpleWorldMap.tsx    # Map visualization component
│   ├── CountryItem.tsx       # Country list item component
│   └── ui/                   # UI components
├── contexts/                 # React Context API
│   └── CountryContext.tsx    # Country state management
├── hooks/                    # Custom React hooks
│   ├── useColorScheme.ts     # Theme hook
│   └── useDebounce.ts        # Debounce hook
├── constants/                # App constants
│   ├── Colors.ts             # Color palette
│   ├── Continents.ts         # Continent data
│   └── CountryCoordinates.ts # Country coordinates
├── utils/                    # Utility functions
│   └── flagUtils.ts          # Flag emoji utilities
├── assets/                   # Static assets
│   ├── world-*.json          # TopoJSON map data
│   ├── fonts/                # Custom fonts
│   └── images/               # App images
└── scripts/                  # Build and utility scripts
```

## Architecture

The app uses a modern React Native architecture with:

- **Expo Router** for file-based routing
- **React Context API** for state management
- **React Native Maps** for map visualization
- **AsyncStorage** for persistent data
- **React Native Chart Kit** for statistics visualization
- **TopoJSON** for geographical data

### Data Flow

1. **Map Screen** - Displays world map with country highlighting
2. **Profile Screen** - Shows user preferences
3. **Stats Screen** - Displays travel statistics and continental breakdowns
4. **Country Context** - Centralized state management for selected countries

## Built With

- **React Native** (v0.81.4)
- **React** (v19.1.0)
- **Expo** (v54.0.8)
- **React Navigation** (v7.x)
- **React Native Maps** (v1.20.1)
- **React Native Chart Kit** (v6.12.0)
- **TopoJSON Client** (v3.1.0)
- **TypeScript** (v5.x)

## Development

### Available Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Lint code
npm run lint

# Reset project to initial state
npm run reset-project
```

### Code Quality

The project uses ESLint for code quality. Run the linter with:
```bash
npm run lint
```

### Configuration Files

- **app.json** - Expo configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.js** - ESLint rules
- **babel.config.js** - Babel configuration
- **eas.json** - Expo Application Services configuration

### Environment Setup

For Android Google Maps integration, update your API key in `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

### Mobile App Configuration

The app is configured for:
- **Package Name**: `com.vesc0.TravelApp`
- **Version**: 1.1.0
- **Orientation**: Portrait
- **Min iOS Version**: Configured in app.json
- **Target Android**: Android 8.0+

### Data

The app uses TopoJSON format for geographical data:
- **world-110m.json** - High-resolution world map
- **world-50m.json** - Medium-resolution world map

## Screenshots

<p align="center">
  <img src="screenshots/map.png" alt="map" width="300">
</p>

<p align="center">
  <img src="screenshots/select.png" alt="select" width="300">
</p>

<p align="center">
  <img src="screenshots/stats.png" alt="stats" width="300">
</p>