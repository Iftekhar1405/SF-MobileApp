import { ScrollView, StyleSheet, View } from 'react-native';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import { SPACING } from '@/constants/theme';

type Props = { count?: number };

export function HorizontalChipsSkeleton({ count = 5 }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBox
          key={i}
          height={36}
          width={72 + (i % 3) * 16}
          style={styles.chip}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  chip: { borderRadius: 999, marginRight: SPACING.sm },
});
