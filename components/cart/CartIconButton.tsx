import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  count?: number;
  size?: number;
};

export function CartIconButton({ count = 0, size = 22 }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={12}
      style={({ pressed }) => [pressed && { opacity: 0.75 }]}>
      <View>
        <Ionicons name="cart-outline" size={size} color={colors.darkGray} />
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {count > 99 ? '99+' : count}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -7,
    top: -5,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});
