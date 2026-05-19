import axios from 'axios';
import { api } from './api';
import type { Order } from '@/types/models';

export type PlaceOrderBody = {
  useShopAddress?: boolean;
  deliveryAddress?: string;
  pincode?: string;
  landmark?: string;
};

export async function placeOrder(body?: PlaceOrderBody): Promise<Order> {
  const { data } = await api.post<{ data: Order }>('/order', body ?? {});
  return data.data;
}

export async function fetchOrderHistory(): Promise<Order[]> {
  try {
    const { data } = await api.get<{
      data?: Order[];
      success?: boolean;
      msg?: string;
    }>('/order/history');
    return data.data ?? [];
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return [];
    throw e;
  }
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  const { data } = await api.get<{ data: Order }>(`/order/${orderId}`);
  return data.data;
}
