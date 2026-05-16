import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { ProductSortMenu } from '@/components/modals/ProductSortMenu';
import { GenderCategoryChip } from '@/components/ui/GenderCategoryChip';
import { StockSegmentedControl } from '@/components/ui/StockSegmentedControl';
import { HorizontalChipsSkeleton } from '@/components/ui/HorizontalChipsSkeleton';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import { ProductOptionsModal } from '@/components/modals/ProductOptionsModal';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';
import {
  useAddToCart,
  useCartQuery,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { useCategories } from '@/hooks/useCategories';
import {
  useCategoryProductsInfinite,
  useProductsInfinite,
} from '@/hooks/useProducts';
import { cartQtyForProduct } from '@/utils/cartLines';
import {
  genderAccentColor,
  genderDisplayName,
  isGenderSlug,
  parseGenderSlug,
  toApiGender,
} from '@/utils/gender';
import { expandProductOptions } from '@/utils/productOptions';
import type { Product } from '@/types/models';
import { ALL_CATEGORY_IMAGE, type GenderApiValue } from '@/constants/genders';
import { mediaUrl } from '@/services/api';
import type { ProductSortOption } from '@/utils/sortProducts';

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug: slugParam, gender: genderParam } = useLocalSearchParams<{
    slug: string;
    gender?: string;
  }>();
  const slug = decodeURIComponent(
    Array.isArray(slugParam) ? slugParam[0] : slugParam ?? ''
  );

  const genderFromSlug = isGenderSlug(slug) ? parseGenderSlug(slug) : undefined;
  const rawGenderParam = Array.isArray(genderParam)
    ? genderParam[0]
    : genderParam;
  const genderFromQuery = rawGenderParam
    ? toApiGender(rawGenderParam)
    : undefined;
  const apiGender: GenderApiValue | undefined =
    genderFromSlug ?? genderFromQuery;
  const isGenderBrowse = Boolean(genderFromSlug);
  const category = !isGenderBrowse ? slug : undefined;
  const accent = genderAccentColor(apiGender);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean | undefined>(undefined);
  const [sortKey, setSortKey] = useState<ProductSortOption>('default');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(null);
    setSortKey('default');
  }, [apiGender, slug]);
  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const {
    data: subCats,
    isLoading: catsLoading,
    refetch: refetchCats,
  } = useCategories(apiGender);

  const genderQuery = useProductsInfinite({
    gender: apiGender,
    inStock: inStockOnly,
    sort: sortKey,
    pageSize: 20,
    enabled:
      isGenderBrowse && Boolean(apiGender) && selectedCategory === null,
  });

  const genderCategoryQuery = useCategoryProductsInfinite({
    category: selectedCategory ?? '',
    gender: apiGender,
    inStock: inStockOnly,
    sort: sortKey,
    pageSize: 20,
    enabled:
      isGenderBrowse && Boolean(apiGender) && selectedCategory !== null,
  });

  const catQuery = useCategoryProductsInfinite({
    category: category ?? '',
    gender: apiGender,
    inStock: inStockOnly,
    sort: sortKey,
    pageSize: 20,
    enabled: !isGenderBrowse,
  });

  const activeQuery = isGenderBrowse
    ? selectedCategory === null
      ? genderQuery
      : genderCategoryQuery
    : catQuery;

  const list = useMemo(
    () => activeQuery.data?.pages.flatMap((p) => p.products) ?? [],
    [activeQuery.data]
  );

  const total = activeQuery.data?.pages[0]?.totalProducts;
  const isRefetching = activeQuery.isRefetching;
  const fetchNextPage = activeQuery.fetchNextPage;
  const refetch = activeQuery.refetch;
  const isFetchingNext = activeQuery.isFetchingNextPage;
  const showProductsLoading =
    activeQuery.isLoading ||
    (activeQuery.isFetching && list.length === 0);

  const screenTitle = useMemo(() => {
    if (isGenderBrowse && apiGender) {
      return genderDisplayName(apiGender);
    }
    if (category && apiGender) {
      return category;
    }
    if (category) return category;
    return 'Products';
  }, [isGenderBrowse, apiGender, category]);

  const subtitle = useMemo(() => {
    if (showProductsLoading) return 'Loading products…';
    if (total != null) return `${total} product${total === 1 ? '' : 's'}`;
    if (list.length > 0) return `${list.length} product${list.length === 1 ? '' : 's'}`;
    return 'Browse catalogue';
  }, [showProductsLoading, total, list.length]);

  const openSheet = (p: Product) => {
    setSheetProduct(p);
    sheetRef.current?.present();
  };

  const listBottomPad = cart && cart.totalItems > 0 ? 120 : SPACING.xl;

  const listHeader = (
    <View style={styles.categoryPanel}>
      {isGenderBrowse ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Categories</Text>
          {catsLoading ? (
            <HorizontalChipsSkeleton />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScrollView}
              contentContainerStyle={styles.chipsScroll}>
              <GenderCategoryChip
                label="ALL"
                image={ALL_CATEGORY_IMAGE}
                active={selectedCategory === null}
                accentColor={accent}
                onPress={() => setSelectedCategory(null)}
              />
              {(subCats ?? []).map((c) => {
                const uri = mediaUrl(c.image);
                return (
                  <GenderCategoryChip
                    key={c.category}
                    label={c.category}
                    image={uri ? { uri } : ALL_CATEGORY_IMAGE}
                    active={selectedCategory === c.category}
                    accentColor={accent}
                    onPress={() => setSelectedCategory(c.category)}
                  />
                );
              })}
            </ScrollView>
          )}
          {(subCats?.length ?? 0) === 0 && !catsLoading ? (
            <Text style={styles.hint}>No categories for this section yet.</Text>
          ) : null}
        </View>
      ) : null}

      {isGenderBrowse ? <View style={styles.filterDivider} /> : null}

      <View style={styles.filterBar}>
        <StockSegmentedControl
          inStockOnly={inStockOnly === true}
          onChange={(on) => setInStockOnly(on ? true : undefined)}
        />
        <Pressable
          onPress={() => setSortMenuOpen(true)}
          style={({ pressed }) => [
            styles.sortBtn,
            sortKey !== 'default' && styles.sortBtnActive,
            pressed && styles.sortBtnPressed,
          ]}>
          <Text
            style={[
              styles.sortBtnText,
              sortKey !== 'default' && styles.sortBtnTextActive,
            ]}>
            Sort By
          </Text>
          <Ionicons
            name="filter-outline"
            size={18}
            color={sortKey !== 'default' ? colors.primaryDark : colors.darkGray}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        {/* {apiGender ? (
          <View style={[styles.accentBar, { backgroundColor: accent }]} />
        ) : null} */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.darkGray} />
          </Pressable>
          <View style={styles.titleBlock}>
            {showProductsLoading ? (
              <>
                <SkeletonBox height={18} width="55%" style={styles.titleSkel} />
                <SkeletonBox height={12} width="40%" style={styles.subSkel} />
              </>
            ) : (
              <>
                <Text style={styles.title} numberOfLines={2}>
                  {screenTitle}
                </Text>
                {category && apiGender ? (
                  <Text style={styles.genderTag}>
                    {genderDisplayName(apiGender)}
                  </Text>
                ) : null}
                <Text style={styles.subtitle}>{subtitle}</Text>
              </>
            )}
          </View>
          <Pressable
            onPress={() => router.push('/cart')}
            hitSlop={12}
            style={styles.iconBtn}>
            <Ionicons name="cart-outline" size={22} color={colors.darkGray} />
          </Pressable>
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={showProductsLoading ? [] : list}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !showProductsLoading}
            onRefresh={() => {
              refetch();
              refetchCats();
              refetchCart();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (!showProductsLoading) fetchNextPage();
        }}
        onEndReachedThreshold={0.35}
        ListEmptyComponent={
          showProductsLoading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="cube-outline"
                  size={40}
                  color={colors.mediumGray}
                />
              </View>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptyHint}>
                {apiGender
                  ? 'Try another category or change the availability filter.'
                  : 'Try changing the availability filter or check back later.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNext ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.footerText}>Loading more…</Text>
            </View>
          ) : (
            <View style={{ height: SPACING.md }} />
          )
        }
        contentContainerStyle={[
          styles.listContent,
          list.length === 0 && styles.listContentEmpty,
          { paddingBottom: listBottomPad },
        ]}
        renderItem={({ item }) => (
          <View style={styles.cell}>
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

      <ProductSortMenu
        visible={sortMenuOpen}
        value={sortKey}
        onSelect={setSortKey}
        onClose={() => setSortMenuOpen(false)}
      />

      {cart && cart.totalItems > 0 ? (
        <Pressable
          onPress={() => router.push('/cart')}
          style={[styles.stickyBar, { marginBottom: insets.bottom + SPACING.sm }]}>
          <Text style={styles.stickyLeft}>
            {cart.totalItems} item(s) · ₹{cart.totalPrice.toFixed(2)}
          </Text>
          <View style={styles.stickyBtn}>
            <Text style={styles.stickyBtnText}>Go to Cart</Text>
          </View>
        </Pressable>
      ) : null}

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
  screen: { flex: 1, backgroundColor: colors.offWhite },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOW.card,
  },
  accentBar: {
    height: 4,
    borderRadius: RADIUS.pill,
    marginBottom: SPACING.sm,
    width: 48,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    minHeight: 52,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkGray,
    lineHeight: 26,
  },
  genderTag: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.mediumGray,
    marginTop: 4,
  },
  titleSkel: { borderRadius: RADIUS.sm },
  subSkel: { marginTop: SPACING.sm, borderRadius: RADIUS.sm },
  categoryPanel: {
    backgroundColor: colors.white,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  section: { paddingTop: SPACING.xs },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.mediumGray,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
  },
  chipsScrollView: {
    backgroundColor: colors.white,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
    backgroundColor: colors.white,
  },
  hint: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    color: colors.mediumGray,
    fontSize: 13,
  },
  filterDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGray,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: colors.white,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    minHeight: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  sortBtnActive: {
    borderColor: colors.primaryTint,
    backgroundColor: colors.primaryTint,
  },
  sortBtnPressed: { opacity: 0.88 },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.darkGray,
  },
  sortBtnTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  columnWrap: {
    paddingHorizontal: SPACING.sm,
  },
  list: { flex: 1 },
  listContent: { paddingTop: SPACING.xs },
  listContentEmpty: { flexGrow: 1 },
  cell: { flex: 1 },
  empty: {
    flex: 1,
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  emptyText: {
    fontWeight: '800',
    color: colors.darkGray,
    fontSize: 17,
  },
  emptyHint: {
    marginTop: SPACING.sm,
    color: colors.mediumGray,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  footerText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  stickyBar: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    bottom: 0,
    backgroundColor: colors.white,
    borderRadius: RADIUS.pill,
    padding: SPACING.sm,
    paddingLeft: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOW.card,
  },
  stickyLeft: { fontWeight: '700', color: colors.darkGray, flex: 1 },
  stickyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  stickyBtnText: { color: colors.white, fontWeight: '800' },
});
