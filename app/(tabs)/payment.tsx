import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useCartQuery } from '@/hooks/useCart';
import { useOrderHistory } from '@/hooks/useOrders';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import type { Order } from '@/types/models';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const { data: cart, refetch: refetchCart } = useCartQuery();
  const { data, isRefetching, refetch } = useOrderHistory();

  const filtered = useMemo(() => {
    const rows = data ?? [];
    if (tab === 'active') {
      return rows.filter((o) =>
        ['pending', 'processing', 'shipped'].includes(o.status)
      );
    }
    return rows.filter((o) => o.status === 'delivered');
  }, [data, tab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: SPACING.md }}>
        <AppHeader cartCount={cart?.totalItems ?? 0} />
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('active')}
          style={[styles.tab, tab === 'active' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
            Active orders
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('history')}
          style={[styles.tab, tab === 'history' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
            Order history
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
              refetchCart();
            }}
          />
        }
        contentContainerStyle={{ padding: SPACING.md, gap: SPACING.sm, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ color: colors.mediumGray }}>No orders in this tab.</Text>
        }
        renderItem={({ item }) => (
          <OrderCard item={item} onOpen={() => router.push(`/orders/${item._id}`)} />
        )}
      />
    </View>
  );
}

function OrderCard({ item, onOpen }: { item: Order; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen} style={styles.card}>
      <Text style={styles.id}>#{item._id.slice(-6).toUpperCase()}</Text>
      <Text style={styles.meta}>
        {item.createdAt ? formatDateShort(item.createdAt) : ''}
      </Text>
      <Text style={styles.meta}>
        {item.totalItems} items · {formatCurrencyINR(item.totalPrice)}
      </Text>
      <Text style={styles.badge}>{item.status}</Text>
      <Text style={styles.link}>View details</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  tabActive: { borderColor: colors.primary, backgroundColor: '#FFF5F7' },
  tabText: { fontWeight: '700', color: colors.mediumGray },
  tabTextActive: { color: colors.primary },
  card: {
    backgroundColor: colors.white,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  id: { fontWeight: '900', color: colors.darkGray },
  meta: { marginTop: 4, color: colors.mediumGray },
  badge: { marginTop: 8, fontWeight: '800', color: colors.primary, textTransform: 'capitalize' },
  link: { marginTop: SPACING.sm, color: colors.primary, fontWeight: '800' },
});
