import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchNotifications } from "@/lib/api/services/fetchNotifications";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";
import type { NotificationPreferenceUpdate } from "@/types/notifications";

export const NOTIFICATION_KEYS = {
  preference: ["notifications", "preference"] as const,
  exerciseReminder: ["notifications", "exercise-reminder"] as const,
};

export function useNotificationPreference() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.preference,
    queryFn: fetchNotifications.getPreference,
    staleTime: STALE.SHORT,
    retry: skipRetryOn(401, 404),
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: NotificationPreferenceUpdate) => fetchNotifications.updatePreference(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.preference });
      toast.success("Đã lưu cài đặt thông báo");
    },
    onError: () => {
      toast.error("Lưu thất bại — vui lòng thử lại");
    },
  });
}

export function useExerciseReminder() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.exerciseReminder,
    queryFn: fetchNotifications.getExerciseReminder,
    staleTime: STALE.SHORT,
    retry: skipRetryOn(401),
  });
}
