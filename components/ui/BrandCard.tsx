import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';

type Props = { name: string; onPress?: () => void };

export function BrandCard({ name, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{name.slice(0, 2).toUpperCase()}</Text>
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    ...SHADOW.card,
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontWeight: '800', color: colors.primary },
  name: { marginTop: SPACING.xs, fontSize: 11, fontWeight: '600' },
});
