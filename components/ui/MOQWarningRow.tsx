import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

type Props = {
  categoryName: string;
  minQty: number;
  cartQty: number;
  isViolating: boolean;
};

export function MOQWarningRow({
  categoryName,
  minQty,
  cartQty,
  isViolating,
}: Props) {
  return (
    <View style={[styles.row, isViolating && styles.rowBad]}>
      <Text style={styles.name}>
        {isViolating ? '⚠ ' : ''}
        {categoryName}
      </Text>
      <Text style={styles.cell}>{minQty}</Text>
      <Text style={styles.cell}>{cartQty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  rowBad: { backgroundColor: '#FFF5F5' },
  name: { flex: 2, fontWeight: '600', color: colors.darkGray },
  cell: { flex: 1, textAlign: 'center', color: colors.mediumGray },
});
