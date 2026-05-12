import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import { colors } from '@/constants/Colors';
import { SPACING } from '@/constants/theme';
import { useOrderHistory } from '@/hooks/useOrders';
import type { Order } from '@/types/models';

export default function OrdersIndex() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useOrderHistory();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
      contentContainerStyle={{ padding: SPACING.md, gap: SPACING.sm }}
      ListEmptyComponent={
        <Text style={{ color: colors.mediumGray }}>No orders yet.</Text>
      }
      renderItem={({ item }) => (
        <OrderRow item={item} onPress={() => router.push(`/orders/${item._id}`)} />
      )}
    />
  );
}

function OrderRow({ item, onPress }: { item: Order; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.id}>#{item._id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.badge}>{item.status}</Text>
      </View>
      <Text style={styles.meta}>
        {item.createdAt ? formatDateShort(item.createdAt) : ''}
      </Text>
      <Text style={styles.meta}>
        {item.totalItems} items · {formatCurrencyINR(item.totalPrice)}
      </Text>
      <Text style={styles.link}>View details</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: colors.white,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  id: { fontWeight: '800', color: colors.darkGray },
  meta: { marginTop: 4, color: colors.mediumGray },
  badge: {
    textTransform: 'capitalize',
    fontWeight: '700',
    color: colors.primary,
  },
  link: { marginTop: SPACING.sm, color: colors.primary, fontWeight: '700' },
});
