import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export function GenderGrid() {
  const router = useRouter();
  const genders = [
    { id: 'mens', label: "MEN'S", color: 'bg-teal-600' },
    { id: 'womens', label: "WOMEN'S", color: 'bg-pink-600' },
    { id: 'kids', label: "KIDS'", color: 'bg-green-600' },
  ];

  return (
    <View className="px-4 py-2">
      <View className="flex-row justify-between">
        {genders.map((item) => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => router.push(`/category/${item.id}` as any)}
            className={`${item.color} w-[31%] aspect-square rounded-2xl p-3 justify-end overflow-hidden relative`}
          >
            {/* Watermark Logo Placeholder */}
            <View className="absolute -right-4 -top-4 opacity-10">
              <Text className="text-white text-5xl font-black">SF</Text>
            </View>
            <Text className="text-white font-bold text-sm z-10">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
