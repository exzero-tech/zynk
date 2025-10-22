import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Inter_24pt-Light': require('../assets/fonts/Inter_24pt-Light.ttf'),
    'Inter_24pt-Regular': require('../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter_24pt-Medium': require('../assets/fonts/Inter_24pt-Medium.ttf'),
    'Inter_24pt-SemiBold': require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter_24pt-Bold': require('../assets/fonts/Inter_24pt-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
