import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ProfileDrawer } from '@/components/layout/ProfileDrawer';
import { TabScreenHeader } from '@/components/layout/TabScreenHeader';
import { DealerProfileCard } from '@/components/home/DealerProfileCard';
import { RelationshipManagerCard } from '@/components/home/RelationshipManagerCard';
import { PromotionCarousel } from '@/components/promotions/PromotionCarousel';
import { SearchBar } from '@/components/ui/SearchBar';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { useCartQuery } from '@/hooks/useCart';
import { usePromotions } from '@/hooks/usePromotions';
import { useUserStore } from '@/store/userStore';
import { cartDisplayQty } from '@/utils/cartLines';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [drawer, setDrawer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data: cart, refetch: refetchCart } = useCartQuery();
  const {
    data: promotions,
    isLoading: promotionsLoading,
    refetch: refetchPromotions,
  } = usePromotions();
  const cartCount = cartDisplayQty(cart);
  const banners = promotions ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchCart(), refetchPromotions()]);
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
        {promotionsLoading ? (
          <SkeletonBox height={160} style={styles.bannerSkeleton} />
        ) : (
          <PromotionCarousel promotions={banners} />
        )}
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
  bannerSkeleton: {
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
});
