import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { UserStatus } from "@/lib/types";
import { toast } from "sonner";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.admin.getUsers();
      return res.data;
    },
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin-gear"],
    queryFn: async () => {
      const res = await api.admin.getAllGear();
      return res.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: async () => {
      const res = await api.admin.getAllRentals();
      return res.data;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: UserStatus;
    }) => {
      const res = await api.admin.updateUserStatus(id, status);
      return res.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] });
      const prevUsers = queryClient.getQueryData(["admin-users"]);

      queryClient.setQueryData(["admin-users"], (old: any) => {
        if (!old) return old;
        return old.map((user: any) =>
          user.id === id ? { ...user, status } : user
        );
      });

      return { prevUsers };
    },
    onError: (err: any, _vars, context) => {
      if (context?.prevUsers) {
        queryClient.setQueryData(["admin-users"], context.prevUsers);
      }
      toast.error(err.message || "Failed to update user status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status successfully updated!");
    },
  });
}
