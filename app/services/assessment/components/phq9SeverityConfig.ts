export const SEVERITY_LABELS: Record<string, string> = {
  Minimal: "Tối thiểu",
  Mild: "Nhẹ",
  Moderate: "Trung bình",
  "Moderately Severe": "Nặng vừa",
  Severe: "Nặng",
};

export const SEVERITY_COLORS: Record<string, string> = {
  Minimal: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  Mild: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20",
  Moderate: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20",
  "Moderately Severe": "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
  Severe: "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20",
};

export interface SeverityConfig {
  color: string;
  bg: string;
  description: string;
}

export const SEVERITY_CONFIG: Record<string, SeverityConfig> = {
  Minimal: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30",
    description: "Sức khỏe tâm lý của bạn đang ở mức tốt.",
  },
  Mild: {
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30",
    description: "Bạn đang có một số triệu chứng nhẹ. Hãy chú ý chăm sóc bản thân.",
  },
  Moderate: {
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30",
    description: "Bạn đang ở mức trung bình. Nên xem xét nói chuyện với chuyên gia.",
  },
  "Moderately Severe": {
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30",
    description: "Các triệu chứng đang ở mức nặng vừa. Hãy tìm kiếm sự hỗ trợ chuyên nghiệp.",
  },
  Severe: {
    color: "text-rose-800 dark:text-rose-400",
    bg: "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/30",
    description: "Bạn đang trải qua các triệu chứng nghiêm trọng. Vui lòng liên hệ chuyên gia ngay.",
  },
};
