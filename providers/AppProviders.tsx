import NetInfo from '@react-native-community/netinfo';
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { OfflineBanner } from '@/components/network/OfflineBanner';
import { isNetworkError } from '@/utils/networkError';

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(
      state.isConnected !== false && state.isInternetReachable !== false
    );
  });
});

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) =>
              !isNetworkError(error) && failureCount < 1,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      onlineManager.setOnline(
        state.isConnected !== false && state.isInternetReachable !== false
      );
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <QueryClientProvider client={client}>
        <BottomSheetModalProvider>
          {children}
          <OfflineBanner />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
