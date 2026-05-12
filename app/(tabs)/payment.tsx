import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../../components/ui/Badge';

export default function PaymentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Active Orders');
  
  const tabs = ['Active Orders', 'Order History'];
  
  // Mock Orders
  const orders = [
    { id: 'ORD-58392', date: 'Oct 24, 2026', items: 12, value: 34500, status: 'Pending' },
    { id: 'ORD-58390', date: 'Oct 21, 2026', items: 48, value: 128900, status: 'Confirmed' },
    { id: 'ORD-58201', date: 'Oct 15, 2026', items: 24, value: 56000, status: 'Dispatched' },
    { id: 'ORD-58110', date: 'Oct 05, 2026', items: 8, value: 15400, status: 'Delivered' },
  ];

  const filteredOrders = activeTab === 'Active Orders' 
    ? orders.filter(o => o.status !== 'Delivered')
    : orders.filter(o => o.status === 'Delivered');

  return (
    <View className="flex-1 bg-off-white">
      {/* Top Tabs */}
      <View className="flex-row bg-white border-b border-light-gray">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center py-4 border-b-2 ${activeTab === tab ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-bold ${activeTab === tab ? 'text-primary' : 'text-medium-gray'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {filteredOrders.map(order => (
          <TouchableOpacity 
            key={order.id}
            onPress={() => router.push(`/orders/${order.id}`)}
            className="bg-white rounded-xl border border-light-gray p-4 mb-3"
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-bold text-dark-gray">{order.id}</Text>
              <Badge 
                label={order.status} 
                type={
                  order.status === 'Delivered' ? 'neutral' : 
                  order.status === 'Dispatched' ? 'info' : 
                  order.status === 'Confirmed' ? 'success' : 'warning'
                } 
              />
            </View>
            
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-medium-gray text-xs">Date</Text>
                <Text className="text-dark-gray font-medium mt-1">{order.date}</Text>
              </View>
              <View>
                <Text className="text-medium-gray text-xs text-center">Items</Text>
                <Text className="text-dark-gray font-medium mt-1 text-center">{order.items}</Text>
              </View>
              <View>
                <Text className="text-medium-gray text-xs text-right">Value</Text>
                <Text className="text-success font-bold mt-1 text-right">₹ {order.value.toLocaleString('en-IN')}</Text>
              </View>
            </View>
            
            <View className="border-t border-light-gray pt-3 mt-1 flex-row items-center justify-between">
              <Text className="text-medium-gray text-xs">View Details</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.mediumGray} />
            </View>
          </TouchableOpacity>
        ))}
        
        {filteredOrders.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="receipt-outline" size={64} color={Colors.lightGray} />
            <Text className="text-medium-gray mt-4">No {activeTab.toLowerCase()} found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
