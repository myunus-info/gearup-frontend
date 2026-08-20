import { useQuery } from '@tanstack/react-query';
import { GearFilterParams } from '@/types/types';
import { gearService } from '@/services/gear.service';

export function useGears(filters: GearFilterParams = {}) {
  return useQuery({
    queryKey: ['gears', filters],
    queryFn: async () => {
      const res = await gearService.listGears(filters);
      return res.data;
    },
  });
}

export function useGear(id: string, enabled = true) {
  return useQuery({
    queryKey: ['gear', id],
    queryFn: async () => {
      const res = await gearService.getGearById(id);
      return res.data;
    },
    enabled: !!id && enabled,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await gearService.getGearCategories();
      return res.data;
    },
  });
}
