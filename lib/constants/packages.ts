export interface Package {
  key: string;
  label: string;
  price: string;
  amount: number;
  perMonth?: string;
  badge?: { text: string; className: string };
}

export const PACKAGES: Package[] = [
  { key: "1thang", label: "1 tháng", price: "79.000 ₫", amount: 79000 },
  { key: "3thang", label: "3 tháng", price: "199.000 ₫", amount: 199000, perMonth: "~66.000 ₫/tháng" },
  { key: "6thang", label: "6 tháng", price: "349.000 ₫", amount: 349000, perMonth: "~58.000 ₫/tháng" },
  {
    key: "1nam",
    label: "1 năm",
    price: "599.000 ₫",
    amount: 599000,
    perMonth: "~50.000 ₫/tháng",
    badge: { text: "KHUYÊN DÙNG", className: "bg-white/20 text-white border border-white/30" },
  },
  {
    key: "tronddoi",
    label: "Trọn đời",
    price: "999.000 ₫",
    amount: 999000,
    badge: { text: "PHỔ BIẾN NHẤT", className: "bg-amber-400/20 text-amber-200 border border-amber-300/30" },
  },
];

export const PRO_FEATURES = [
  "AI chat không giới hạn",
  "Lộ trình chữa lành cá nhân hóa",
  "Thư viện bài tập đầy đủ",
  "Theo dõi cảm xúc & biểu đồ nâng cao",
  "Nhật ký & Hồ sơ tư duy",
  "Ưu tiên hỗ trợ kỹ thuật",
];

export const DEFAULT_PACKAGE_KEY = "1nam";

export function getPackage(key: string | null): Package {
  return PACKAGES.find((p) => p.key === key) ?? PACKAGES.find((p) => p.key === DEFAULT_PACKAGE_KEY)!;
}
