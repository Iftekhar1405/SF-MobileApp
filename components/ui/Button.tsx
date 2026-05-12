import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({ 
  label, 
  onPress, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  className = '',
  textClassName = ''
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      onPress={onPress}
      className={`
        flex-row items-center justify-center
        ${isPrimary ? 'bg-primary rounded-full px-6 py-3' : ''}
        ${isOutline ? 'border border-success bg-transparent rounded-md px-4 py-2' : ''}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? Colors.white : Colors.success} />
      ) : (
        <Text
          className={`
            font-bold
            ${isPrimary ? 'text-white text-base' : ''}
            ${isOutline ? 'text-success text-sm' : ''}
            ${textClassName}
          `}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
