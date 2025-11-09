import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
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
        <Stack.Screen name="add-amenity" options={{ headerShown: false }} />
        <Stack.Screen name="edit-amenity" options={{ headerShown: false }} />
        <Stack.Screen name="add-charger" options={{ headerShown: false }} />
        <Stack.Screen name="edit-charger" options={{ headerShown: false }} />
        <Stack.Screen name="reservation-details" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
