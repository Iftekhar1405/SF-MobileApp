import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function CategoryChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}>
      <Text
        style={[styles.text, active && styles.textActive]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: SPACING.sm,
    maxWidth: 160,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: { opacity: 0.85 },
  text: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.darkGray,
  },
  textActive: { color: colors.white },
});
