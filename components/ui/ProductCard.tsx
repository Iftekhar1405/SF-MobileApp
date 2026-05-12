import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Badge } from './Badge';
import { Button } from './Button';
import { QuantityStepper } from './QuantityStepper';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  stock: number;
  price: number;
  optionCount: number;
  badge?: string;
  cartQuantity: number;
  onAdd: () => void;
  onUpdateQuantity: (qty: number) => void;
}

export function ProductCard({
  id, image, name, stock, price, optionCount, badge, cartQuantity, onAdd, onUpdateQuantity
}: ProductCardProps) {
  const router = useRouter();
  
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock < 10;
  
  const handlePress = () => {
    router.push(`/product/${id}` as any);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      className="bg-white rounded-xl shadow-sm border border-light-gray w-[48%] mb-4 overflow-hidden"
    >
      <View className="relative w-full aspect-square bg-off-white items-center justify-center">
        {/* Placeholder for Image */}
        <Text className="text-6xl opacity-50">👟</Text>
        
        {badge && (
          <View className="absolute top-2 left-2 right-2">
            <Badge label={badge} className="bg-purple-100 w-full text-center py-1" />
          </View>
        )}
      </View>
      
      <View className="p-3">
        <Text className="font-bold text-dark-gray text-sm mb-2" numberOfLines={2}>{name}</Text>
        
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-bold text-success text-base">₹ {price.toLocaleString('en-IN')}</Text>
          {isOutOfStock ? (
            <Badge label="OUT OF STOCK" type="error" />
          ) : (
            <Badge label={`Stock: ${stock}`} type={isLowStock ? 'warning' : 'success'} />
          )}
        </View>
        
        {cartQuantity > 0 ? (
          <QuantityStepper 
            value={cartQuantity}
            onIncrement={() => onUpdateQuantity(cartQuantity + 1)}
            onDecrement={() => onUpdateQuantity(cartQuantity - 1)}
            optionLabel={`${optionCount} options`}
          />
        ) : (
          <View className="items-center">
            <Button 
              label="Add" 
              variant="outline" 
              onPress={onAdd}
              disabled={isOutOfStock}
              className="w-full py-1.5"
            />
            <Text className="text-[10px] text-medium-gray mt-1">{optionCount} options</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
