import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Cart, Product } from '@/types/models';
import { colors } from '@/constants/colors';
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
  onDismiss?: () => void;
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
>(({ product, cart, onClose, onDismiss }, ref) => {
  const insets = useSafeAreaInsets();
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
        pressBehavior="close"
      />
    ),
    []
  );

  const options = product ? expandProductOptions(product) : [];

  const footerScrollPadding = 88 + insets.bottom;

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom}>
        <View style={styles.footer}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.doneBtn, pressed && styles.donePressed]}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </BottomSheetFooter>
    ),
    [insets.bottom, onClose]
  );

  const thumb = (row: ProductOptionRow) => {
    if (!product) return undefined;
    const imgs = product.colors?.[row.color];
    return imgs?.[0];
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      bottomInset={insets.bottom}
      enablePanDownToClose
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}>
      {product ? (
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.title}>
              {product.brand} — All options
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.darkGray} />
            </Pressable>
          </View>

          <BottomSheetScrollView
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: footerScrollPadding },
            ]}
            showsVerticalScrollIndicator={false}>
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
                  <View style={styles.rowBody}>
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
          </BottomSheetScrollView>
        </View>
      ) : null}
    </BottomSheetModal>
  );
});

ProductOptionsModal.displayName = 'ProductOptionsModal';

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
  title: { fontSize: 16, fontWeight: '800', flex: 1, color: colors.darkGray },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
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
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontWeight: '700', color: colors.darkGray },
  sku: { color: colors.mediumGray, fontSize: 12, marginTop: 2 },
  price: { color: colors.success, fontWeight: '700', marginTop: 4, fontSize: 12 },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donePressed: { opacity: 0.9 },
  doneText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
