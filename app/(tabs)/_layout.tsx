import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useProfile } from '@/hooks/useProfile';

export default function TabLayout() {
  const { data } = useProfile();
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, setProfile]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={() => (
          <View style={{ backgroundColor: '#fff' }}>
            <BottomTabBar />
          </View>
        )}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
        <Tabs.Screen name="payment" options={{ title: 'Payment' }} />
      </Tabs>
    </View>
  );
}
