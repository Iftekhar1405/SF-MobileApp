import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { NetworkRetryState } from '@/components/network/NetworkRetryState';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import {
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { searchProductsByArticle } from '@/services/product.service';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import {
  cartDisplayQty,
  formatDisplayQty,
  isPopulatedProduct,
} from '@/utils/cartLines';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data: cart,
    error,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useCartQuery();
  const upd = useUpdateCartItem();
  const del = useRemoveCartItem();

  const [scanner, setScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scanLock = useRef(false);

  const items = cart?.items ?? [];
  const hasItems = items.length > 0;
  const totalDisplayQty = cartDisplayQty(cart);

  const openScanner = async () => {
    const res = await requestPermission();
    if (!res.granted) {
      Toast.show({ type: 'error', text1: 'Camera permission required' });
      return;
    }
    scanLock.current = false;
    setScanner(true);
  };

  const onBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanLock.current) return;
      scanLock.current = true;
      setScanner(false);
      try {
        const products = await searchProductsByArticle(data);
        if (!products.length) {
          Toast.show({ type: 'error', text1: 'No product found for scan' });
          return;
        }
        router.push(`/product/${products[0]._id}`);
      } catch {
        Toast.show({ type: 'error', text1: 'Scan lookup failed' });
      } finally {
        scanLock.current = false;
      }
    },
    [router]
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <Text style={styles.title}>Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {hasItems ? (
        <View style={styles.searchRow}>
          <TextInput
            style={styles.search}
            placeholder="Quick search / article"
            placeholderTextColor={colors.mediumGray}
          />
          <Pressable style={styles.qr} onPress={openScanner}>
            <Ionicons name="qr-code-outline" size={22} color={colors.darkGray} />
          </Pressable>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError && !cart ? (
        <NetworkRetryState
          error={error}
          loading={isRefetching}
          onRetry={() => refetch()}
        />
      ) : !hasItems ? (
        <CartEmptyState />
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
              />
            }
            contentContainerStyle={styles.scrollContent}>
            {items.map((it) => {
              const p = isPopulatedProduct(it.productId) ? it.productId : null;
              if (!p) return null;
              const lineBusy =
                (upd.isPending && upd.variables?.itemId === it._id) ||
                (del.isPending && del.variables === it._id);
              return (
                <CartLineItem
                  key={it._id}
                  item={it}
                  product={p}
                  stepperDisabled={lineBusy}
                  onIncrement={() =>
                    upd.mutate({ itemId: it._id, quantity: it.quantity + 1 })
                  }
                  onDecrement={() =>
                    it.quantity <= 1
                      ? del.mutate(it._id)
                      : upd.mutate({
                          itemId: it._id,
                          quantity: it.quantity - 1,
                        })
                  }
                  onRemove={() => del.mutate(it._id)}
                />
              );
            })}
          </ScrollView>

          <View
            style={[styles.footer, { paddingBottom: insets.bottom + SPACING.sm }]}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Quantity</Text>
              <Text style={styles.footerValue}>
                {formatDisplayQty(totalDisplayQty)}
              </Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.footerTotal}>
                {formatCurrencyINR(cart!.totalPrice)}
              </Text>
            </View>
            <Button
              title="Proceed"
              onPress={() => router.push('/cart/checkout')}
            />
          </View>
        </>
      )}

      <Modal visible={scanner} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: [
                  'qr',
                  'ean13',
                  'ean8',
                  'code128',
                  'code39',
                  'upc_a',
                ],
              }}
              onBarcodeScanned={onBarcodeScanned}
            />
          ) : null}
          <Pressable
            onPress={() => {
              scanLock.current = false;
              setScanner(false);
            }}
            style={{ position: 'absolute', top: insets.top + 8, right: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  title: { fontSize: 18, fontWeight: '900' },
  searchRow: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    padding: SPACING.sm,
    backgroundColor: colors.white,
  },
  qr: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 160,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: { color: colors.mediumGray, fontWeight: '600' },
  footerValue: { fontWeight: '800', color: colors.darkGray },
  footerTotal: { fontWeight: '900', color: colors.success, fontSize: 16 },
});
