import { Colors } from '@/constants/Colors';
import { CountryProvider } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

const isWeb = Platform.OS === 'web';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), });

  // Sync web HTML/body background with theme
  useEffect(() => {
    if (!isWeb) return;
    const bg = isDark ? Colors.dark.background : Colors.light.background;
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    document.body.style.margin = '0';
    // Smooth color-scheme transition
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <CountryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: isWeb ? 'transparentModal' : 'modal',
              headerShown: !isWeb,
              headerTitle: 'Select Countries',
              headerStyle: {
                backgroundColor: isDark ? Colors.shared.headerDarkBg : Colors.light.background,
              },
              headerTintColor: Colors[colorScheme ?? 'light'].text,
              animation: isWeb ? 'fade' : 'default',
              contentStyle: isWeb ? { backgroundColor: 'transparent' } : undefined,
            }}
          />
        </Stack>
      </CountryProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
