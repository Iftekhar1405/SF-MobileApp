import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  children: ReactNode;
};

/**
 * Frosted glass card (no native BlurView — works in Expo Go and all builds).
 * Layered translucent white reads as glass over the ambient background.
 */
export function AuthGlassCard({ children }: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.frostDeep} pointerEvents="none" />
      <View style={styles.frostMid} pointerEvents="none" />
      <View style={styles.edgeHighlight} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const GLASS_BORDER = 'rgba(255, 255, 255, 0.92)';

const styles = StyleSheet.create({
  outer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  frostDeep: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  frostMid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 249, 252, 0.4)',
  },
  edgeHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.98)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    padding: SPACING.lg,
    zIndex: 1,
  },
});
