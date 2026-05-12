import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { DealerInfo } from '../../components/home/DealerInfo';
import { QuickActions } from '../../components/home/QuickActions';
import { PromoCarousel } from '../../components/home/PromoCarousel';
import { GenderGrid } from '../../components/home/GenderGrid';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { SectionHeader } from '../../components/home/SectionHeader';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      className="flex-1 bg-off-white" 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <DealerInfo />
      <QuickActions />
      <PromoCarousel />
      
      <SectionHeader title="Shop By Gender" />
      <GenderGrid />
      
      <SectionHeader title="Shop By Category" onSeeAll={() => router.push('/(tabs)/shop')} />
      <CategoryGrid />
      
      <SectionHeader title="Shop By Brand" onSeeAll={() => router.push('/(tabs)/shop')} />
      {/* Brand Grid will be implemented similarly */}
    </ScrollView>
  );
}
