import type { ReactNode } from 'react';
import { useRef } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthAmbientBackground } from '@/components/auth/AuthAmbientBackground';
import { AuthScrollContext } from '@/components/auth/AuthScrollContext';
import { SPACING } from '@/constants/theme';

type Props = {
  children: ReactNode;
  /** Vertically center the auth block on screen (default: true). */
  centered?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function AuthScreenShell({
  children,
  centered = true,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const windowHeight = Dimensions.get('window').height;
  const minContentHeight =
    windowHeight - insets.top - insets.bottom - SPACING.md;

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <AuthAmbientBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
        <AuthScrollContext.Provider value={scrollRef}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.scroll,
              centered && [
                styles.scrollCentered,
                { minHeight: minContentHeight },
              ],
              { paddingBottom: insets.bottom + SPACING.xl + 120 },
              contentStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            {centered ? (
              <View style={styles.centerBlock}>{children}</View>
            ) : (
              children
            )}
          </ScrollView>
        </AuthScrollContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  scrollCentered: {
    justifyContent: 'center',
  },
  centerBlock: {
    width: '100%',
    justifyContent: 'center',
  },
});
