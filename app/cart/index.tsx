import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useCartStore } from '../../store/cartStore';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { Button } from '../../components/ui/Button';
import Toast from 'react-native-toast-message';

export default function CartScreen() {
  const router = useRouter();
  const { items, totalValue, totalCartons, totalPieces, moqWarnings, updateQuantity, removeItem, clearCart } = useCartStore();
  const [notes, setNotes] = useState('');

  const handleRemove = (id: string) => {
    removeItem(id);
    Toast.show({
      type: 'info',
      text1: 'Removed from Cart',
      position: 'bottom'
    });
  };

  const hasViolations = moqWarnings.some(w => w.isViolating);

  return (
    <SafeAreaView className="flex-1 bg-off-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-light-gray">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark-gray flex-1">Cart</Text>
        <TouchableOpacity>
          <Ionicons name="qr-code-outline" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quick Add Bar */}
        <View className="p-4 flex-row items-center">
          <View className="flex-1 bg-white border border-light-gray rounded-xl px-4 py-3 mr-3 flex-row items-center">
            <Ionicons name="search" size={20} color={Colors.mediumGray} />
            <TextInput 
              placeholder="Search product to add..."
              className="flex-1 ml-2 text-dark-gray"
            />
          </View>
          <TouchableOpacity className="bg-primary px-4 py-3 rounded-xl">
            <Text className="text-white font-bold">Search</Text>
          </TouchableOpacity>
        </View>

        {/* MOQ Warning Table */}
        {moqWarnings.length > 0 && (
          <View className="mx-4 mb-4 bg-white rounded-xl overflow-hidden border border-warning">
            <View className="bg-warning/10 p-3 border-b border-warning/20">
              <Text className="font-bold text-warning">MOQ - By Product Category</Text>
            </View>
            <View className="flex-row p-3 border-b border-light-gray bg-off-white">
              <Text className="flex-1 font-semibold text-xs text-medium-gray">Name</Text>
              <Text className="w-16 font-semibold text-xs text-medium-gray text-center">Min Qty</Text>
              <Text className="w-16 font-semibold text-xs text-medium-gray text-center">Cart Qty</Text>
            </View>
            {moqWarnings.map((warning, index) => (
              <View key={index} className="flex-row p-3 border-b border-light-gray items-center">
                <View className="flex-1 flex-row items-center">
                  {warning.isViolating && <Ionicons name="warning" size={14} color={Colors.error} className="mr-1" />}
                  <Text className={`font-semibold ${warning.isViolating ? 'text-error' : 'text-dark-gray'}`}>
                    {warning.categoryName}
                  </Text>
                </View>
                <Text className="w-16 text-center text-dark-gray">{warning.minQty}</Text>
                <Text className={`w-16 text-center font-bold ${warning.isViolating ? 'text-error' : 'text-success'}`}>
                  {warning.cartQty}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Cart Items */}
        <View className="px-4 pb-4 space-y-4">
          {items.map(item => (
            <View key={item.id} className="bg-white p-3 rounded-xl border border-light-gray flex-row mb-3">
              <View className="w-20 h-20 bg-off-white rounded-lg items-center justify-center mr-3">
                <Text className="text-3xl">👟</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-2">
                    <Text className="text-xs text-medium-gray">{item.sku}</Text>
                    <Text className="font-bold text-dark-gray mt-1" numberOfLines={2}>{item.productName}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemove(item.id)} className="p-1">
                    <Ionicons name="trash-outline" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                
                <Text className="text-medium-gray text-xs mt-1">
                  {item.cartonInfo} | Total {item.quantity * item.piecesPerCarton} Pcs
                </Text>
                
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="font-bold text-success text-base">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                  <QuantityStepper 
                    value={item.quantity} 
                    onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                </View>
              </View>
            </View>
          ))}
          
          {items.length === 0 && (
            <View className="py-12 items-center">
              <Ionicons name="cart-outline" size={64} color={Colors.lightGray} />
              <Text className="text-medium-gray mt-4 text-lg">Your cart is empty</Text>
            </View>
          )}
        </View>

        {/* Order Details Summary */}
        {items.length > 0 && (
          <View className="mx-4 mb-32 bg-white rounded-xl border border-light-gray p-4">
            <Text className="font-bold text-lg text-dark-gray border-b border-light-gray pb-3 mb-3">Order Details</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-medium-gray">Total Cartons</Text>
              <Text className="font-bold text-dark-gray">{totalCartons}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-medium-gray">Total Pieces</Text>
              <Text className="font-bold text-dark-gray">{totalPieces}</Text>
            </View>
            
            <View className="border border-light-gray rounded-lg p-3 mb-4 bg-off-white">
              <TextInput 
                placeholder="Add order notes here..."
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
            
            <View className="flex-row items-center justify-between border-t border-light-gray pt-4">
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color={Colors.primary} className="mr-2" />
                <Text className="text-dark-gray font-medium">Deliver to</Text>
              </View>
              <TouchableOpacity>
                <Text className="text-primary font-bold">+ Add Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-light-gray p-4 flex-row items-center justify-between shadow-lg">
          <View>
            <Text className="text-medium-gray text-xs">Order Value</Text>
            <Text className="font-bold text-lg text-dark-gray">₹ {totalValue.toLocaleString('en-IN')}</Text>
          </View>
          <Button 
            label="Place Order" 
            onPress={() => {
              if (hasViolations) {
                Toast.show({
                  type: 'error',
                  text1: 'MOQ Not Met',
                  text2: 'Please add required quantities.'
                });
              } else {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Order placed successfully!'
                });
                clearCart();
                router.push('/(tabs)/payment');
              }
            }} 
            className="px-8"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
