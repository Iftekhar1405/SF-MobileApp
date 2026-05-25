import { api } from './api';
import type { Promotion } from '@/types/models';

export async function fetchPromotions(): Promise<Promotion[]> {
  const { data } = await api.get<{ promotions?: Promotion[] }>('/promotions');
  return data.promotions ?? [];
}
