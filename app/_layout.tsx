import { CountryProvider } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CountryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Select Countries',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
              },
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#000'
            }}
          />
        </Stack>
      </CountryProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
