import { useQuery } from "@tanstack/react-query";
import { fetchLibrary, type ArticleCategory } from "@/lib/api/services/fetchLibrary";
import { STALE } from "@/lib/api/queryConfig";

export type { Article, ArticleCategory } from "@/lib/api/services/fetchLibrary";

export const ARTICLE_KEYS = {
  all: ["articles"] as const,
  list: (category?: ArticleCategory) => ["articles", "list", category ?? "all"] as const,
  detail: (id: string) => ["articles", "detail", id] as const,
};

export function useLibrary(category?: ArticleCategory) {
  return useQuery({
    queryKey: ARTICLE_KEYS.list(category),
    queryFn: () => fetchLibrary.list(category),
    staleTime: STALE.LONG,
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ARTICLE_KEYS.detail(id),
    queryFn: () => fetchLibrary.getById(id),
    staleTime: STALE.LONG,
    enabled: !!id,
  });
}
