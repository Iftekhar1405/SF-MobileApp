import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types/models';

const { width: SCREEN_W } = Dimensions.get('window');
const PANEL_W = Math.min(SCREEN_W * 0.86, 340);

type Props = {
  visible: boolean;
  onClose: () => void;
  user: User | null;
};

const easeOut = Easing.out(Easing.cubic);

export function ProfileDrawer({ visible, onClose, user }: Props) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const slideX = useSharedValue(-PANEL_W);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      slideX.value = withTiming(0, { duration: 320, easing: easeOut });
      backdropOpacity.value = withTiming(1, { duration: 280, easing: easeOut });
      return;
    }

    if (!mounted) return;

    slideX.value = withTiming(-PANEL_W, { duration: 260, easing: easeOut });
    backdropOpacity.value = withTiming(
      0,
      { duration: 220, easing: easeOut },
      (finished) => {
        if (finished) runOnJS(setMounted)(false);
      }
    );
  }, [visible, mounted, slideX, backdropOpacity]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!mounted) return null;

  const navigate = (href: '/(tabs)/home' | '/(tabs)/shop' | '/(tabs)/payment') => {
    onClose();
    router.push(href);
  };

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>

        <Animated.View
          style={[
            styles.panel,
            {
              width: PANEL_W,
              paddingTop: insets.top + SPACING.md,
              paddingBottom: insets.bottom + SPACING.md,
            },
            panelStyle,
          ]}>
          <View style={styles.panelHeader}>
            <Text style={styles.kicker}>Account</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.darkGray} />
            </Pressable>
          </View>

          <Text style={styles.title}>{user?.shopName ?? 'Your shop'}</Text>
          {user?.name ? <Text style={styles.meta}>{user.name}</Text> : null}
          {user?.phone ? (
            <Text style={styles.meta}>+91 {user.phone}</Text>
          ) : null}
          {user?.address ? (
            <Text style={styles.address} numberOfLines={3}>
              {user.address}
            </Text>
          ) : null}

          <View style={styles.divider} />

          <Pressable style={styles.link} onPress={() => navigate('/(tabs)/home')}>
            <Ionicons name="home-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Home</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => navigate('/(tabs)/shop')}>
            <Ionicons name="cart-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Shop Now</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => navigate('/(tabs)/payment')}>
            <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Orders & payment</Text>
          </Pressable>

          <View style={styles.spacer} />

          <Pressable
            style={styles.logout}
            onPress={async () => {
              await logout();
              onClose();
              router.replace('/(auth)/login');
            }}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
          <Text style={styles.version}>v{appVersion}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.lg,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.mediumGray,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.darkGray,
  },
  meta: {
    marginTop: 4,
    color: colors.mediumGray,
    fontSize: 14,
  },
  address: {
    marginTop: SPACING.xs,
    color: colors.mediumGray,
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    marginTop: SPACING.lg,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGray,
    marginVertical: SPACING.lg,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  linkText: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.darkGray,
  },
  spacer: { flex: 1 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
  },
  logoutText: {
    color: colors.error,
    fontWeight: '700',
    fontSize: 15,
  },
  version: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    color: colors.mediumGray,
    fontSize: 11,
    opacity: 0.65,
  },
});
