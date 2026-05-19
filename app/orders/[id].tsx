import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useOrder } from '@/hooks/useOrders';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import { mediaUrl } from '@/services/api';
import { isPopulatedProduct } from '@/utils/cartLines';
import {
  cartItemImageUri,
  formatCartItemLine,
} from '@/utils/productOptions';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useOrder(id);

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: SPACING.md, gap: SPACING.md }}>
      <Text style={styles.h1}>Order #{data._id.slice(-6).toUpperCase()}</Text>
      <Text style={styles.meta}>
        {data.createdAt ? formatDateShort(data.createdAt) : ''} ·{' '}
        <Text style={{ textTransform: 'capitalize' }}>{data.status}</Text>
      </Text>

      {data.deliveryAddress ? (
        <View style={styles.delivery}>
          <Text style={styles.h2}>Delivery</Text>
          <Text style={styles.meta}>{data.deliveryAddress}</Text>
          {data.pincode ? (
            <Text style={styles.meta}>Pincode: {data.pincode}</Text>
          ) : null}
          {data.landmark ? (
            <Text style={styles.meta}>Landmark: {data.landmark}</Text>
          ) : null}
        </View>
      ) : null}

      {data.items.map((it, idx) => {
        const p = isPopulatedProduct(it.productId) ? it.productId : null;
        const img = p ? cartItemImageUri(p, it.color) : undefined;
        return (
          <View key={`${idx}`} style={styles.row}>
            <Image
              source={img ? { uri: mediaUrl(img) } : undefined}
              style={styles.thumb}
              contentFit="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {p ? formatCartItemLine(p, it) : 'Product'}
              </Text>
              <Text style={styles.meta}>
                {it.quantity} carton{it.quantity === 1 ? '' : 's'}
              </Text>
            </View>
            <Text style={styles.price}>
              {formatCurrencyINR(it.price * it.quantity)}
            </Text>
          </View>
        );
      })}

      <View style={styles.summary}>
        <Text style={styles.h2}>Total</Text>
        <Text style={styles.priceBig}>{formatCurrencyINR(data.totalPrice)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '800', color: colors.darkGray },
  h2: { fontSize: 16, fontWeight: '700' },
  meta: { color: colors.mediumGray },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  thumb: { width: 56, height: 56, backgroundColor: colors.offWhite, borderRadius: 8 },
  name: { fontWeight: '700', color: colors.darkGray },
  price: { color: colors.success, fontWeight: '700' },
  delivery: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: colors.offWhite,
    borderRadius: 8,
    gap: 4,
  },
  summary: { marginTop: SPACING.lg },
  priceBig: { fontSize: 18, fontWeight: '800', color: colors.success, marginTop: 4 },
});
