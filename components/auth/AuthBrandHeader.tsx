import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { APP_NAME } from '@/constants/app';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { authLogoEnter, authSubtitleEnter } from '@/components/auth/authAnimations';

const BRAND_LOGO = require('@/assets/images/logo.png');

type Props = {
  subtitle?: string;
};

export function AuthBrandHeader({
  subtitle = 'B2B wholesale ordering',
}: Props) {
  return (
    <View style={styles.wrap}>
      <Animated.View entering={authLogoEnter}>
        <Image
          source={BRAND_LOGO}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel={APP_NAME}
        />
      </Animated.View>
      {subtitle ? (
        <Animated.Text entering={authSubtitleEnter} style={styles.subtitle}>
          {subtitle}
        </Animated.Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 280,
    height: 78,
  },
  subtitle: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: colors.mediumGray,
    fontSize: 14,
  },
});
