export type SoundCategory = "nature" | "meditation" | "music" | "noise";

export interface Sound {
  id: string;
  title: string;
  description: string;
  category: SoundCategory;
  duration_seconds: number | null;
  sort_order: number;
  audio_url: string;
}

const MOCK_SOUNDS: Sound[] = [
  {
    id: "stream",
    title: "Tiếng suối rừng",
    description: "Âm thanh dòng suối chảy nhẹ nhàng giữa rừng xanh, giúp thư giãn tâm trí.",
    category: "nature",
    duration_seconds: null,
    sort_order: 1,
    audio_url: "",
  },
  {
    id: "rain-light",
    title: "Mưa nhẹ",
    description: "Tiếng mưa rơi trên mái nhà, êm dịu và giúp dễ vào giấc ngủ.",
    category: "nature",
    duration_seconds: null,
    sort_order: 2,
    audio_url: "",
  },
  {
    id: "ocean-waves",
    title: "Sóng biển",
    description: "Nhịp sóng vỗ bờ đều đặn, mang lại cảm giác bình yên và rộng mở.",
    category: "nature",
    duration_seconds: null,
    sort_order: 3,
    audio_url: "",
  },
  {
    id: "forest",
    title: "Rừng buổi sáng",
    description: "Tiếng chim hót và gió lá — bức tranh âm thanh của khu rừng lúc bình minh.",
    category: "nature",
    duration_seconds: null,
    sort_order: 4,
    audio_url: "",
  },
  {
    id: "tibetan-bowl",
    title: "Chuông Tây Tạng",
    description: "Âm chuông cộng hưởng sâu, được dùng trong thiền định và chữa lành.",
    category: "meditation",
    duration_seconds: null,
    sort_order: 5,
    audio_url: "",
  },
  {
    id: "fire-crackling",
    title: "Lửa bập bùng",
    description: "Tiếng củi cháy lách tách bên lò sưởi ấm, gợi cảm giác an toàn.",
    category: "meditation",
    duration_seconds: null,
    sort_order: 6,
    audio_url: "",
  },
  {
    id: "healing-432hz",
    title: "Âm nhạc 432 Hz",
    description: "Nhạc thiền tần số 432 Hz — tần số tự nhiên giúp giảm lo âu và cân bằng nội tâm.",
    category: "music",
    duration_seconds: 1800,
    sort_order: 7,
    audio_url: "",
  },
  {
    id: "binaural-alpha",
    title: "Binaural Alpha",
    description: "Sóng alpha (8–12 Hz) kích hoạt trạng thái thư giãn tỉnh táo, lý tưởng khi làm việc.",
    category: "music",
    duration_seconds: 3600,
    sort_order: 8,
    audio_url: "",
  },
  {
    id: "binaural-theta",
    title: "Binaural Theta",
    description: "Sóng theta (4–8 Hz) dẫn vào trạng thái thiền sâu và tăng khả năng sáng tạo.",
    category: "music",
    duration_seconds: 3600,
    sort_order: 9,
    audio_url: "",
  },
  {
    id: "white-noise",
    title: "White Noise",
    description: "Tiếng ồn trắng che phủ tạp âm xung quanh, giúp tập trung và ngủ ngon.",
    category: "noise",
    duration_seconds: null,
    sort_order: 10,
    audio_url: "",
  },
  {
    id: "brown-noise",
    title: "Brown Noise",
    description: "Tần số thấp hơn white noise, ấm và trầm hơn — hiệu quả cho ADHD và lo âu.",
    category: "noise",
    duration_seconds: null,
    sort_order: 11,
    audio_url: "",
  },
  {
    id: "pink-noise",
    title: "Pink Noise",
    description: "Cân bằng giữa white và brown noise, được nghiên cứu giúp cải thiện chất lượng giấc ngủ.",
    category: "noise",
    duration_seconds: null,
    sort_order: 12,
    audio_url: "",
  },
];

export const fetchSounds = {
  list: async (category?: SoundCategory): Promise<Sound[]> => {
    if (category) return MOCK_SOUNDS.filter((s) => s.category === category);
    return MOCK_SOUNDS;
  },

  getById: async (id: string): Promise<Sound> => {
    const sound = MOCK_SOUNDS.find((s) => s.id === id);
    if (!sound) throw new Error(`Sound not found: ${id}`);
    return sound;
  },
};
