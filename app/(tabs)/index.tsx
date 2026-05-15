import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProfileDrawer } from '@/components/layout/ProfileDrawer';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BrandCard } from '@/components/ui/BrandCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import { colors } from '@/constants/colors';
import { MOCK_BANNERS } from '@/constants/mockBanners';
import { RADIUS, SPACING } from '@/constants/theme';
import {
  useAddToCart,
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { useCategories } from '@/hooks/useCategories';
import { useProductsInfinite } from '@/hooks/useProducts';
import { fetchBrands } from '@/services/product.service';
import { useUserStore } from '@/store/userStore';
import { cartQtyForProduct } from '@/utils/cartLines';
import { expandProductOptions } from '@/utils/productOptions';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ProductOptionsModal } from '@/components/modals/ProductOptionsModal';
import type { Product } from '@/types/models';

const { width: SCREEN_W } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);
  const [drawer, setDrawer] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const {
    data: categories,
    isLoading: catLoading,
    refetch: refetchCat,
    isRefetching: catRefetching,
  } = useCategories();

  const {
    data: brands,
    isLoading: brandsLoading,
    refetch: refetchBrands,
  } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands });

  const productsQ = useProductsInfinite({ pageSize: 10 });
  const products = useMemo(
    () => productsQ.data?.pages.flatMap((p) => p.products) ?? [],
    [productsQ.data]
  );

  const refreshing =
    catRefetching || productsQ.isRefetching || productsQ.isFetching;

  const onRefresh = async () => {
    await Promise.all([
      refetchCat(),
      refetchBrands(),
      productsQ.refetch(),
      refetchCart(),
    ]);
  };

  const openOptions = (p: Product) => {
    setSheetProduct(p);
    sheetRef.current?.present();
  };

  const cartCount = cart?.totalItems ?? 0;

  return (
    <ScreenWrapper
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ paddingHorizontal: 0 }}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: SPACING.md }}>
        <AppHeader
          cartCount={cartCount}
          onMenuPress={() => setDrawer(true)}
        />
        <Pressable onPress={() => router.push('/search')} style={{ marginTop: SPACING.sm }}>
          <SearchBar />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: SPACING.md }}>
        <View style={styles.dealerCard}>
          <Text style={styles.dealerTitle}>
            {profile?.shopName ?? 'M/S SALIM FOOTWEAR'}
          </Text>
          <Text style={styles.dealerMeta}>
            Seller: {process.env.EXPO_PUBLIC_APP_NAME ?? 'Ajanta Shoes India Pvt. Ltd.'}
          </Text>
          {profile?.address ? (
            <Text style={styles.dealerMeta}>{profile.address}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.quickRow}>
          {[
            { label: 'Shop Now', icon: '🛒', href: '/(tabs)/shop' },
            { label: 'Reorder', icon: '🔄', href: '/(tabs)/payment' },
            { label: 'Orders', icon: '📦', href: '/orders' },
            { label: 'Support', icon: '💬', href: '/(tabs)/payment' },
          ].map((q) => (
            <Pressable
              key={q.label}
              style={styles.quickCard}
              onPress={() => router.push(q.href as '/(tabs)/shop')}>
              <Text style={{ fontSize: 22 }}>{q.icon}</Text>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Promotions" />
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setBannerIdx(Math.round(x / SCREEN_W));
          }}
          scrollEventThrottle={16}
          style={{ marginHorizontal: -SPACING.md }}>
          {MOCK_BANNERS.map((b) => (
            <Image
              key={b.id}
              source={{ uri: b.uri }}
              style={{ width: SCREEN_W, height: 160 }}
              contentFit="cover"
            />
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {MOCK_BANNERS.map((b, i) => (
            <View
              key={b.id}
              style={[styles.dot, i === bannerIdx && styles.dotActive]}
            />
          ))}
        </View>

        <SectionHeader
          title="Shop by gender"
          actionLabel="See more"
          onAction={() => router.push('/(tabs)/shop')}
        />
        <View style={styles.genderRow}>
          {[
            { label: "MEN'S", color: colors.mensTile, slug: 'g_Men' },
            { label: "WOMEN'S", color: colors.womensTile, slug: 'g_Women' },
            { label: "KIDS'", color: colors.kidsTile, slug: 'g_Kids' },
          ].map((g) => (
            <Pressable
              key={g.slug}
              onPress={() => router.push(`/category/${g.slug}`)}
              style={[styles.genderTile, { backgroundColor: g.color }]}>
              <Text style={styles.genderText}>{g.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader
          title="Shop by category"
          actionLabel="See more"
          onAction={() => router.push('/(tabs)/shop')}
        />
        {catLoading ? (
          <SkeletonBox height={80} />
        ) : (
          <View style={styles.catGrid}>
            {(categories ?? []).slice(0, 9).map((c) => (
              <CategoryCard
                key={c.category}
                title={c.category}
                image={c.image}
                onPress={() =>
                  router.push(
                    `/category/${encodeURIComponent(c.category)}` as `/category/${string}`
                  )
                }
              />
            ))}
          </View>
        )}

        <SectionHeader title="Shop by brand" actionLabel="See more" />
        {brandsLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(brands ?? []).slice(0, 12).map((b) => (
              <BrandCard
                key={b}
                name={b}
                onPress={() =>
                  router.push(`/(tabs)/shop?brand=${encodeURIComponent(b)}`)
                }
              />
            ))}
          </ScrollView>
        )}

        <SectionHeader title="Top collections" />
        <FlatList
          horizontal
          data={products.slice(0, 8)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ width: 160, marginRight: SPACING.sm }}>
              <ProductCard
                product={item}
                cartQty={cartQtyForProduct(cart, item._id)}
                onOpenOptions={() => openOptions(item)}
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
                  const lines = cart?.items?.filter((it) => {
                    const pid =
                      typeof it.productId === 'object' && it.productId
                        ? it.productId._id
                        : String(it.productId);
                    return pid === item._id;
                  });
                  const line = lines?.[0];
                  if (!line) return;
                  if (next <= 0) delMut.mutate(line._id);
                  else updMut.mutate({ itemId: line._id, quantity: next });
                }}
              />
            </View>
          )}
        />

        <SectionHeader title="Recommended" actionLabel="Shop" onAction={() => router.push('/(tabs)/shop')} />
        <View style={styles.recGrid}>
          {products.slice(0, 4).map((p) => (
            <View key={p._id} style={{ flex: 1, minWidth: '45%' }}>
              <ProductCard
                product={p}
                cartQty={cartQtyForProduct(cart, p._id)}
                onOpenOptions={() => openOptions(p)}
                onAddSingle={() => {
                  const o = expandProductOptions(p)[0];
                  if (!o) return;
                  addMut.mutate({
                    productId: p._id,
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
                    return pid === p._id;
                  });
                  if (!line) return;
                  if (next <= 0) delMut.mutate(line._id);
                  else updMut.mutate({ itemId: line._id, quantity: next });
                }}
              />
            </View>
          ))}
        </View>
      </View>

      <ProfileDrawer
        visible={drawer}
        onClose={() => setDrawer(false)}
        user={profile}
      />

      <ProductOptionsModal
        ref={sheetRef}
        product={sheetProduct}
        cart={cart}
        onClose={() => sheetRef.current?.dismiss()}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  dealerCard: {
    backgroundColor: colors.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.md,
  },
  dealerTitle: { fontWeight: '800', fontSize: 16, color: colors.darkGray },
  dealerMeta: { marginTop: 4, color: colors.mediumGray, fontSize: 13 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    color: colors.darkGray,
  },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  quickCard: {
    width: '22%',
    minWidth: 72,
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  quickLabel: { marginTop: 4, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: SPACING.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lightGray },
  dotActive: { backgroundColor: colors.primary },
  genderRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  genderTile: {
    flex: 1,
    height: 88,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: { color: colors.white, fontWeight: '900', fontSize: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
