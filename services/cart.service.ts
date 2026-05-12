import { api } from './api';
import type { Cart } from '@/types/models';

export async function fetchCart(): Promise<Cart> {
  const { data } = await api.get<{ data: Cart }>('/cart');
  return data.data;
}

export async function addToCart(body: {
  productId: string;
  quantity: number;
  itemSet: { size: string; lengths: number }[];
  color: string;
}): Promise<Cart> {
  const { data } = await api.post<{ data: Cart }>('/cart/add-to-cart', body);
  return data.data;
}

export async function updateCartItem(
  itemId: string,
  body: { quantity?: number; itemSet?: unknown; color?: string }
): Promise<Cart> {
  const { data } = await api.patch<{ data: Cart }>(`/cart/${itemId}`, body);
  return data.data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const { data } = await api.delete<{ data: Cart }>(`/cart/${itemId}`);
  return data.data;
}
