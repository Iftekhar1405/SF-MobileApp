import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { useProductOptionsSheet } from '@/hooks/useProductOptionsSheet';
import { ProfileDrawer } from '@/components/layout/ProfileDrawer';
import { TabScreenHeader } from '@/components/layout/TabScreenHeader';
import { BrandBrowseSection } from '@/components/browse/BrandBrowseSection';
import { CategoryBrowseSection } from '@/components/browse/CategoryBrowseSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
import { useUserStore } from '@/store/userStore';
import { cartQtyForProduct } from '@/utils/cartLines';
import { normalizeBrand } from '@/utils/brand';
import { categoryDiscoverHref } from '@/utils/categoryBrowse';
import { expandProductOptions } from '@/utils/productOptions';
export default function ShopScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [drawer, setDrawer] = useState(false);
  const params = useLocalSearchParams<{ brand?: string }>();
  const rawBrand = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const brand = rawBrand
    ? normalizeBrand(decodeURIComponent(rawBrand))
    : undefined;

  const {
    sheetRef,
    sheetProduct,
    openSheet,
    dismissSheet,
    handleSheetDismiss,
  } = useProductOptionsSheet();

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

  const { data: brands, isLoading: brandsLoading } = useQuery({
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

  return (
    <View style={styles.screen}>
      <TabScreenHeader
        cartCount={cart?.totalItems ?? 0}
        onMenuPress={() => setDrawer(true)}>
        <SearchBar
          onPress={() => router.push('/search')}
          style={styles.searchBar}
        />
        {brand ? (
          <View style={styles.brandBanner}>
            <Text style={styles.brandText}>Brand: {brand}</Text>
            <Pressable onPress={() => router.replace('/(tabs)/shop')}>
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
        ) : null}
      </TabScreenHeader>

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
                onViewProduct={() => router.push(`/product/${item._id}`)}
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SectionHeader
              title="Shop By Gender"
              variant="prominent"
              // actionLabel="See more"
              onAction={() => router.push('/category/g_male')}
            />
            <GenderTileRow counts={genderCounts} compact />
          </View>

          <CategoryBrowseSection
            title="Shop By Category"
            categories={categories}
            loading={isLoading}
            previewCount={9}
            onCategoryPress={(category) =>
              router.push(
                `/category/${encodeURIComponent(category)}` as `/category/${string}`
              )
            }
            showMore={{
              mode: 'navigate',
              onNavigate: () => router.push(categoryDiscoverHref()),
            }}
          />

          <BrandBrowseSection
            brands={brands}
            loading={brandsLoading}
            onBrandPress={(name) =>
              router.push(`/(tabs)/shop?brand=${encodeURIComponent(name)}`)
            }
          />
        </ScrollView>
      )}

      <ProductOptionsModal
        ref={sheetRef}
        product={sheetProduct}
        cart={cart}
        onClose={dismissSheet}
        onDismiss={handleSheetDismiss}
      />

      <ProfileDrawer
        visible={drawer}
        onClose={() => setDrawer(false)}
        user={profile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  searchBar: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: SPACING.xl,
  },
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
