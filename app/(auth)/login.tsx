import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { api } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter both email/mobile and password',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Determine if identifier is an email or mobile based on simple check
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier, password } : { mobile: identifier, password };
      
      const { data } = await api.post('/auth/login', payload);
      console.log(data);
      // Assuming response contains token and user object
      await login(data.token, data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Successfully logged in.',
      });
      
      router.replace('/(tabs)');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          
          <View className="items-center mb-12">
            {/* Placeholder for Logo */}
            <View className="w-24 h-24 bg-primary rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">SF</Text>
            </View>
            <Text className="text-3xl font-bold text-primary tracking-tight">SALIM FOOTWEAR</Text>
            <Text className="text-medium-gray mt-2 tracking-widest uppercase text-xs font-semibold">Since 1956</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-dark-gray font-semibold mb-2">Mobile Number or Email</Text>
              <TextInput
                className="bg-off-white border border-light-gray rounded-xl p-4 text-base"
                placeholder="Enter mobile or email"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="mt-4">
              <Text className="text-dark-gray font-semibold mb-2">Password</Text>
              <View className="flex-row items-center bg-off-white border border-light-gray rounded-xl">
                <TextInput
                  className="flex-1 p-4 text-base"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-4"
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color={Colors.mediumGray} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center mt-4">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${rememberMe ? 'bg-primary border-primary' : 'border-medium-gray'}`}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-dark-gray">Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text className="text-primary font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8">
              <Button 
                label="Sign In" 
                onPress={handleLogin} 
                isLoading={isLoading} 
              />
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
