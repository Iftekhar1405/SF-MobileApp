import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Prominent title for browse sections (e.g. Shop By Category). */
  variant?: 'default' | 'prominent';
};

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  variant = 'default',
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={variant === 'prominent' ? styles.titleProminent : styles.title}>
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.link}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  titleProminent: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.darkGray,
    flex: 1,
    letterSpacing: 0.2,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: SPACING.sm,
  },
});
