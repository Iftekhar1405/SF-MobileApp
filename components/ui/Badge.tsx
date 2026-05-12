import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  className?: string;
}

export function Badge({ label, type = 'neutral', className = '' }: BadgeProps) {
  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'error':
        return 'bg-error text-white';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'neutral':
      default:
        return 'bg-light-gray text-dark-gray';
    }
  };

  const colors = getColors();
  const bgClass = colors.split(' ')[0];
  const textClass = colors.split(' ')[1];

  return (
    <View className={`rounded-full px-2 py-1 self-start ${bgClass} ${className}`}>
      <Text className={`text-xs font-bold ${textClass}`}>
        {label}
      </Text>
    </View>
  );
}
