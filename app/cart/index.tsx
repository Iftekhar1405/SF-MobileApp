import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
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
import { Image } from 'expo-image';
import { Button } from '@/components/ui/Button';
import { MOQWarningRow } from '@/components/ui/MOQWarningRow';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { colors } from '@/constants/Colors';
import { getMoqForCategory } from '@/constants/moq';
import { SPACING } from '@/constants/theme';
import {
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { usePlaceOrder } from '@/hooks/useOrders';
import { mediaUrl } from '@/services/api';
import { searchProductsByArticle } from '@/services/product.service';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { isPopulatedProduct } from '@/utils/cartLines';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: cart, refetch, isRefetching } = useCartQuery();
  const upd = useUpdateCartItem();
  const del = useRemoveCartItem();
  const place = usePlaceOrder();

  const [notes, setNotes] = useState('');
  const [scanner, setScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scanLock = useRef(false);

  const moqRows = useMemo(() => {
    if (!cart?.items?.length) return [];
    const totals = new Map<string, number>();
    for (const it of cart.items) {
      const cat =
        isPopulatedProduct(it.productId) && it.productId.category
          ? it.productId.category
          : 'General';
      totals.set(cat, (totals.get(cat) ?? 0) + it.quantity);
    }
    return Array.from(totals.entries()).map(([categoryName, cartQty]) => {
      const minQty = getMoqForCategory(categoryName);
      return {
        categoryName,
        minQty,
        cartQty,
        isViolating: cartQty < minQty,
      };
    });
  }, [cart]);

  const showMoq = moqRows.some((r) => r.isViolating);

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
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <Text style={styles.title}>Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ paddingHorizontal: SPACING.md, flexDirection: 'row', gap: SPACING.sm }}>
        <TextInput
          style={styles.search}
          placeholder="Quick search / article"
          placeholderTextColor={colors.mediumGray}
        />
        <Pressable style={styles.qr} onPress={openScanner}>
          <Ionicons name="qr-code-outline" size={22} color={colors.darkGray} />
        </Pressable>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}>
        {showMoq ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>MOQ — By product category</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, { flex: 2 }]}>Name</Text>
              <Text style={styles.cell}>Min</Text>
              <Text style={styles.cell}>Cart</Text>
            </View>
            {moqRows.map((r) => (
              <MOQWarningRow key={r.categoryName} {...r} />
            ))}
          </View>
        ) : null}

        {(cart?.items ?? []).map((it) => {
          const p = isPopulatedProduct(it.productId) ? it.productId : null;
          const img = p?.images?.[0];
          const name = p ? `${p.brand} | ${it.color}` : 'Product';
          const pcs = (it.itemSet?.[0]?.lengths ?? 0) * it.quantity;
          return (
            <View key={it._id} style={styles.line}>
              <Image
                source={img ? { uri: mediaUrl(img) } : undefined}
                style={styles.thumb}
                contentFit="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.sku}>{p?.article ?? ''}</Text>
                <Text style={styles.lineName}>{name}</Text>
                <Text style={styles.meta}>
                  {it.itemSet?.[0]?.lengths ?? 0} pc in carton · Total {pcs} pcs
                </Text>
                <Text style={styles.price}>{formatCurrencyINR(it.price)}</Text>
                <QuantityStepper
                  value={it.quantity}
                  onIncrement={() =>
                    upd.mutate({ itemId: it._id, quantity: it.quantity + 1 })
                  }
                  onDecrement={() =>
                    it.quantity <= 1
                      ? del.mutate(it._id)
                      : upd.mutate({ itemId: it._id, quantity: it.quantity - 1 })
                  }
                />
              </View>
              <Pressable onPress={() => del.mutate(it._id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </Pressable>
            </View>
          );
        })}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order details</Text>
          <Text style={styles.meta}>Total quantity: {cart?.totalItems ?? 0}</Text>
          <TextInput
            style={[styles.search, { marginTop: SPACING.sm }]}
            placeholder="Add notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <Text style={[styles.meta, { marginTop: SPACING.md }]}>
            Deliver to — Add address (coming soon)
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <Text style={styles.footerTotal}>
          Order value {formatCurrencyINR(cart?.totalPrice ?? 0)}
        </Text>
        <Button
          title="Place order"
          loading={place.isPending}
          onPress={async () => {
            try {
              await place.mutateAsync();
              Toast.show({ type: 'success', text1: 'Order placed' });
              router.push('/(tabs)/payment');
            } catch {
              Toast.show({ type: 'error', text1: 'Could not place order' });
            }
          }}
        />
      </View>

      <Modal visible={scanner} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a'],
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
  header: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900' },
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  cardTitle: { fontWeight: '900', marginBottom: SPACING.sm },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.lightGray },
  cell: { flex: 1, fontWeight: '800', color: colors.mediumGray, paddingVertical: 6 },
  line: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  thumb: { width: 72, height: 72, backgroundColor: colors.white, borderRadius: 10 },
  sku: { color: colors.mediumGray, fontSize: 12 },
  lineName: { fontWeight: '800', color: colors.darkGray },
  meta: { color: colors.mediumGray, marginTop: 4 },
  price: { color: colors.success, fontWeight: '900', marginTop: 6 },
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
  footerTotal: { fontWeight: '900', color: colors.darkGray },
});
