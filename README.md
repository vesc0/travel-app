# Travel Map App

A React Native mobile application for tracking visited countries with interactive maps and statistics.

## Contents

- [Features](#features)  
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Built with](#built-with)

## Features

- Interactive world map with country highlighting
- Country selection interface with search functionality
- Travel statistics and analytics
- Continental breakdown with visual charts
- Dark/Light theme support
- Cross-platform (iOS & Android)

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- iOS: XCode (for iOS development)
- Android: Android Studio (for Android development)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

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

4. Run on iOS/Android
```bash
# For iOS
npm run ios

# For Android
npm run android
```

### Environment Setup

For Android, add your Google Maps API key in `app.json`:
```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}
```

## Architecture

### Tech Stack
- React Native
- Expo Router for navigation
- React Native Maps for mapping
- React Native Chart Kit for statistics visualization
- Context API for state management

### Project Structure
```
travel-app/
├── app/                  # Main application routes
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── map.tsx       # World map view
│   │   ├── select.tsx    # Country selection
│   │   └── stats.tsx     # Statistics view
├── components/           # Reusable components
├── constants/            # App constants and configuration
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
└── assets/               # Images, fonts, and other static files
```

## Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [React Native Maps](https://github.com/react-native-maps/react-native-maps) - Mapping solution
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - Statistical visualizations