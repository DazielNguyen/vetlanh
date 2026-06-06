import apiService from "../core";
import type {
  NotificationPreference,
  NotificationPreferenceUpdate,
  ExerciseReminderResponse,
} from "@/types/notifications";

export const fetchNotifications = {
  getPreference: async (): Promise<NotificationPreference> => {
    const res = await apiService.get<NotificationPreference>("api/v1/notifications/preference");
    return res.data;
  },

  updatePreference: async (body: NotificationPreferenceUpdate): Promise<NotificationPreference> => {
    const res = await apiService.patch<NotificationPreference>("api/v1/notifications/preference", body);
    return res.data;
  },

  getExerciseReminder: async (): Promise<ExerciseReminderResponse> => {
    const res = await apiService.get<ExerciseReminderResponse>("api/v1/notifications/exercise-reminder");
    return res.data;
  },
};
