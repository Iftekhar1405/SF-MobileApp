import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  inStockOnly: boolean;
  onChange: (inStockOnly: boolean) => void;
};

export function StockSegmentedControl({ inStockOnly, onChange }: Props) {
  return (
    <View style={styles.track}>
      <Pressable
        onPress={() => onChange(false)}
        style={({ pressed }) => [
          styles.segment,
          !inStockOnly && styles.segmentActive,
          pressed && styles.segmentPressed,
        ]}>
        <Text style={[styles.label, !inStockOnly && styles.labelActive]}>ALL</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange(true)}
        style={({ pressed }) => [
          styles.segment,
          inStockOnly && styles.segmentActive,
          pressed && styles.segmentPressed,
        ]}>
        <Text style={[styles.label, inStockOnly && styles.labelActive]}>IN STOCK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.white,
    padding: 3,
    minHeight: 40,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  segmentActive: {
    backgroundColor: colors.primaryTint,
  },
  segmentPressed: { opacity: 0.9 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.mediumGray,
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
});
