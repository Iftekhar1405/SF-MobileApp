import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

const HEADER_ROW_HEIGHT = 48;

type Props = {
  cartCount?: number;
  onMenuPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Fixed tab header — same position on Home, Shop, and Payment. */
export function TabScreenHeader({
  cartCount = 0,
  onMenuPress,
  children,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shell, { paddingTop: insets.top }, style]}>
      <View style={styles.headerRow}>
        <AppHeader cartCount={cartCount} onMenuPress={onMenuPress} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
  headerRow: {
    height: HEADER_ROW_HEIGHT,
    justifyContent: 'center',
  },
});
