import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchUser } from "@/lib/api/services/fetchUser";
import { STALE } from "@/lib/api/queryConfig";
import type { UpdateProfileRequest, GoalsUpdateRequest } from "@/types/user";

export const USER_KEYS = {
  all: ["user"] as const,
  me: ["user", "me"] as const,
  availableGoals: ["user", "available-goals"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: fetchUser.getMe,
    staleTime: STALE.SHORT,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => fetchUser.updateMe(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(USER_KEYS.me, updated);
      toast.success("Đã cập nhật hồ sơ");
    },
    onError: () => {
      toast.error("Cập nhật thất bại, vui lòng thử lại");
    },
  });
}

export function useUpdateGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: GoalsUpdateRequest) => fetchUser.updateGoals(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(USER_KEYS.me, updated);
      toast.success("Đã cập nhật mục tiêu");
    },
    onError: () => {
      toast.error("Cập nhật mục tiêu thất bại, vui lòng thử lại");
    },
  });
}
