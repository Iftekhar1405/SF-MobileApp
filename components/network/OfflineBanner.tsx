import NetInfo from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false || state.isInternetReachable === false);
    });
  }, []);

  if (!offline) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, { paddingTop: insets.top + SPACING.xs }]}>
      <Pressable
        onPress={() => queryClient.refetchQueries({ type: 'active' })}
        style={styles.banner}>
        <Text style={styles.title}>Offline</Text>
        <Text style={styles.message}>Check internet and tap to retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: SPACING.md,
  },
  banner: {
    alignSelf: 'center',
    minWidth: 220,
    borderRadius: 999,
    backgroundColor: colors.darkGray,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    color: colors.white,
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 12,
  },
  message: {
    color: colors.lightGray,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 1,
  },
});
