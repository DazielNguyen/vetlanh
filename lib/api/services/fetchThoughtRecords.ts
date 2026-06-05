import apiService from "../core";
import type { ThoughtRecord, ThoughtRecordRequest, ThoughtRecordHint } from "@/types/thoughtRecord";

export interface ThoughtRecordsParams {
  limit?: number;
  offset?: number;
}

export const fetchThoughtRecords = {
  getHints: async (): Promise<ThoughtRecordHint[]> => {
    const res = await apiService.get<ThoughtRecordHint[]>("api/v1/thought-records/hints");
    return res.data;
  },

  listRecords: async (params?: ThoughtRecordsParams): Promise<ThoughtRecord[]> => {
    const res = await apiService.get<ThoughtRecord[]>("api/v1/thought-records", params);
    return res.data;
  },

  createRecord: async (body: ThoughtRecordRequest): Promise<ThoughtRecord> => {
    const res = await apiService.post<ThoughtRecord>("api/v1/thought-records", body);
    return res.data;
  },

  getRecord: async (id: string): Promise<ThoughtRecord> => {
    const res = await apiService.get<ThoughtRecord>(`api/v1/thought-records/${id}`);
    return res.data;
  },

  updateRecord: async (id: string, body: Partial<ThoughtRecordRequest>): Promise<ThoughtRecord> => {
    const res = await apiService.patch<ThoughtRecord>(`api/v1/thought-records/${id}`, body);
    return res.data;
  },

  deleteRecord: async (id: string): Promise<void> => {
    await apiService.delete(`api/v1/thought-records/${id}`);
  },
};
