import React from 'react';
import { View, ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

export function PromoCarousel() {
  const banners = [
    { id: 1, color: 'bg-orange-500' },
    { id: 2, color: 'bg-primary' },
    { id: 3, color: 'bg-purple-500' },
  ];

  return (
    <View className="my-2">
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
      >
        {banners.map((banner) => (
          <View 
            key={banner.id} 
            style={{ width }} 
            className="px-4 py-2"
          >
            <View className={`h-40 rounded-xl ${banner.color} items-center justify-center overflow-hidden`}>
              {/* Using a placeholder view for the banner image */}
              <View className="absolute inset-0 bg-black/10" />
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row justify-center mt-2 space-x-2">
        {banners.map((_, index) => (
          <View key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-light-gray'}`} />
        ))}
      </View>
    </View>
  );
}
