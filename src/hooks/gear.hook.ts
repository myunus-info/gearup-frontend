import { getCategories, getGearById, getGears } from '@/api';
import type { GearFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useGears(filters: GearFilterParams = {}) {
  return useQuery({
    queryKey: ['gears', filters],
    queryFn: async () => {
      const res = await getGears(filters as any);
      if (!res?.success) throw new Error(res?.message || 'Failed to load gears');
      return res.data;
    },
  });
}

export function useGear(id: string, enabled = true) {
  return useQuery({
    queryKey: ['gear', id],
    queryFn: async () => {
      const res = await getGearById(id);
      if (!res?.success) throw new Error(res?.message || 'Failed to load gear');
      return res.data;
    },
    enabled: !!id && enabled,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      if (!res?.success) throw new Error(res?.message || 'Failed to load categories');
      return res.data;
    },
  });
}
