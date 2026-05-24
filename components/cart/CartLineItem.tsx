import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { mediaUrl } from '@/services/api';
import type { CartItem, Product } from '@/types/models';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { formatDisplayQty, itemDisplayQty } from '@/utils/cartLines';
import {
  cartItemImageUri,
  formatCartItemLine,
} from '@/utils/productOptions';

type Props = {
  item: CartItem;
  product: Product;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  stepperDisabled?: boolean;
  readonly?: boolean;
};

export function CartLineItem({
  item,
  product,
  onIncrement,
  onDecrement,
  onRemove,
  stepperDisabled,
  readonly = false,
}: Props) {
  const img = cartItemImageUri(product, item.color);
  const lineTotal = item.price * item.quantity;
  const pairsPerCarton = item.itemSet?.[0]?.lengths ?? 0;
  const displayQty = itemDisplayQty(item);

  return (
    <View style={styles.line}>
      <Image
        source={img ? { uri: mediaUrl(img) } : undefined}
        style={styles.thumb}
        contentFit="contain"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {formatCartItemLine(product, item)}
        </Text>
        <Text style={styles.meta}>
          {formatDisplayQty(displayQty)} · {item.quantity} carton
          {item.quantity === 1 ? '' : 's'}
          {pairsPerCarton > 0
            ? ` · ${pairsPerCarton} pairs/carton`
            : ''}
        </Text>
        <Text style={styles.unitPrice}>
          {formatCurrencyINR(item.price)} / carton
        </Text>
        {readonly ? (
          <Text style={[styles.lineTotal, { marginTop: SPACING.sm }]}>
            {formatCurrencyINR(lineTotal)}
          </Text>
        ) : (
          <View style={styles.actions}>
            <QuantityStepper
              value={displayQty}
              disabled={stepperDisabled}
              onIncrement={onIncrement!}
              onDecrement={onDecrement!}
            />
            <Text style={styles.lineTotal}>{formatCurrencyINR(lineTotal)}</Text>
          </View>
        )}
      </View>
      {!readonly && onRemove ? (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.remove}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  thumb: {
    width: 72,
    height: 72,
    backgroundColor: colors.offWhite,
    borderRadius: RADIUS.sm,
  },
  body: { flex: 1, minWidth: 0 },
  title: {
    fontWeight: '800',
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
  },
  meta: {
    color: colors.mediumGray,
    fontSize: 12,
    marginTop: 4,
  },
  unitPrice: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  lineTotal: {
    fontWeight: '900',
    color: colors.darkGray,
    fontSize: 14,
  },
  remove: { alignSelf: 'flex-start', paddingTop: 4 },
});
