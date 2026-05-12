import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { ProductCard } from '../../components/ui/ProductCard';

export default function ShopScreen() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const filters = ['ALL', 'IN STOCK', 'Sort By', 'Collections'];
  
  // Mock Data
  const products = [
    { id: '1', name: 'LILY 125 | CYAN | 3X6 | Carton of 60', price: 145, stock: 20, optionCount: 4, cartQty: 0 },
    { id: '2', name: 'PUG 8508 | OLIVE GREEN | 6X9 | Carton of 30', price: 5696, stock: 4, optionCount: 2, badge: 'POILA BAISHAK SPECIAL', cartQty: 1 },
    { id: '3', name: 'MEDICARE | BLUE | 8X10 | Carton of 48', price: 5057, stock: 0, optionCount: 1, cartQty: 0 },
    { id: '4', name: 'SPORTS 10 | BLACK | 7X10 | Carton of 40', price: 2999, stock: 50, optionCount: 5, cartQty: 0 },
  ];

  return (
    <View className="flex-1 bg-off-white">
      {/* Search Header */}
      <View className="bg-white px-4 py-3 border-b border-light-gray flex-row items-center">
        <View className="flex-1 bg-off-white flex-row items-center px-3 py-2 rounded-xl">
          <Ionicons name="search" size={20} color={Colors.mediumGray} />
          <TextInput 
            className="flex-1 ml-2 text-dark-gray"
            placeholder="Search any product"
          />
        </View>
        <TouchableOpacity className="ml-4 relative">
          <Ionicons name="cart-outline" size={26} color={Colors.darkGray} />
          <View className="absolute -top-1 -right-2 bg-primary rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-white text-[10px] font-bold">1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View className="bg-white py-2 border-b border-light-gray">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`mr-2 px-4 py-1.5 rounded-full border ${activeFilter === filter ? 'bg-primary border-primary' : 'bg-transparent border-light-gray'}`}
            >
              <Text className={`text-sm font-semibold ${activeFilter === filter ? 'text-white' : 'text-dark-gray'}`}>
                {filter} {filter === 'Sort By' || filter === 'Collections' ? '▾' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Grid */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between pb-24">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              image=""
              name={p.name}
              price={p.price}
              stock={p.stock}
              optionCount={p.optionCount}
              badge={p.badge}
              cartQuantity={p.cartQty}
              onAdd={() => {}}
              onUpdateQuantity={() => {}}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
