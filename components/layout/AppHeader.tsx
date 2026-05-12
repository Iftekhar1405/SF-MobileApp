import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

export function AppHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-light-gray">
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="menu" size={28} color={Colors.darkGray} />
      </TouchableOpacity>
      
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold text-primary tracking-tight">SALIM FOOTWEAR</Text>
      </View>
      
      <View className="flex-row items-center gap-4">
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/cart')} className="relative">
          <Ionicons name="cart-outline" size={26} color={Colors.darkGray} />
          {/* Mocked cart badge for now */}
          <View className="absolute -top-1 -right-2 bg-primary rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-white text-[10px] font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
