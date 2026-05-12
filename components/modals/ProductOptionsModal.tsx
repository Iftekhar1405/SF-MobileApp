import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Cart, Product } from '@/types/models';
import { colors } from '@/constants/Colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { expandProductOptions, type ProductOptionRow } from '@/utils/productOptions';
import { isPopulatedProduct } from '@/utils/cartLines';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { useAddToCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { Image } from 'expo-image';
import { mediaUrl } from '@/services/api';

export type ProductOptionsModalProps = {
  product: Product | null;
  cart?: Cart;
  onClose: () => void;
};

function setsEqual(
  a: { size: string; lengths: number }[],
  b: { size: string; lengths: number }[]
) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function findLineQty(cart: Cart | undefined, product: Product, row: ProductOptionRow) {
  if (!cart?.items) return 0;
  const line = cart.items.find((it) => {
    const pid = isPopulatedProduct(it.productId)
      ? it.productId._id
      : String(it.productId);
    return (
      pid === product._id &&
      it.color === row.color &&
      setsEqual(it.itemSet, [{ size: row.size, lengths: row.lengths }])
    );
  });
  return line?.quantity ?? 0;
}

function findLineId(cart: Cart | undefined, product: Product, row: ProductOptionRow) {
  if (!cart?.items) return undefined;
  const line = cart.items.find((it) => {
    const pid = isPopulatedProduct(it.productId)
      ? it.productId._id
      : String(it.productId);
    return (
      pid === product._id &&
      it.color === row.color &&
      setsEqual(it.itemSet, [{ size: row.size, lengths: row.lengths }])
    );
  });
  return line?._id;
}

export const ProductOptionsModal = forwardRef<
  BottomSheetModal,
  ProductOptionsModalProps
>(({ product, cart, onClose }, ref) => {
  const snapPoints = useMemo(() => ['72%', '92%'], []);
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const options = product ? expandProductOptions(product) : [];

  const thumb = (row: ProductOptionRow) => {
    if (!product) return undefined;
    const imgs = product.colors?.[row.color];
    return imgs?.[0];
  };

  if (!product) return null;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>
          {product.brand} — All options
        </Text>
        <Pressable onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.darkGray} />
        </Pressable>
      </View>
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {options.map((row) => {
          const qty = findLineQty(cart, product, row);
          const lineId = findLineId(cart, product, row);
          const uri = mediaUrl(thumb(row));
          return (
            <View key={row.optionId} style={styles.row}>
              <Image
                source={uri ? { uri } : undefined}
                style={styles.thumb}
                contentFit="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {row.color} | {row.size}
                </Text>
                <Text style={styles.sku}>{row.sku}</Text>
                <Text style={styles.price}>
                  {formatCurrencyINR(product.price)} · Carton of {row.lengths}
                </Text>
              </View>
              {qty <= 0 ? (
                <Button
                  title="Add"
                  variant="outline"
                  loading={addMut.isPending}
                  onPress={() =>
                    addMut.mutate({
                      productId: product._id,
                      quantity: 1,
                      color: row.color,
                      itemSet: [{ size: row.size, lengths: row.lengths }],
                    })
                  }
                />
              ) : (
                <QuantityStepper
                  value={qty}
                  onIncrement={() => {
                    if (!lineId) return;
                    updMut.mutate({ itemId: lineId, quantity: qty + 1 });
                  }}
                  onDecrement={() => {
                    if (!lineId) return;
                    if (qty <= 1) delMut.mutate(lineId);
                    else updMut.mutate({ itemId: lineId, quantity: qty - 1 });
                  }}
                />
              )}
            </View>
          );
        })}
        <Button title="Done" onPress={onClose} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

ProductOptionsModal.displayName = 'ProductOptionsModal';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: 16, fontWeight: '800', flex: 1, color: colors.darkGray },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: colors.offWhite,
  },
  rowTitle: { fontWeight: '700', color: colors.darkGray },
  sku: { color: colors.mediumGray, fontSize: 12, marginTop: 2 },
  price: { color: colors.success, fontWeight: '700', marginTop: 4 },
});
