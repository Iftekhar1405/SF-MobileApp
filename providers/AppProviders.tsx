import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
          },
        },
      })
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <QueryClientProvider client={client}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
