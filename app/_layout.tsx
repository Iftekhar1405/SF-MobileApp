import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  ErrorBoundary,
  Stack,
  SplashScreen,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AppProviders } from '@/providers/AppProviders';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const hydrated = useAuthStore((s) => s.hydrated);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const router = useRouter();
  const segments = useSegments();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (loaded && hydrated) SplashScreen.hideAsync();
  }, [loaded, hydrated]);

  useEffect(() => {
    if (!hydrated || !loaded) return;
    const inAuth = segments[0] === '(auth)';
    if (!token && !inAuth) router.replace('/(auth)/login');
    if (token && inAuth) router.replace('/(tabs)');
  }, [hydrated, loaded, token, segments, router]);

  if (!loaded || !hydrated) return null;

  return (
    <AppProviders>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </ThemeProvider>
    </AppProviders>
  );
}
