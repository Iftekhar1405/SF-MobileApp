import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Button } from '../ui/Button';
import { QuantityStepper } from '../ui/QuantityStepper';

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  price: number;
  mrp?: number;
  cartonInfo: string;
  cartQty: number;
}

interface ProductOptionsModalProps {
  visible: boolean;
  productId: string;
  productName: string;
  options: ProductOption[];
  onClose: () => void;
  onQuantityChange: (optionId: string, qty: number) => void;
}

export function ProductOptionsModal({ 
  visible, productName, options, onClose, onQuantityChange 
}: ProductOptionsModalProps) {
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl min-h-[50%] max-h-[80%] pb-8">
              
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-light-gray">
                <Text className="text-lg font-bold text-dark-gray flex-1" numberOfLines={1}>
                  {productName} - All Options
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1 bg-light-gray rounded-full">
                  <Ionicons name="close" size={24} color={Colors.darkGray} />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
                {options.map((opt) => (
                  <View key={opt.id} className="flex-row items-center py-4 border-b border-light-gray">
                    <View className="w-16 h-16 bg-off-white rounded-lg items-center justify-center mr-3 border border-light-gray">
                      <Text className="text-2xl">👟</Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-dark-gray font-bold">{opt.name}</Text>
                      <Text className="text-medium-gray text-xs mt-1">{opt.sku}</Text>
                      <Text className="text-medium-gray text-xs mt-1">{opt.cartonInfo}</Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-success font-bold">₹ {opt.price.toLocaleString('en-IN')}</Text>
                        {opt.mrp && (
                          <Text className="text-medium-gray text-xs line-through ml-2">₹ {opt.mrp.toLocaleString('en-IN')}</Text>
                        )}
                      </View>
                    </View>
                    
                    <View className="ml-2">
                      {opt.cartQty > 0 ? (
                        <QuantityStepper 
                          value={opt.cartQty} 
                          onIncrement={() => onQuantityChange(opt.id, opt.cartQty + 1)}
                          onDecrement={() => onQuantityChange(opt.id, opt.cartQty - 1)}
                        />
                      ) : (
                        <Button 
                          label="Add" 
                          variant="outline" 
                          onPress={() => onQuantityChange(opt.id, 1)} 
                        />
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <View className="px-4 pt-4">
                <Button label="Done" onPress={onClose} />
              </View>
              
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
