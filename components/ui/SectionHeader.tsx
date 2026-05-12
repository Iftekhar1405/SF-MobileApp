import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/Colors';
import { SPACING } from '@/constants/theme';

type Props = { title: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
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
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13 },
});
