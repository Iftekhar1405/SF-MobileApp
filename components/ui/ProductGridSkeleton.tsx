import { Dimensions, StyleSheet, View } from 'react-native';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - SPACING.md * 2 - SPACING.sm * 3) / 2;

type Props = { count?: number };

function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox height={CARD_W - SPACING.sm * 2} style={styles.image} />
      <SkeletonBox height={14} style={styles.line} />
      <SkeletonBox height={14} width="70%" style={styles.line} />
      <View style={styles.row}>
        <SkeletonBox height={22} width={72} style={styles.pill} />
        <SkeletonBox height={16} width={56} />
      </View>
      <SkeletonBox height={36} style={styles.btn} />
    </View>
  );
}

export function ProductGridSkeleton({ count = 6 }: Props) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.cell}>
          <ProductCardSkeleton />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  cell: { width: '50%' },
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    margin: SPACING.xs,
    ...SHADOW.card,
  },
  image: { borderRadius: RADIUS.sm, width: '100%' },
  line: { marginTop: SPACING.sm, borderRadius: RADIUS.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  pill: { borderRadius: RADIUS.pill },
  btn: { marginTop: SPACING.sm, borderRadius: RADIUS.sm },
});
