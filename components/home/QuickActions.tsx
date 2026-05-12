import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

export function QuickActions() {
  const router = useRouter();
  
  const actions = [
    { id: 1, label: 'Shop Now', icon: 'cart-outline', route: '/(tabs)/shop' },
    { id: 2, label: 'Reorder', icon: 'refresh-outline', route: '/(tabs)/shop' },
    { id: 3, label: 'Orders', icon: 'cube-outline', route: '/(tabs)/payment' },
    { id: 4, label: 'Support', icon: 'chatbubbles-outline', route: '/(tabs)/index' },
  ];

  return (
    <View className="px-4 py-3">
      <View className="flex-row justify-between">
        {actions.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            className="items-center w-[22%]"
            onPress={() => router.push(action.route as any)}
          >
            <View className="bg-white w-14 h-14 rounded-2xl items-center justify-center border border-light-gray shadow-sm mb-2">
              <Ionicons name={action.icon as any} size={24} color={Colors.primary} />
            </View>
            <Text className="text-xs text-dark-gray text-center font-medium" numberOfLines={2}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
