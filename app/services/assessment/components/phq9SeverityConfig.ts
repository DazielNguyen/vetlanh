export const SEVERITY_LABELS: Record<string, string> = {
  Minimal: "Tối thiểu",
  Mild: "Nhẹ",
  Moderate: "Trung bình",
  "Moderately Severe": "Nặng vừa",
  Severe: "Nặng",
};

export const SEVERITY_COLORS: Record<string, string> = {
  Minimal: "text-emerald-600 bg-emerald-50",
  Mild: "text-yellow-600 bg-yellow-50",
  Moderate: "text-orange-600 bg-orange-50",
  "Moderately Severe": "text-red-600 bg-red-50",
  Severe: "text-rose-700 bg-rose-50",
};

export interface SeverityConfig {
  color: string;
  bg: string;
  description: string;
}

export const SEVERITY_CONFIG: Record<string, SeverityConfig> = {
  Minimal: {
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description: "Sức khỏe tâm lý của bạn đang ở mức tốt.",
  },
  Mild: {
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    description: "Bạn đang có một số triệu chứng nhẹ. Hãy chú ý chăm sóc bản thân.",
  },
  Moderate: {
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    description: "Bạn đang ở mức trung bình. Nên xem xét nói chuyện với chuyên gia.",
  },
  "Moderately Severe": {
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description: "Các triệu chứng đang ở mức nặng vừa. Hãy tìm kiếm sự hỗ trợ chuyên nghiệp.",
  },
  Severe: {
    color: "text-rose-800",
    bg: "bg-rose-50 border-rose-200",
    description: "Bạn đang trải qua các triệu chứng nghiêm trọng. Vui lòng liên hệ chuyên gia ngay.",
  },
};
