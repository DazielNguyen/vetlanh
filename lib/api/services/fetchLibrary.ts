import apiService from "@/lib/api/core";

export type ArticleCategory = "healing" | "psychology" | "research" | "lifestyle";

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: ArticleCategory;
  read_minutes: number | null;
  cover_url: string | null;
  cloudinary_public_id: string | null;
  is_published: boolean;
  sort_order: number;
  published_at: string | null;
}

export const fetchLibrary = {
  list: async (category?: ArticleCategory): Promise<Article[]> => {
    const res = await apiService.get<Article[]>(
      "api/v1/articles",
      category ? { category } : undefined
    );
    return res.data;
  },

  getById: async (id: string): Promise<Article> => {
    const res = await apiService.get<Article>(`api/v1/articles/${id}`);
    return res.data;
  },
};
