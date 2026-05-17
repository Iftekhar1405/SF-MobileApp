import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  onPress: () => void;
  label?: string;
};

export function ShowMoreButton({ onPress, label = 'Show more' }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-down" size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  label: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
