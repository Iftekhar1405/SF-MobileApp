import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';
import {
  PRODUCT_SORT_OPTIONS,
  type ProductSortOption,
} from '@/utils/sortProducts';

type Props = {
  visible: boolean;
  value: ProductSortOption;
  onSelect: (sort: ProductSortOption) => void;
  onClose: () => void;
};

export function ProductSortMenu({ visible, value, onSelect, onClose }: Props) {
  const nameOptions = PRODUCT_SORT_OPTIONS.filter((o) => o.section === 'name');
  const priceOptions = PRODUCT_SORT_OPTIONS.filter((o) => o.section === 'price');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.menu} onPress={(e) => e.stopPropagation()}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Sort by</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.mediumGray} />
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>Name (article)</Text>
          {nameOptions.map((opt) => (
            <SortRow
              key={opt.key}
              label={opt.label}
              selected={value === opt.key}
              onPress={() => {
                onSelect(opt.key);
                onClose();
              }}
            />
          ))}

          <Text style={[styles.sectionLabel, styles.sectionGap]}>Price</Text>
          {priceOptions.map((opt) => (
            <SortRow
              key={opt.key}
              label={opt.label}
              selected={value === opt.key}
              onPress={() => {
                onSelect(opt.key);
                onClose();
              }}
            />
          ))}

          {value !== 'default' ? (
            <Pressable
              style={styles.clearBtn}
              onPress={() => {
                onSelect('default');
                onClose();
              }}>
              <Text style={styles.clearText}>Clear sort</Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SortRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}>
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>
        {label}
      </Text>
      {selected ? (
        <Ionicons name="checkmark" size={18} color={colors.primary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: 180,
    paddingHorizontal: SPACING.md,
  },
  menu: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.darkGray,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.mediumGray,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  sectionGap: { marginTop: SPACING.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  rowSelected: { backgroundColor: colors.offWhite },
  rowPressed: { opacity: 0.85 },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
  },
  rowLabelSelected: {
    color: colors.primary,
    fontWeight: '800',
  },
  clearBtn: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mediumGray,
  },
});
