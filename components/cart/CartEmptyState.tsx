import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export function CartEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="cart-outline" size={48} color={colors.mediumGray} />
      </View>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.hint}>
        Browse the shop and add products to place an order.
      </Text>
      <Button
        title="Go to shop"
        onPress={() => router.replace('/(tabs)/shop')}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  hint: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: { marginTop: SPACING.xl, alignSelf: 'stretch' },
});
