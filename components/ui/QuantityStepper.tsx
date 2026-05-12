import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface QtyStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  optionLabel?: string;
}

export function QuantityStepper({ value, onIncrement, onDecrement, optionLabel }: QtyStepperProps) {
  return (
    <View className="items-center">
      <View className="flex-row items-center border border-success rounded-md overflow-hidden">
        <TouchableOpacity 
          onPress={onDecrement}
          className="px-3 py-2 bg-transparent items-center justify-center"
        >
          <Ionicons name="remove" size={16} color={Colors.success} />
        </TouchableOpacity>
        
        <View className="px-4 py-2 items-center justify-center">
          <Text className="font-bold text-success">{value}</Text>
        </View>

        <TouchableOpacity 
          onPress={onIncrement}
          className="px-3 py-2 bg-transparent items-center justify-center"
        >
          <Ionicons name="add" size={16} color={Colors.success} />
        </TouchableOpacity>
      </View>
      
      {optionLabel && (
        <Text className="text-xs text-medium-gray mt-1">{optionLabel}</Text>
      )}
    </View>
  );
}
