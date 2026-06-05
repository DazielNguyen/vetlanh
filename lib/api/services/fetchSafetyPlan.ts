import apiService from "../core";
import type { SafetyPlan, CrisisResource } from "@/types/safetyPlan";

export const fetchSafetyPlan = {
  getSafetyPlan: async (): Promise<SafetyPlan> => {
    const res = await apiService.get<SafetyPlan>("api/v1/safety-plan");
    return res.data;
  },

  upsertSafetyPlan: async (body: SafetyPlan): Promise<SafetyPlan> => {
    const res = await apiService.put<SafetyPlan>("api/v1/safety-plan", body);
    return res.data;
  },

  // Public endpoint — no auth header. Plain fetch avoids the Axios interceptor that
  // always attaches Bearer if a token exists in the cookie.
  getCrisisResources: async (): Promise<CrisisResource[]> => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/").replace(/\/$/, "");
    const res = await fetch(`${base}/api/v1/crisis/resources`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<CrisisResource[]>;
  },
};
