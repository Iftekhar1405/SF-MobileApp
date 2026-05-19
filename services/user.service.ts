import { api } from './api';
import type { User } from '@/types/models';

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/users/me');
  return data.user;
}

export async function fetchUserById(id: string): Promise<User> {
  const { data } = await api.get<{ user: User }>(`/users/${id}`);
  return data.user;
}

export type UpdateProfileBody = {
  name?: string;
  shopName?: string;
  address?: string;
  deliveryAddress?: string;
  pincode?: string;
  landmark?: string;
};

export async function updateCurrentUser(body: UpdateProfileBody): Promise<User> {
  const { data } = await api.patch<{ user: User }>('/users/me', body);
  return data.user;
}
