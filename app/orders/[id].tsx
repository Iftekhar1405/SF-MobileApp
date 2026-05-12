import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Badge } from '../../components/ui/Badge';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-off-white" edges={['top']}>
      <View className="flex-row items-center p-4 bg-white border-b border-light-gray">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark-gray flex-1">Order Details</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Order Header */}
        <View className="bg-white rounded-xl border border-light-gray p-4 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-medium-gray text-xs">Order ID</Text>
              <Text className="font-bold text-dark-gray text-lg">{id}</Text>
            </View>
            <Badge label="Confirmed" type="success" />
          </View>
          
          <View className="flex-row justify-between">
            <View>
              <Text className="text-medium-gray text-xs">Date</Text>
              <Text className="font-medium text-dark-gray mt-1">Oct 21, 2026</Text>
            </View>
            <View>
              <Text className="text-medium-gray text-xs text-right">Total Amount</Text>
              <Text className="font-bold text-success mt-1 text-lg">₹ 1,28,900</Text>
            </View>
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white rounded-xl border border-light-gray p-4 mb-4">
          <View className="flex-row items-center mb-3 border-b border-light-gray pb-3">
            <Ionicons name="location" size={20} color={Colors.primary} className="mr-2" />
            <Text className="font-bold text-dark-gray">Delivery Address</Text>
          </View>
          <Text className="font-bold text-dark-gray">M/S SALIM FOOTWEAR</Text>
          <Text className="text-medium-gray mt-1">Main Market Road, Near Post Office</Text>
          <Text className="text-medium-gray">Surguja, Chhattisgarh 497001</Text>
          <Text className="text-medium-gray mt-2 font-medium">GSTIN: 22AUOPS4519C3ZM</Text>
        </View>

        {/* Order Items */}
        <Text className="font-bold text-dark-gray mb-3 ml-1">Items (48)</Text>
        <View className="bg-white rounded-xl border border-light-gray p-4 mb-8">
          {[1, 2].map((_, i) => (
            <View key={i} className={`flex-row py-3 ${i === 0 ? 'border-b border-light-gray' : ''}`}>
              <View className="w-16 h-16 bg-off-white rounded-lg items-center justify-center mr-3">
                <Text className="text-2xl">👟</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-dark-gray mb-1" numberOfLines={1}>PUG 8508 | OLIVE GREEN</Text>
                <Text className="text-medium-gray text-xs">11T51996930 • Carton of 30</Text>
                <View className="flex-row justify-between items-end mt-2">
                  <Text className="font-medium text-dark-gray">Qty: 24 cartons</Text>
                  <Text className="font-bold text-success">₹ 64,450</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
