import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppHeader } from '@/components/layout/AppHeader';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { GenderTileRow } from '@/components/ui/GenderTileRow';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProductOptionsModal } from '@/components/modals/ProductOptionsModal';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import {
  useAddToCart,
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { useCategories } from '@/hooks/useCategories';
import { useGendersWithCounts } from '@/hooks/useGenders';
import { useProductsInfinite } from '@/hooks/useProducts';
import { fetchBrands } from '@/services/product.service';
import { cartQtyForProduct } from '@/utils/cartLines';
import { normalizeBrand } from '@/utils/brand';
import { expandProductOptions } from '@/utils/productOptions';
import type { Product } from '@/types/models';

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ brand?: string }>();
  const rawBrand = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const brand = rawBrand
    ? normalizeBrand(decodeURIComponent(rawBrand))
    : undefined;

  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const { data: genderCounts } = useGendersWithCounts();

  const {
    data: categories,
    isLoading,
    refetch,
    isRefetching,
  } = useCategories();

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  const brandProducts = useProductsInfinite({
    brand,
    pageSize: 20,
    enabled: Boolean(brand),
  });
  const brandList = useMemo(
    () => brandProducts.data?.pages.flatMap((p) => p.products) ?? [],
    [brandProducts.data]
  );

  const openSheet = (p: Product) => {
    setSheetProduct(p);
    sheetRef.current?.present();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: SPACING.md }}>
        <AppHeader cartCount={cart?.totalItems ?? 0} />
        <Pressable onPress={() => router.push('/search')} style={{ marginVertical: SPACING.sm }}>
          <SearchBar />
        </Pressable>
        {brand ? (
          <View style={styles.brandBanner}>
            <Text style={styles.brandText}>Brand: {brand}</Text>
            <Pressable onPress={() => router.replace('/(tabs)/shop')}>
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {brand ? (
        <FlatList
          data={brandList}
          numColumns={2}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={{ paddingHorizontal: SPACING.sm }}
          onEndReached={() => brandProducts.fetchNextPage()}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={brandProducts.isRefetching}
              onRefresh={() => {
                brandProducts.refetch();
                refetchCart();
              }}
            />
          }
          ListFooterComponent={
            brandProducts.isFetchingNextPage ? <ActivityIndicator /> : null
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard
                product={item}
                cartQty={cartQtyForProduct(cart, item._id)}
                onOpenOptions={() => openSheet(item)}
                onAddSingle={() => {
                  const o = expandProductOptions(item)[0];
                  if (!o) return;
                  addMut.mutate({
                    productId: item._id,
                    quantity: 1,
                    color: o.color,
                    itemSet: [{ size: o.size, lengths: o.lengths }],
                  });
                }}
                onChangeQty={(next) => {
                  const line = cart?.items?.find((it) => {
                    const pid =
                      typeof it.productId === 'object' && it.productId
                        ? it.productId._id
                        : String(it.productId);
                    return pid === item._id;
                  });
                  if (!line) return;
                  if (next <= 0) delMut.mutate(line._id);
                  else updMut.mutate({ itemId: line._id, quantity: next });
                }}
              />
            </View>
          )}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
                refetchCart();
              }}
            />
          }
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}>
          <Text style={styles.h}>Shop by gender</Text>
          <GenderTileRow counts={genderCounts} compact />

          <Text style={[styles.h, { marginTop: SPACING.md }]}>Browse categories</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.grid}>
              {(categories ?? []).map((c) => (
                <CategoryCard
                  key={c.category}
                  title={c.category}
                  image={c.image}
                  onPress={() =>
                    router.push(`/category/${encodeURIComponent(c.category)}`)
                  }
                />
              ))}
            </View>
          )}

          <Text style={[styles.h, { marginTop: SPACING.lg }]}>Brands</Text>
          <View style={styles.brandRow}>
            {(brands ?? []).map((b) => {
              const name = normalizeBrand(b);
              return (
                <Pressable
                  key={name}
                  onPress={() =>
                    router.push(
                      `/(tabs)/shop?brand=${encodeURIComponent(name)}`
                    )
                  }
                  style={[
                    styles.brandPill,
                    brand === name && styles.brandPillActive,
                  ]}>
                  <Text
                    style={[
                      styles.brandPillText,
                      brand === name && styles.brandPillTextActive,
                    ]}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      <ProductOptionsModal
        ref={sheetRef}
        product={sheetProduct}
        cart={cart}
        onClose={() => sheetRef.current?.dismiss()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 18, fontWeight: '800', marginBottom: SPACING.sm, color: colors.darkGray },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  brandPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  brandPillText: { fontWeight: '700', color: colors.primary },
  brandPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  brandPillTextActive: { color: colors.white },
  brandBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: SPACING.sm,
    borderRadius: 10,
    marginBottom: SPACING.sm,
  },
  brandText: { fontWeight: '700', color: colors.darkGray },
  clear: { color: colors.primary, fontWeight: '800' },
});
