import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { SPACING } from '@/constants/theme';
import { colors } from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.body}>
        OTP reset is not enabled on the API yet. Please contact support or use
        the web portal.
      </Text>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, padding: SPACING.lg, backgroundColor: colors.offWhite },
  title: { fontSize: 20, fontWeight: '800', marginBottom: SPACING.md },
  body: { color: colors.mediumGray, marginBottom: SPACING.lg },
  link: { color: colors.primary, fontWeight: '700' },
});
