import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Assuming the API is running locally or a deployed URL
// Make sure to replace this with the actual URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1' || 'https://saleem-footwear-api.vercel.app/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
      // In a real app we might emit an event or use a ref to navigate
      // router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);
