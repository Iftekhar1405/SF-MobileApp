import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-dark-gray mb-4 text-center">Reset Password</Text>
      <Text className="text-medium-gray text-center mb-8">
        Enter your mobile number or email to receive an OTP.
      </Text>
      
      <Button 
        label="Back to Login" 
        variant="outline" 
        onPress={() => router.back()} 
      />
    </SafeAreaView>
  );
}
