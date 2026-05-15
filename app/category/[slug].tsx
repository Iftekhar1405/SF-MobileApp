import { Ionicons } from '@expo/vector-icons';
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
import { FilterChip } from '@/components/ui/FilterChip';
import { ProductCard } from '@/components/ui/ProductCard';
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
import {
  useCategoryProductsInfinite,
  useProductsInfinite,
} from '@/hooks/useProducts';
import { cartQtyForProduct } from '@/utils/cartLines';
import { expandProductOptions } from '@/utils/productOptions';
import type { Product } from '@/types/models';

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug: slugParam } = useLocalSearchParams<{ slug: string }>();
  const slug = decodeURIComponent(
    Array.isArray(slugParam) ? slugParam[0] : slugParam
  );

  const isGender = slug.startsWith('g_');
  const gender = isGender ? slug.slice(2) : undefined;
  const category = !isGender ? slug : undefined;

  const [inStockOnly, setInStockOnly] = useState<boolean | undefined>(undefined);
  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const addMut = useAddToCart();
  const updMut = useUpdateCartItem();
  const delMut = useRemoveCartItem();

  const { data: subCats, refetch: refetchCats } = useCategories(gender);

  const genderQuery = useProductsInfinite({
    gender,
    inStock: inStockOnly,
    pageSize: 20,
    enabled: Boolean(isGender),
  });

  const catQuery = useCategoryProductsInfinite({
    category: category ?? '',
    inStock: inStockOnly,
    pageSize: 20,
  });

  const list = useMemo(() => {
    const q = isGender ? genderQuery : catQuery;
    return q.data?.pages.flatMap((p) => p.products) ?? [];
  }, [isGender, genderQuery.data, catQuery.data]);

  const total = isGender ? genderQuery.data?.pages[0]?.totalProducts : catQuery.data?.pages[0]?.totalProducts;

  const isRefetching = isGender ? genderQuery.isRefetching : catQuery.isRefetching;
  const fetchNextPage = isGender ? genderQuery.fetchNextPage : catQuery.fetchNextPage;
  const refetch = isGender ? genderQuery.refetch : catQuery.refetch;
  const isFetchingNext = isGender
    ? genderQuery.isFetchingNextPage
    : catQuery.isFetchingNextPage;

  const openSheet = (p: Product) => {
    setSheetProduct(p);
    sheetRef.current?.present();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: SPACING.md }}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
          </Pressable>
          <Text style={styles.title}>
            {total ?? list.length} Products
          </Text>
          <Pressable onPress={() => router.push('/cart')} hitSlop={10}>
            <Ionicons name="cart-outline" size={24} color={colors.darkGray} />
          </Pressable>
        </View>
      </View>

      {isGender ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.sm }}>
          {(subCats ?? []).map((c) => (
            <Pressable
              key={c.category}
              onPress={() =>
                router.push(`/category/${encodeURIComponent(c.category)}`)
              }
              style={styles.chip}>
              <Text style={styles.chipText}>{c.category}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          gap: SPACING.sm,
        }}>
        <FilterChip
          label="ALL"
          active={inStockOnly === undefined}
          onPress={() => setInStockOnly(undefined)}
        />
        <FilterChip
          label="IN STOCK"
          active={inStockOnly === true}
          onPress={() => setInStockOnly(true)}
        />
      </ScrollView>

      <FlatList
        data={list}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={{ paddingHorizontal: SPACING.sm }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
              refetchCats();
              refetchCart();
            }}
          />
        }
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.35}
        ListFooterComponent={isFetchingNext ? <ActivityIndicator /> : null}
        contentContainerStyle={{ paddingBottom: cart && cart.totalItems > 0 ? 120 : 24 }}
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

      {cart && cart.totalItems > 0 ? (
        <Pressable
          onPress={() => router.push('/cart')}
          style={styles.stickyBar}>
          <Text style={styles.stickyLeft}>
            {cart.totalItems} item(s) · {cart.totalPrice.toFixed(2)}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  title: { fontWeight: '800', fontSize: 16, color: colors.darkGray },
  stickyBar: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    bottom: SPACING.md,
    backgroundColor: colors.white,
    borderRadius: 999,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  stickyLeft: { fontWeight: '700', color: colors.darkGray },
  stickyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
  },
  stickyBtnText: { color: colors.white, fontWeight: '800' },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: SPACING.sm,
  },
  chipText: { fontWeight: '700', color: colors.darkGray },
});
