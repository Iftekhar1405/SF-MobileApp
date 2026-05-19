import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { APP_NAME } from '@/constants/app';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';

const BRAND_LOGO = require('@/assets/images/logo.png');

type Props = {
  cartCount?: number;
  onMenuPress?: () => void;
  /** Text override; when set, logo is hidden. */
  title?: string;
  showLogo?: boolean;
};

export function AppHeader({
  cartCount = 0,
  onMenuPress,
  title,
  showLogo = true,
}: Props) {
  const router = useRouter();
  const useBrandLogo = showLogo && !title;

  return (
    <View style={styles.row}>
      <View style={styles.sideLeft}>
        <Pressable onPress={onMenuPress} hitSlop={8}>
          <Ionicons name="menu" size={26} color={colors.darkGray} />
        </Pressable>
      </View>

      <View style={styles.sideRight}>
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

      <View style={styles.centerOverlay} pointerEvents="none">
        {useBrandLogo ? (
          <Image
            source={BRAND_LOGO}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityLabel={APP_NAME}
          />
        ) : (
          <Text style={styles.logoText} numberOfLines={1}>
            {title ?? APP_NAME}
          </Text>
        )}
      </View>
    </View>
  );
}

const SIDE_INSET = 80;

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    minHeight: 40,
  },
  sideLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  sideRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    zIndex: 1,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIDE_INSET,
  },
  logoImage: {
    width: 148,
    height: 40,
  },
  logoText: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    color: colors.primary,
  },
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
