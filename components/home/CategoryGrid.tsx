import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export function CategoryGrid() {
  const router = useRouter();
  
  const categories = [
    { id: 'pu', label: 'PU', bg: 'bg-blue-100' },
    { id: 'pvc', label: 'PVC', bg: 'bg-gray-200' },
    { id: 'eva', label: 'EVA', bg: 'bg-orange-100' },
    { id: 'air-blown', label: 'Air Blown', bg: 'bg-teal-100' },
    { id: 'hawai', label: 'Hawai', bg: 'bg-yellow-100' },
    { id: 'sports', label: 'Sports', bg: 'bg-red-100' },
  ];

  return (
    <View className="px-4 py-2 pb-6">
      <View className="flex-row flex-wrap justify-between">
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id}
            onPress={() => router.push(`/category/${cat.id}` as any)}
            className="w-[31%] mb-4 items-center"
          >
            <View className={`w-full aspect-square rounded-2xl ${cat.bg} mb-2 border border-light-gray items-center justify-center`}>
              <Text className="text-4xl">👟</Text>
            </View>
            <Text className="text-xs font-semibold text-dark-gray text-center">{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
