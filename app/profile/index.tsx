import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Account Details', route: '' },
    { icon: 'location-outline', label: 'Delivery Addresses', route: '' },
    { icon: 'business-outline', label: 'Tax & GSTIN Info', route: '' },
    { icon: 'notifications-outline', label: 'Notifications', route: '' },
    { icon: 'chatbubbles-outline', label: 'Support Tickets', route: '' },
    { icon: 'settings-outline', label: 'Settings', route: '' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-off-white" edges={['top']}>
      <View className="flex-row items-center p-4 bg-white border-b border-light-gray">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark-gray">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View className="bg-primary p-6 items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-primary">
              {user?.name?.charAt(0) || 'S'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-white">{user?.name || 'M/S SALIM FOOTWEAR'}</Text>
          <Text className="text-white/80 mt-1">{user?.mobile || '+91 9876543210'}</Text>
          <View className="bg-white/20 px-3 py-1 rounded-full mt-3 border border-white/40">
            <Text className="text-white text-xs font-semibold">GSTIN: 22AUOPS4519C3ZM</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-4 bg-white border-y border-light-gray">
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.label}
              className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-light-gray' : ''}`}
            >
              <View className="w-8 items-center justify-center mr-2">
                <Ionicons name={item.icon as any} size={22} color={Colors.darkGray} />
              </View>
              <Text className="flex-1 text-dark-gray font-medium">{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="m-4 mt-8 bg-white border border-error rounded-xl p-4 flex-row items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} className="mr-2" />
          <Text className="font-bold text-error ml-2">Log Out</Text>
        </TouchableOpacity>
        
        <Text className="text-center text-medium-gray text-xs mb-8">App Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
