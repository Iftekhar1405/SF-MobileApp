import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { colors } from '@/constants/Colors';
import { SPACING } from '@/constants/theme';
import { searchProductsQuery } from '@/services/product.service';
import { mediaUrl } from '@/services/api';
import type { Product } from '@/types/models';

const RECENT_KEY = 'recentSearchesV1';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const next = [term, ...prev.filter((x) => x !== term)].slice(0, 8);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debounced);
  }, [debounced, runSearch]);

  const [inStockOnly, setInStockOnly] = useState<boolean | undefined>(undefined);
  const filtered = useMemo(() => {
    if (inStockOnly == null) return results;
    return results.filter((p) => (inStockOnly ? p.inStock !== false : true));
  }, [results, inStockOnly]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <SearchBar editable value={q} onChangeText={setQ} />
        </View>
      </View>

      <View style={{ paddingHorizontal: SPACING.md, flexDirection: 'row', gap: SPACING.sm }}>
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
      </View>

      {recent.length && !q ? (
        <View style={{ paddingHorizontal: SPACING.md }}>
          <Text style={styles.section}>Recent</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
            {recent.map((r) => (
              <Pressable key={r} onPress={() => setQ(r)} style={styles.pill}>
                <Text>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: SPACING.lg }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
          ListEmptyComponent={
            debounced ? (
              <Text style={{ textAlign: 'center', color: colors.mediumGray, marginTop: 24 }}>
                No results
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => router.push(`/product/${item._id}`)}>
              <Image
                source={item.images?.[0] ? { uri: mediaUrl(item.images[0]) } : undefined}
                style={styles.thumb}
                contentFit="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.meta}>{item.article}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.mediumGray} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  section: { fontWeight: '800', marginBottom: SPACING.sm },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  thumb: { width: 56, height: 56, backgroundColor: colors.white, borderRadius: 10 },
  brand: { fontWeight: '800', color: colors.darkGray },
  meta: { color: colors.mediumGray, marginTop: 2 },
});
