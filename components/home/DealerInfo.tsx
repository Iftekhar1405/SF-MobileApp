import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export function DealerInfo() {
  const user = useAuthStore(state => state.user);

  return (
    <View className="mx-4 my-2 bg-white rounded-xl p-4 border border-light-gray">
      <Text className="text-lg font-bold text-dark-gray uppercase">
        {user?.name || 'M/S SALIM FOOTWEAR'}
      </Text>
      <Text className="text-medium-gray mt-1 font-medium">SURGUJA</Text>
      <View className="h-[1px] bg-light-gray my-3" />
      <View className="flex-row justify-between">
        <Text className="text-medium-gray text-xs">GSTIN/Code: 22AUOPS4519C3ZM</Text>
      </View>
      <Text className="text-medium-gray text-xs mt-1">Seller Name: Ajanta Shoes India Pvt. Ltd.</Text>
    </View>
  );
}
