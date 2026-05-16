import { api } from './api';
import type { GenderApiValue } from '@/constants/genders';

export type GenderWithCount = {
  id: GenderApiValue;
  label: string;
  count: number;
};

export async function fetchGendersWithCounts(): Promise<GenderWithCount[]> {
  const { data } = await api.get<{
    success?: boolean;
    genders: GenderWithCount[];
  }>('/search/genders');
  return data.genders ?? [];
}
