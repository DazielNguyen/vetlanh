import apiService from "../core";

export type AdminStats = {
  total_users: number;
  active_users: number;
  monthly_revenue_vnd: number;
  unresolved_errors: number;
};

export type AdminUser = {
  id: number;
  username: string;
  displayName: string;
  accountType: "email" | "username" | "google";
  subscriptionStatus: "Pro" | "Expired" | "None";
  subscriptionExpiry: string | null;
  joinDate: string;
  lastActiveAt: string | null;
};

export type AdminUsersResponse = {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
};

export type PendingSubscription = {
  id: string;
  username: string;
  displayName: string;
  plan: string;
  duration: number;
  amount: string;
  amount_vnd: number;
  transferDate: string | null;
  note: string;
  bill_image_url?: string | null;
};

export type ActiveSubscription = {
  id: string;
  username: string;
  displayName: string;
  plan: string;
  grantedAt: string;
  expiresAt: string;
};

export type AdminError = {
  id: string;
  timestamp: string;
  type: string;
  route: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "open" | "resolved";
  description: string;
};

export const fetchAdmin = {
  getStats: async (): Promise<AdminStats> => {
    const res = await apiService.get<AdminStats>("api/v1/admin/stats");
    return res.data;
  },

  getUsers: async (params: { page?: number; limit?: number; search?: string }): Promise<AdminUsersResponse> => {
    const res = await apiService.get<AdminUsersResponse>("api/v1/admin/users", params);
    return res.data;
  },

  getPendingSubscriptions: async (): Promise<PendingSubscription[]> => {
    const res = await apiService.get<PendingSubscription[]>("api/v1/admin/subscriptions/pending");
    return res.data;
  },

  getActiveSubscriptions: async (): Promise<ActiveSubscription[]> => {
    const res = await apiService.get<ActiveSubscription[]>("api/v1/admin/subscriptions/active");
    return res.data;
  },

  grantSubscription: async (id: string, duration_months?: number): Promise<ActiveSubscription> => {
    const res = await apiService.post<ActiveSubscription>(
      `api/v1/admin/subscriptions/${id}/grant`,
      duration_months ? { duration_months } : undefined
    );
    return res.data;
  },

  rejectSubscription: async (id: string): Promise<PendingSubscription> => {
    const res = await apiService.post<PendingSubscription>(`api/v1/admin/subscriptions/${id}/reject`);
    return res.data;
  },

  getErrors: async (status?: "open" | "resolved"): Promise<AdminError[]> => {
    const res = await apiService.get<AdminError[]>("api/v1/admin/errors", status ? { status } : undefined);
    return res.data;
  },

  resolveError: async (id: string): Promise<AdminError> => {
    const res = await apiService.patch<AdminError>(`api/v1/admin/errors/${id}/resolve`);
    return res.data;
  },
};
