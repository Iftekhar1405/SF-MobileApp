import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = { label: string; variant?: 'success' | 'warning' | 'error' | 'muted' };

export function Badge({ label, variant = 'success' }: Props) {
  const palette =
    variant === 'warning'
      ? { bg: '#FFF3E0', fg: colors.warning }
      : variant === 'error'
        ? { bg: '#FFEBEE', fg: colors.error }
        : variant === 'muted'
          ? { bg: colors.lightGray, fg: colors.mediumGray }
          : { bg: '#E8F5E9', fg: colors.success };
  return (
    <View style={[styles.wrap, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  text: { fontSize: 11, fontWeight: '700' },
});
