import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { SPACING } from '@/constants/theme';

type Props = {
  cartCount?: number;
  onMenuPress?: () => void;
  title?: string;
};

export function AppHeader({ cartCount = 0, onMenuPress, title }: Props) {
  const router = useRouter();
  const appName = process.env.EXPO_PUBLIC_APP_NAME ?? 'Ajanta Shoes';

  return (
    <View style={styles.row}>
      <Pressable onPress={onMenuPress} hitSlop={8}>
        <Ionicons name="menu" size={26} color={colors.darkGray} />
      </Pressable>
      <Text style={styles.logo}>{title ?? appName}</Text>
      <View style={styles.icons}>
        <Pressable hitSlop={8}>
          <Ionicons name="bookmark-outline" size={22} color={colors.darkGray} />
        </Pressable>
        <Pressable onPress={() => router.push('/cart')} hitSlop={8}>
          <View>
            <Ionicons name="cart-outline" size={24} color={colors.darkGray} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  logo: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    color: colors.primary,
  },
  icons: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
});
