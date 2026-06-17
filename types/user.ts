export interface UserProfile {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string | null;
  goals: string[] | null;
  subscription_status: "pro" | "expired" | "none";
  subscription_plan: string | null;
  subscription_expires_at: string | null;
}

export interface UpdateProfileRequest {
  display_name?: string;
  avatar_url?: string;
  timezone?: string;
}

export interface GoalsUpdateRequest {
  goals: string[];
}

export interface AvailableGoal {
  value: string;
  label: string;
}
