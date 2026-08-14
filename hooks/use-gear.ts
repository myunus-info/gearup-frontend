import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { GearFilterParams } from "@/lib/types";

export function useGears(filters: GearFilterParams = {}) {
  return useQuery({
    queryKey: ["gears", filters],
    queryFn: async () => {
      const res = await api.gear.getAll(filters);
      return res.data;
    },
  });
}

export function useGear(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: async () => {
      const res = await api.gear.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.categories.getAll();
      return res.data;
    },
  });
}
