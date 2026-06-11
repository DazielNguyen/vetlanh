import apiService from "@/lib/api/core";

export type SoundCategory = "nature" | "meditation" | "music" | "noise";

export interface Sound {
  id: string;
  title: string;
  description: string | null;
  category: SoundCategory;
  duration_seconds: number | null;
  sort_order: number;
  audio_url: string;
  is_published: boolean;
}

export const fetchSounds = {
  list: async (category?: SoundCategory): Promise<Sound[]> => {
    const res = await apiService.get<Sound[]>(
      "api/v1/sounds",
      category ? { category } : undefined
    );
    return res.data;
  },

  getById: async (id: string): Promise<Sound> => {
    const res = await apiService.get<Sound>(`api/v1/sounds/${id}`);
    return res.data;
  },
};
