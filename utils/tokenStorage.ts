import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';

/**
 * expo-secure-store relies on native code; on web the bridge is missing and
 * getItemAsync throws. Use AsyncStorage for web only (acceptable for local dev).
 */
export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  }
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function setAuthToken(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, value);
}

export async function deleteAuthToken(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
