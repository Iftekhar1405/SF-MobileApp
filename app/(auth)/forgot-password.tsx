import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { authCardEnter, authFooterEnter } from '@/components/auth/authAnimations';
import { AuthBrandHeader } from '@/components/auth/AuthBrandHeader';
import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { authFormStyles as formStyles } from '@/components/auth/authFormStyles';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <AuthScreenShell centered>
      <AuthBrandHeader subtitle="Account recovery" />

      <Animated.View entering={authCardEnter}>
        <AuthGlassCard>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.copy}>
            OTP reset is not enabled on the API yet. Please contact support or use
            the web portal.
          </Text>
        </AuthGlassCard>
      </Animated.View>

      <Animated.View entering={authFooterEnter}>
        <Pressable onPress={() => router.back()}>
          <Text style={formStyles.footerLink}>Back to sign in</Text>
        </Pressable>
      </Animated.View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.md,
    color: colors.darkGray,
    textAlign: 'center',
  },
  copy: {
    color: colors.mediumGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
