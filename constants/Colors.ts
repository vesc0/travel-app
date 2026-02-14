/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    surface: '#f0f0f0',
    surfaceAlt: '#e0e0e0',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    accent: '#00bfa5',
    accentDark: '#0a7f6f',
    border: '#eee',
    textSecondary: '#666',
    textMuted: '#888',
    placeholder: '#aaa',
    searchIcon: '#888',
    chartBackground: '#e0e0e0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    surface: '#333',
    surfaceAlt: '#333',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    accent: '#00bfa5',
    accentDark: '#0a7f6f',
    border: 'rgba(150, 150, 150, 0.2)',
    textSecondary: '#999',
    textMuted: '#888',
    placeholder: '#999',
    searchIcon: '#999',
    chartBackground: '#333333',
  },
  /** Shared semantic colors that don't change with theme */
  shared: {
    headerDarkBg: '#121212',
  },
};
