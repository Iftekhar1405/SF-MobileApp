import { api } from './api';

export type CategoryRow = { category: string; image?: string };

export async function fetchCategories(gender?: string): Promise<CategoryRow[]> {
  const { data } = await api.get<{
    success?: boolean;
    data: CategoryRow[];
  }>('/search/category', { params: { gender } });
  return data.data ?? [];
}
