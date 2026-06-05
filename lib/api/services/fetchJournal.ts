import apiService from "../core";
import type {
  JournalEntry,
  JournalCreateRequest,
  JournalUpdateRequest,
  JournalListParams,
} from "@/types/journal";

export const fetchJournal = {
  listEntries: async (params?: JournalListParams): Promise<JournalEntry[]> => {
    const response = await apiService.get<JournalEntry[]>("api/v1/journal", params);
    return response.data;
  },

  getEntry: async (id: number): Promise<JournalEntry> => {
    const response = await apiService.get<JournalEntry>(`api/v1/journal/${id}`);
    return response.data;
  },

  createEntry: async (body: JournalCreateRequest): Promise<JournalEntry> => {
    const response = await apiService.post<JournalEntry>("api/v1/journal", body);
    return response.data;
  },

  updateEntry: async (id: number, body: JournalUpdateRequest): Promise<JournalEntry> => {
    const response = await apiService.patch<JournalEntry>(`api/v1/journal/${id}`, body);
    return response.data;
  },

  deleteEntry: async (id: number): Promise<void> => {
    await apiService.delete(`api/v1/journal/${id}`);
  },
};
