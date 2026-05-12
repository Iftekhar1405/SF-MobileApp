import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductOptionsModal } from '@/components/modals/ProductOptionsModal';
import { colors } from '@/constants/Colors';
import { RADIUS, SPACING } from '@/constants/theme';
import {
  useAddToCart,
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { mediaUrl } from '@/services/api';
import { cartQtyForProduct } from '@/utils/cartLines';
import { optionCount } from '@/utils/productOptions';
import { formatCurrencyINR } from '@/utils/formatCurrency';

const W = Dimensions.get('window').width;

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pid = Array.isArray(id) ? id[0] : id;

  const { data: product, isLoading } = useProduct(pid);
  const { data: cart } = useCartQuery();
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  const colorKeys = useMemo(
    () => (product ? Object.keys(product.colors ?? {}) : []),
    [product]
  );

  const selectedColor = color ?? colorKeys[0] ?? null;
  const images = useMemo(() => {
    if (!product || !selectedColor) return product?.images ?? [];
    return product.colors?.[selectedColor] ?? product.images ?? [];
  }, [product, selectedColor]);

  const sets = product?.itemSet ?? [];
  const selectedSize = size ?? sets[0]?.size ?? null;
  const selectedLengths = sets.find((s) => s.size === selectedSize)?.lengths ?? 0;

  const opts = product ? optionCount(product) : 0;
  const qty = product ? cartQtyForProduct(cart, product._id) : 0;

  if (isLoading || !product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  const onShare = async () => {
    await Share.share({ message: `${product.brand} — ${pid}` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <Pressable onPress={onShare}>
          <Ionicons name="share-outline" size={22} color={colors.darkGray} />
        </Pressable>
      </View>

      <FlatList
        horizontal
        pagingEnabled
        data={images}
        keyExtractor={(u, i) => `${u}-${i}`}
        renderItem={({ item }) => (
          <Pressable onPress={() => setLightbox(true)}>
            <Image
              source={{ uri: mediaUrl(item) }}
              style={{ width: W, height: W * 0.95 }}
              contentFit="contain"
            />
          </Pressable>
        )}
      />

      <View style={{ padding: SPACING.md }}>
        <Text style={styles.name}>{product.brand}</Text>
        {product.article ? (
          <Text style={styles.sku}>{product.article}</Text>
        ) : null}
        <Text style={styles.price}>
          {formatCurrencyINR(product.price)}{' '}
          <Text style={styles.gst}>(Excl. GST)</Text>
        </Text>
        {selectedLengths ? (
          <Text style={styles.meta}>Carton of {selectedLengths}</Text>
        ) : null}

        <Text style={styles.section}>Colour</Text>
        <View style={styles.rowWrap}>
          {colorKeys.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                setColor(c);
                setSize(null);
              }}
              style={[
                styles.pill,
                c === selectedColor ? styles.pillActive : styles.pillIdle,
              ]}>
              <Text
                style={[
                  styles.pillText,
                  c === selectedColor && { color: colors.white },
                ]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Sizes</Text>
        <View style={styles.rowWrap}>
          {sets.map((s) => (
            <Pressable
              key={s.size}
              onPress={() => setSize(s.size)}
              style={[
                styles.pill,
                s.size === selectedSize ? styles.pillActive : styles.pillIdle,
              ]}>
              <Text
                style={[
                  styles.pillText,
                  s.size === selectedSize && { color: colors.white },
                ]}>
                {s.size}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: SPACING.xl }} />

        {opts > 1 ? (
          <Button
            title={`Manage ${opts} options`}
            onPress={() => sheetRef.current?.present()}
          />
        ) : qty <= 0 ? (
          <Button
            title="Add item"
            onPress={() => {
              if (!selectedColor || !selectedSize) return;
              addMut.mutate({
                productId: product._id,
                quantity: 1,
                color: selectedColor,
                itemSet: [{ size: selectedSize, lengths: selectedLengths }],
              });
            }}
          />
        ) : (
          <QuantityStepper
            value={qty}
            onIncrement={() => {
              const line = cart?.items?.find((it) => {
                const pid =
                  typeof it.productId === 'object' && it.productId
                    ? it.productId._id
                    : String(it.productId);
                return pid === product._id;
              });
              if (!line) return;
              updMut.mutate({ itemId: line._id, quantity: qty + 1 });
            }}
            onDecrement={() => {
              const line = cart?.items?.find((it) => {
                const pid =
                  typeof it.productId === 'object' && it.productId
                    ? it.productId._id
                    : String(it.productId);
                return pid === product._id;
              });
              if (!line) return;
              if (qty <= 1) delMut.mutate(line._id);
              else updMut.mutate({ itemId: line._id, quantity: qty - 1 });
            }}
          />
        )}

        {opts <= 1 ? (
          <Text style={styles.optLabel}>1 option</Text>
        ) : (
          <Text style={styles.optLabel}>{opts} options available</Text>
        )}
      </View>

      <Modal visible={lightbox} transparent animationType="fade">
        <View style={styles.lightbox}>
          <Pressable style={styles.closeFab} onPress={() => setLightbox(false)}>
            <Ionicons name="close" size={22} color={colors.white} />
          </Pressable>
          <FlatList
            horizontal
            pagingEnabled
            data={images}
            keyExtractor={(u, i) => `${u}-lb-${i}`}
            renderItem={({ item }) => (
              <Image
                source={{ uri: mediaUrl(item) }}
                style={{ width: W, height: '100%' }}
                contentFit="contain"
              />
            )}
          />
        </View>
      </Modal>

      <ProductOptionsModal
        ref={sheetRef}
        product={product}
        cart={cart}
        onClose={() => sheetRef.current?.dismiss()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 20, fontWeight: '900', color: colors.darkGray },
  sku: { marginTop: 4, color: colors.mediumGray, fontSize: 13 },
  price: { marginTop: SPACING.sm, color: colors.success, fontWeight: '900', fontSize: 18 },
  gst: { fontSize: 12, color: colors.mediumGray, fontWeight: '600' },
  meta: { marginTop: 4, color: colors.mediumGray },
  section: {
    marginTop: SPACING.lg,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillIdle: {},
  pillText: { fontWeight: '700', color: colors.darkGray },
  bottomBar: { marginTop: SPACING.lg, gap: SPACING.sm },
  optLabel: { color: colors.mediumGray, fontWeight: '600' },
  lightbox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)' },
  closeFab: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
