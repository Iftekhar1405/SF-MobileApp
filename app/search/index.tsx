import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductOptionsModal } from '@/components/modals/ProductOptionsModal';
import { SearchBar } from '@/components/ui/SearchBar';
import { SearchResultRow } from '@/components/ui/SearchResultRow';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import {
  useAddToCart,
  useCartQuery,
} from '@/hooks/useCart';
import { useProductOptionsSheet } from '@/hooks/useProductOptionsSheet';
import { searchProductsQuery } from '@/services/product.service';
import { expandProductOptions } from '@/utils/productOptions';
import type { Product } from '@/types/models';

const RECENT_KEY = 'recentSearchesV1';
const MAX_RECENT = 12;

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: cart } = useCartQuery();
  const addMut = useAddToCart();
  const {
    sheetRef,
    sheetProduct,
    openSheet,
    dismissSheet,
    handleSheetDismiss,
  } = useProductOptionsSheet();

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((raw) => {
      if (!raw) return;
      try {
        setRecent(JSON.parse(raw) as string[]);
      } catch {
        /* ignore */
      }
    });
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(q.trim()), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  const runSearch = useCallback(async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchProductsQuery({ q: term, page: 1 });
      setResults((res.products ?? []) as Product[]);
      const raw = await AsyncStorage.getItem(RECENT_KEY);
      const prev = raw ? (JSON.parse(raw) as string[]) : [];
      const next = [term, ...prev.filter((x) => x !== term)].slice(0, MAX_RECENT);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debounced);
  }, [debounced, runSearch]);

  const addProductToCart = (product: Product) => {
    const o = expandProductOptions(product)[0];
    if (!o) return;
    addMut.mutate({
      productId: product._id,
      quantity: 1,
      color: o.color,
      itemSet: [{ size: o.size, lengths: o.lengths }],
    });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <View style={styles.searchWrap}>
          <SearchBar editable value={q} onChangeText={setQ} />
        </View>
      </View>

      {recent.length > 0 && !q ? (
        <View style={styles.recentBlock}>
          <Text style={styles.section}>Recent</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentScroll}>
            {recent.slice(0, MAX_RECENT).map((r) => (
              <Pressable key={r} onPress={() => setQ(r)} style={styles.pill}>
                <Text style={styles.pillText}>{r}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            debounced ? (
              <Text style={styles.empty}>No results</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <SearchResultRow
              product={item}
              onPress={() => router.push(`/product/${item._id}`)}
              onOpenOptions={() => openSheet(item)}
              onAddToCart={() => addProductToCart(item)}
            />
          )}
        />
      )}

      <ProductOptionsModal
        ref={sheetRef}
        product={sheetProduct}
        cart={cart}
        onClose={dismissSheet}
        onDismiss={handleSheetDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: colors.white,
  },
  searchWrap: { flex: 1 },
  recentBlock: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  section: {
    fontWeight: '800',
    marginBottom: SPACING.sm,
    color: colors.darkGray,
  },
  recentScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  pillText: { color: colors.darkGray, fontSize: 13 },
  loader: { marginTop: SPACING.lg },
  listContent: {
    paddingBottom: 120,
    backgroundColor: colors.white,
    marginTop: SPACING.sm,
  },
  empty: {
    textAlign: 'center',
    color: colors.mediumGray,
    marginTop: SPACING.xl,
    fontSize: 14,
  },
});
