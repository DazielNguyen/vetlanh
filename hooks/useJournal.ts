import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJournal } from "@/lib/api/services/fetchJournal";
import { STALE } from "@/lib/api/queryConfig";
import type { JournalCreateRequest, JournalUpdateRequest, JournalListParams, JournalEntry } from "@/types/journal";
import { BADGE_KEYS } from "@/hooks/useBadges";

export const JOURNAL_KEYS = {
  all: ["journal"] as const,
  list: ["journal", "list"] as const,
  listFiltered: (params: JournalListParams) => ["journal", "list", params] as const,
  entry: (id: number | null) => ["journal", "entry", id] as const,
};

export function useJournalList(params?: JournalListParams) {
  return useQuery({
    queryKey: params ? JOURNAL_KEYS.listFiltered(params) : JOURNAL_KEYS.list,
    queryFn: () => fetchJournal.listEntries(params),
    staleTime: STALE.SHORT,
  });
}

export function useJournalEntry(id: number | null) {
  return useQuery({
    queryKey: JOURNAL_KEYS.entry(id),
    queryFn: () => fetchJournal.getEntry(id!),
    enabled: !!id,
    staleTime: STALE.SHORT,
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: JournalCreateRequest) => fetchJournal.createEntry(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list });
      // Journal entries earn XP — refresh badges so the level/XP indicator updates
      queryClient.invalidateQueries({ queryKey: BADGE_KEYS.list });
      toast.success("Đã lưu nhật ký");
    },
    onError: () => {
      toast.error("Lưu nhật ký thất bại, vui lòng thử lại");
    },
  });
}

export function useUpdateJournal(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: JournalUpdateRequest) => fetchJournal.updateEntry(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(JOURNAL_KEYS.entry(id), updated);
      queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list });
      toast.success("Đã cập nhật nhật ký");
    },
    onError: () => {
      toast.error("Cập nhật nhật ký thất bại, vui lòng thử lại");
    },
  });
}

export function useAutoSaveJournal(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: JournalUpdateRequest) => fetchJournal.updateEntry(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(JOURNAL_KEYS.entry(id), updated);
      queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list });
    },
    // Silent — no toast on success or error to avoid interrupting user while typing
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => fetchJournal.deleteEntry(id),
    onMutate: async (id) => {
      // Cancel in-flight list queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: JOURNAL_KEYS.list });

      // Snapshot current list for rollback
      const previous = queryClient.getQueriesData<JournalEntry[]>({ queryKey: JOURNAL_KEYS.list });

      // Optimistically remove the entry from all list variants
      queryClient.setQueriesData<JournalEntry[]>(
        { queryKey: JOURNAL_KEYS.list },
        (old) => old?.filter((e) => e.id !== id) ?? []
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      // Roll back all list variants to their pre-mutation snapshots
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Xóa nhật ký thất bại, vui lòng thử lại");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list });
    },
  });
}
