import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { Product } from '@/types/models';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { mediaUrl } from '@/services/api';
import { Badge } from './Badge';
import { Button } from './Button';
import { QuantityStepper } from './QuantityStepper';
import { getStockLevel, stockPillColors } from '@/utils/stockStatus';
import { estimateStockUnits, optionCount } from '@/utils/productOptions';

type Props = {
  product: Product;
  cartQty: number;
  onOpenOptions: () => void;
  onAddSingle: () => void;
  onChangeQty: (next: number) => void;
};

export function ProductCard({
  product,
  cartQty,
  onOpenOptions,
  onAddSingle,
  onChangeQty,
}: Props) {
  const img = mediaUrl(product.images?.[0]);
  const opts = optionCount(product);
  const stockUnits = estimateStockUnits(product);
  const level = getStockLevel(stockUnits, product.inStock);
  const pill = stockPillColors(level);
  const name = `${product.brand} | ${product.category ?? ''} | Carton`.trim();

  return (
    <View style={styles.card}>
      {product.material ? (
        <View style={styles.badgeWrap}>
          <Badge label={product.material.toUpperCase()} variant="muted" />
        </View>
      ) : null}
      <Pressable onPress={onOpenOptions}>
        <Image
          source={img ? { uri: img } : undefined}
          style={styles.image}
          contentFit="contain"
        />
      </Pressable>
      <Text numberOfLines={2} style={styles.title}>
        {name}
      </Text>
      <View style={styles.row}>
        <View style={[styles.stockPill, { backgroundColor: pill.bg }]}>
          <Text style={{ color: pill.text, fontWeight: '700', fontSize: 11 }}>
            Stock: {stockUnits}
          </Text>
        </View>
        <Text style={styles.price}>
          ₹{' '}
          {product.price.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
      {opts > 1 ? (
        <Button
          title={
            cartQty > 0
              ? `Manage · ${cartQty} carton(s) · ${opts} options`
              : `Add · ${opts} options`
          }
          variant="outline"
          onPress={onOpenOptions}
        />
      ) : cartQty <= 0 ? (
        <Button title="Add" variant="outline" onPress={onAddSingle} />
      ) : (
        <QuantityStepper
          value={cartQty}
          onDecrement={() => onChangeQty(Math.max(0, cartQty - 1))}
          onIncrement={() => onChangeQty(cartQty + 1)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    ...SHADOW.card,
    margin: SPACING.xs,
  },
  badgeWrap: { position: 'absolute', top: 8, left: 8, zIndex: 2 },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: RADIUS.sm,
  },
  title: {
    marginTop: SPACING.sm,
    fontWeight: '700',
    color: colors.darkGray,
    fontSize: 13,
    minHeight: 36,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  stockPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  price: { color: colors.success, fontWeight: '700' },
});
