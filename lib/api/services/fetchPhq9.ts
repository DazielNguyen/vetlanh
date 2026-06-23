import apiService from "../core";
import type {
  Phq9SubmitRequest,
  Phq9Result,
  Phq9HistoryItem,
  Phq9Reminder,
} from "@/types/phq9";

export interface Phq9HistoryParams {
  limit?: number;
  offset?: number;
}

export const fetchPhq9 = {
  // BE wraps the question list in an object: { questions: string[] } — no per-question id.
  getQuestions: async (): Promise<string[]> => {
    const response = await apiService.get<{ questions: string[] }>("api/v1/assessments/phq9/questions");
    return response.data.questions;
  },

  submitAssessment: async (body: Phq9SubmitRequest): Promise<Phq9Result> => {
    const response = await apiService.post<Phq9Result>("api/v1/assessments/phq9", body);
    return response.data;
  },

  getLatest: async (): Promise<Phq9Result> => {
    const response = await apiService.get<Phq9Result>("api/v1/assessments/phq9/latest");
    return response.data;
  },

  getHistory: async (params?: Phq9HistoryParams): Promise<Phq9HistoryItem[]> => {
    const response = await apiService.get<Phq9HistoryItem[]>("api/v1/assessments/phq9/history", params);
    return response.data;
  },

  getReminder: async (): Promise<Phq9Reminder> => {
    const response = await apiService.get<Phq9Reminder>("api/v1/assessments/phq9/reminder");
    return response.data;
  },
};
