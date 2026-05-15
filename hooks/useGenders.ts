import { useQuery } from '@tanstack/react-query';
import { GENDER_OPTIONS } from '@/constants/genders';
import { fetchGendersWithCounts } from '@/services/gender.service';

export function useGendersWithCounts() {
  return useQuery({
    queryKey: ['genders'],
    queryFn: fetchGendersWithCounts,
    staleTime: 60_000,
    placeholderData: GENDER_OPTIONS.map((g) => ({
      id: g.apiValue,
      label: g.label,
      count: 0,
    })),
  });
}
