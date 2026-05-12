import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/category.service';

export function useCategories(gender?: string) {
  return useQuery({
    queryKey: ['categories', gender ?? 'all'],
    queryFn: () => fetchCategories(gender),
  });
}
