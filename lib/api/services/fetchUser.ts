import apiService from "@/lib/api/core";
import type {
  UserProfile,
  UpdateProfileRequest,
  GoalsUpdateRequest,
  AvailableGoal,
} from "@/types/user";

export const fetchUser = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiService.get<UserProfile>("api/v1/users/me");
    return response.data;
  },

  updateMe: async (body: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiService.patch<UserProfile>("api/v1/users/me", body);
    return response.data;
  },

  updateGoals: async (body: GoalsUpdateRequest): Promise<UserProfile> => {
    const response = await apiService.put<UserProfile>("api/v1/users/me/goals", body);
    return response.data;
  },

  getAvailableGoals: async (): Promise<AvailableGoal[]> => {
    const response = await apiService.get<AvailableGoal[]>("api/v1/users/goals");
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiService.upload<{ avatar_url: string }>("api/v1/users/me/avatar", formData);
    return response.data;
  },
};
