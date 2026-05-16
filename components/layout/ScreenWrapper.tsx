import { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function ScreenWrapper({
  children,
  scroll,
  refreshing,
  onRefresh,
  style,
  edges = ['top', 'left', 'right'],
}: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={edges}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
            ) : undefined
          }>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <View style={styles.flex}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  flex: { flex: 1, paddingHorizontal: SPACING.md },
  scrollContent: { paddingBottom: SPACING.xl, paddingHorizontal: SPACING.md },
});
