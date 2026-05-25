import { api } from './api';
import type { Promotion } from '@/types/models';

export async function fetchPromotions(): Promise<Promotion[]> {
  const { data } = await api.get<{
    success?: boolean;
    count?: number;
    promotions?: Promotion[];
    data?: Promotion[];
  }>('/promotions');
  if (Array.isArray(data.promotions)) return data.promotions;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}
