import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { ProfileDrawer } from '@/components/layout/ProfileDrawer';
import { TabScreenHeader } from '@/components/layout/TabScreenHeader';
import { DealerProfileCard } from '@/components/home/DealerProfileCard';
import { RelationshipManagerCard } from '@/components/home/RelationshipManagerCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { colors } from '@/constants/colors';
import { MOCK_BANNERS } from '@/constants/mockBanners';
import { RADIUS, SPACING } from '@/constants/theme';
import { useCartQuery } from '@/hooks/useCart';
import { useUserStore } from '@/store/userStore';
import { cartDisplayQty } from '@/utils/cartLines';

const { width: SCREEN_W } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [drawer, setDrawer] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const cartCount = cartDisplayQty(cart);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchCart();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TabScreenHeader
        cartCount={cartCount}
        onMenuPress={() => setDrawer(true)}>
        <SearchBar
          onPress={() => router.push('/search')}
          style={styles.searchBar}
        />
      </TabScreenHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <DealerProfileCard profile={profile} />
       
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.quickRow}>
          {[
            { label: 'Shop Now', icon: '🛒', href: '/(tabs)/shop' },
            { label: 'Reorder', icon: '🔄', href: '/(tabs)/payment' },
            { label: 'Orders', icon: '📦', href: '/orders' },
            { label: 'Support', icon: '💬', href: '/(tabs)/payment' },
          ].map((q) => (
            <Pressable
              key={q.label}
              style={styles.quickCard}
              onPress={() => router.push(q.href as '/(tabs)/shop')}>
              <Text style={{ fontSize: 22 }}>{q.icon}</Text>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Promotions</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setBannerIdx(Math.round(x / SCREEN_W));
          }}
          scrollEventThrottle={16}
          style={styles.bannerScroll}>
          {MOCK_BANNERS.map((b) => (
            <Image
              key={b.id}
              source={{ uri: b.uri }}
              style={styles.banner}
              contentFit="cover"
            />
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {MOCK_BANNERS.map((b, i) => (
            <View
              key={b.id}
              style={[styles.dot, i === bannerIdx && styles.dotActive]}
            />
          ))}
        </View>
        <RelationshipManagerCard />

      </ScrollView>

      <ProfileDrawer
        visible={drawer}
        onClose={() => setDrawer(false)}
        user={profile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  searchBar: { marginTop: SPACING.xs },
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl + 88,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    color: colors.darkGray,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickCard: {
    width: '22%',
    minWidth: 72,
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  quickLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerScroll: {
    marginHorizontal: -SPACING.md,
    marginBottom: SPACING.sm,
  },
  banner: {
    width: SCREEN_W,
    height: 160,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGray,
  },
  dotActive: { backgroundColor: colors.primary },
});
