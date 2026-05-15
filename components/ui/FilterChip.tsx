import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
      ]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipIdle: { backgroundColor: colors.white, borderColor: colors.lightGray },
  text: { fontWeight: '600', fontSize: 12, color: colors.darkGray },
  textActive: { color: colors.white },
});
