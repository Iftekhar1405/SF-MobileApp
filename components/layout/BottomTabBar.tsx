import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

const tabs = [
  {
    name: 'Home',
    path: '/(tabs)/home',
    match: (p: string) => p.includes('/home'),
  },
  { name: 'Shop', path: '/(tabs)/shop', match: (p: string) => p.includes('/shop') },
  {
    name: 'Payment',
    path: '/(tabs)/payment',
    match: (p: string) => p.includes('/payment'),
  },
];

export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
      {tabs.map((t) => {
        const active = t.match(pathname);
        const color = active ? colors.primary : colors.mediumGray;
        return (
          <Pressable
            key={t.name}
            style={styles.item}
            onPress={() =>
              router.push(t.path as '/(tabs)/home' | '/(tabs)/shop' | '/(tabs)/payment')
            }>
            <Ionicons
              name={
                t.name === 'Home'
                  ? 'home'
                  : t.name === 'Shop'
                    ? 'storefront'
                    : 'card'
              }
              size={22}
              color={color}
            />
            <Text style={[styles.label, { color }]}>{t.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    paddingTop: SPACING.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 11, fontWeight: '600' },
});
