import apiService from "../core";
import type {
  Exercise,
  ExerciseLog,
  ExerciseListParams,
  RecommendedParams,
  LogExerciseRequest,
  UpdateExerciseLogFeelingRequest,
  FeelingOption,
} from "@/types/exercise";

export const fetchExercise = {
  listExercises: async (params?: ExerciseListParams): Promise<Exercise[]> => {
    const response = await apiService.get<Exercise[]>("api/v1/exercises", params);
    return response.data;
  },

  getRecommended: async (params?: RecommendedParams): Promise<Exercise[]> => {
    const response = await apiService.get<Exercise[]>("api/v1/exercises/recommended", params);
    return response.data;
  },

  getExercise: async (slug: string): Promise<Exercise> => {
    const response = await apiService.get<Exercise>(`api/v1/exercises/${slug}`);
    return response.data;
  },

  logCompletion: async (body: LogExerciseRequest): Promise<ExerciseLog> => {
    const response = await apiService.post<ExerciseLog>("api/v1/exercises/logs", body);
    return response.data;
  },

  getLogHistory: async (): Promise<ExerciseLog[]> => {
    const response = await apiService.get<ExerciseLog[]>("api/v1/exercises/logs/history");
    return response.data;
  },

  updateLogFeeling: async (logId: string, body: UpdateExerciseLogFeelingRequest): Promise<ExerciseLog> => {
    const response = await apiService.patch<ExerciseLog>(`api/v1/exercises/logs/${logId}`, body);
    return response.data;
  },

  getFeelingOptions: async (): Promise<FeelingOption[]> => {
    const response = await apiService.get<FeelingOption[]>("api/v1/exercises/feeling-options");
    return response.data;
  },
};
