import React from 'react';
import { Tabs as ExpoTabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { AppHeader } from '../../components/layout/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-white" />
      <AppHeader />
      <ExpoTabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.mediumGray,
          tabBarStyle: {
            borderTopColor: Colors.lightGray,
            backgroundColor: Colors.white,
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          }
        }}>
        <ExpoTabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <ExpoTabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
          }}
        />
        <ExpoTabs.Screen
          name="payment"
          options={{
            title: 'Payment',
            tabBarIcon: ({ color }) => <Ionicons name="card" size={24} color={color} />,
          }}
        />
      </ExpoTabs>
    </View>
  );
}
