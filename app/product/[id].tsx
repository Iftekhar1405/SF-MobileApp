import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { ProductOptionsModal } from '../../components/modals/ProductOptionsModal';
import { Button } from '../../components/ui/Button';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Mock Data
  const product = {
    id: id as string,
    name: 'PUG 8508 | OLIVE GREEN | 6X9',
    sku: '11T51996930',
    price: 5696.70,
    basePrice: 319,
    dealerPrice: 189.89,
    cartonInfo: 'Carton of 30',
    options: [
      { id: 'o1', name: 'OLIVE GREEN | 6X9', sku: '11T51996930', price: 5696.70, mrp: 9570, cartonInfo: 'Carton of 30', cartQty: 0 },
      { id: 'o2', name: 'TAN | 6X9', sku: '11T51996931', price: 5696.70, mrp: 9570, cartonInfo: 'Carton of 30', cartQty: 1 },
    ]
  };

  const [options, setOptions] = useState(product.options);

  const handleQuantityChange = (optionId: string, qty: number) => {
    setOptions(opts => opts.map(o => o.id === optionId ? { ...o, cartQty: Math.max(0, qty) } : o));
  };

  const totalSelected = options.reduce((sum, opt) => sum + opt.cartQty, 0);

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header over Image */}
      <View className="absolute top-10 left-4 z-10 bg-black/20 rounded-full p-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Viewer Placeholder */}
        <View className="w-full h-96 bg-off-white items-center justify-center">
          <Text className="text-8xl">👟</Text>
        </View>
        
        {/* Product Info */}
        <View className="p-4 border-b border-light-gray">
          <Text className="text-2xl font-bold text-dark-gray">{product.name}</Text>
          <Text className="text-medium-gray mt-1">{product.sku}</Text>
          
          <View className="mt-4">
            <Text className="text-2xl font-bold text-success">
              ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
            <Text className="text-medium-gray text-xs mt-1">
              for {product.cartonInfo} <Text className="font-bold text-dark-gray">(Excl. GST)</Text>
            </Text>
          </View>
          
          <View className="flex-row mt-4 space-x-4">
            <View className="bg-off-white p-3 rounded-lg flex-1">
              <Text className="text-medium-gray text-xs">Base Price</Text>
              <Text className="font-bold text-dark-gray mt-1">₹ {product.basePrice} / unit</Text>
            </View>
            <View className="bg-off-white p-3 rounded-lg flex-1">
              <Text className="text-medium-gray text-xs">Dealer Price</Text>
              <Text className="font-bold text-success mt-1">₹ {product.dealerPrice} / unit</Text>
            </View>
          </View>
        </View>

        {/* Select Options Section */}
        <View className="p-4 pb-32">
          <Text className="font-bold text-lg mb-3">Colour</Text>
          <View className="flex-row mb-6">
            <View className="bg-primary px-4 py-2 rounded-full mr-2">
              <Text className="text-white font-bold">OLIVE GREEN</Text>
            </View>
            <View className="border border-light-gray px-4 py-2 rounded-full">
              <Text className="text-dark-gray">TAN</Text>
            </View>
          </View>
          
          <Text className="font-bold text-lg mb-3">Sizes</Text>
          <View className="flex-row">
            <View className="bg-primary px-4 py-2 rounded-full mr-2">
              <Text className="text-white font-bold">6X9</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-light-gray p-4 flex-row items-center justify-between pb-8 shadow-md">
        <Text className="font-bold text-dark-gray">
          {product.options.length} Options Available
        </Text>
        <Button 
          label={totalSelected > 0 ? `Update (${totalSelected})` : "Add Item"} 
          onPress={() => setModalVisible(true)} 
        />
      </View>

      <ProductOptionsModal 
        visible={modalVisible}
        productId={product.id}
        productName={product.name}
        options={options}
        onClose={() => setModalVisible(false)}
        onQuantityChange={handleQuantityChange}
      />
    </View>
  );
}
