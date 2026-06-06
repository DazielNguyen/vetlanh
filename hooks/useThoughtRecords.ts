import { useQuery, useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchThoughtRecords, type ThoughtRecordsParams } from "@/lib/api/services/fetchThoughtRecords";
import { STALE } from "@/lib/api/queryConfig";
import type { ApiError } from "@/lib/api/core";
import type { ThoughtRecord, ThoughtRecordRequest } from "@/types/thoughtRecord";

export const THOUGHT_KEYS = {
  all: ["thought-records"] as const,
  hints: ["thought-records", "hints"] as const,
  list: (params?: ThoughtRecordsParams) => ["thought-records", "list", params] as const,
  detail: (id: string) => ["thought-records", "detail", id] as const,
};

export function useThoughtRecordHints() {
  return useQuery({
    queryKey: THOUGHT_KEYS.hints,
    queryFn: fetchThoughtRecords.getHints,
    staleTime: STALE.LONG,
  });
}

export function useThoughtRecords(params?: ThoughtRecordsParams) {
  return useQuery({
    queryKey: THOUGHT_KEYS.list(params),
    queryFn: () => fetchThoughtRecords.listRecords(params),
    staleTime: STALE.SHORT,
  });
}

export function useThoughtRecord(id: string | undefined) {
  return useQuery({
    queryKey: THOUGHT_KEYS.detail(id!),
    queryFn: () => fetchThoughtRecords.getRecord(id!),
    enabled: !!id,
    staleTime: STALE.SHORT,
  });
}

export function useCreateThoughtRecord() {
  const queryClient = useQueryClient();
  return useMutation<ThoughtRecord, ApiError, ThoughtRecordRequest>({
    mutationFn: (body: ThoughtRecordRequest) => fetchThoughtRecords.createRecord(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THOUGHT_KEYS.all });
      toast.success("Đã lưu ghi chú suy nghĩ");
    },
    onError: (err) => {
      console.error("[useCreateThoughtRecord]", err);
      toast.error("Lưu thất bại, vui lòng thử lại");
    },
  });
}

export function useUpdateThoughtRecord() {
  const queryClient = useQueryClient();
  return useMutation<ThoughtRecord, ApiError, { id: string; body: Partial<ThoughtRecordRequest> }>({
    mutationFn: ({ id, body }: { id: string; body: Partial<ThoughtRecordRequest> }) =>
      fetchThoughtRecords.updateRecord(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: THOUGHT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: THOUGHT_KEYS.detail(id) });
      toast.success("Đã cập nhật ghi chú suy nghĩ");
    },
    onError: (err) => {
      console.error("[useUpdateThoughtRecord]", err);
      toast.error("Cập nhật thất bại, vui lòng thử lại");
    },
  });
}

export function useDeleteThoughtRecord() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string, { snapshot: [QueryKey, ThoughtRecord[] | undefined][] }>({
    mutationFn: (id: string) => fetchThoughtRecords.deleteRecord(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: THOUGHT_KEYS.all });
      // Snapshot all list queries for rollback
      const snapshot = queryClient.getQueriesData<ThoughtRecord[]>({ queryKey: ["thought-records", "list"] });
      queryClient.setQueriesData(
        { queryKey: ["thought-records", "list"] },
        (old: ThoughtRecord[] | undefined) => old?.filter((r) => r.id !== id) ?? old
      );
      return { snapshot };
    },
    onError: (err, _id, ctx) => {
      console.error("[useDeleteThoughtRecord]", err);
      ctx?.snapshot.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error("Xóa thất bại, vui lòng thử lại");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: THOUGHT_KEYS.all });
    },
  });
}
