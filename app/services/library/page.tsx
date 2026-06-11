"use client";

import { useState } from "react";
import { Clock, BookOpen, TrendingUp, Sparkles, Brain, Leaf, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ── Mock data — swap out for API call later ──────────────────────────────────

type Category = "Kỹ thuật chữa lành" | "Xu hướng tâm lý" | "Nghiên cứu" | "Lối sống";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: Category;
  read_minutes: number;
  date: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "5 kỹ thuật Cognitive Behavioral Therapy hiệu quả nhất hiện nay",
    excerpt: "CBT là một trong những liệu pháp tâm lý được nghiên cứu nhiều nhất. Tìm hiểu 5 kỹ thuật cốt lõi mà các chuyên gia áp dụng để giúp bệnh nhân thay đổi tư duy tiêu cực.",
    category: "Kỹ thuật chữa lành",
    read_minutes: 6,
    date: "2025-05-18",
  },
  {
    id: "2",
    title: "Thiền định và khoa học thần kinh: Não bộ thay đổi thế nào sau 8 tuần?",
    excerpt: "Nghiên cứu từ Harvard cho thấy chỉ 8 tuần thiền định đều đặn đã thay đổi cấu trúc vật lý của vỏ não trước trán — vùng điều tiết cảm xúc và ra quyết định.",
    category: "Nghiên cứu",
    read_minutes: 8,
    date: "2025-05-12",
  },
  {
    id: "3",
    title: "Rối loạn lo âu: Hiểu đúng để không bỏ lỡ dấu hiệu sớm",
    excerpt: "Lo âu là cảm xúc bình thường, nhưng khi nào nó trở thành rối loạn? Bài viết phân tích ranh giới mong manh và những dấu hiệu cần được hỗ trợ chuyên nghiệp.",
    category: "Xu hướng tâm lý",
    read_minutes: 5,
    date: "2025-05-08",
  },
  {
    id: "4",
    title: "Thực hành Mindfulness mỗi ngày: Bắt đầu từ đâu nếu bạn quá bận?",
    excerpt: "Chánh niệm không cần thiền 1 tiếng mỗi sáng. 3 thói quen nhỏ — mỗi cái dưới 5 phút — có thể thay đổi chất lượng cuộc sống của bạn một cách đáng kể.",
    category: "Lối sống",
    read_minutes: 4,
    date: "2025-04-30",
  },
  {
    id: "5",
    title: "Giấc ngủ và sức khỏe tâm thần: Mối liên hệ hai chiều bạn không thể bỏ qua",
    excerpt: "Thiếu ngủ làm tăng nguy cơ trầm cảm lên 5 lần. Ngược lại, trầm cảm phá vỡ giấc ngủ. Chuỗi vòng lặp này hoạt động như thế nào và cách thoát ra?",
    category: "Lối sống",
    read_minutes: 7,
    date: "2025-04-22",
  },
  {
    id: "6",
    title: "Journaling — Liệu pháp viết lách: Khoa học đằng sau tờ giấy trắng",
    excerpt: "Viết nhật ký không chỉ là ghi lại ngày hôm nay. Nghiên cứu tâm lý học cho thấy viết có cấu trúc giúp giảm triệu chứng PTSD, lo âu và cải thiện sức đề kháng cảm xúc.",
    category: "Kỹ thuật chữa lành",
    read_minutes: 6,
    date: "2025-04-15",
  },
  {
    id: "7",
    title: "Kết nối thân — tâm: Khi cơ thể lưu giữ những tổn thương tâm lý",
    excerpt: "Bessel van der Kolk và lý thuyết 'The Body Keeps the Score' — tại sao chấn thương tâm lý biểu hiện qua đau lưng, tiêu hóa kém và bệnh mãn tính.",
    category: "Xu hướng tâm lý",
    read_minutes: 9,
    date: "2025-04-08",
  },
  {
    id: "8",
    title: "Grounding 5-4-3-2-1: Kỹ thuật đưa bản thân về thực tại trong 60 giây",
    excerpt: "Khi cơn lo âu ập đến, kỹ thuật Grounding kích hoạt 5 giác quan để neo đậu ý thức vào thực tại. Tại sao nó hiệu quả hơn là cố gắng 'không lo'?",
    category: "Kỹ thuật chữa lành",
    read_minutes: 3,
    date: "2025-04-01",
  },
];

// ── Design system mapping ────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, {
  bg: string; text: string; cover: string; Icon: LucideIcon;
}> = {
  "Kỹ thuật chữa lành": { bg: "bg-blue-100/70",   text: "text-blue-600",   cover: "from-blue-100/80 to-indigo-100/50",  Icon: Sparkles },
  "Xu hướng tâm lý":   { bg: "bg-teal-100/70",    text: "text-teal-600",   cover: "from-teal-100/80 to-cyan-100/50",    Icon: TrendingUp },
  "Nghiên cứu":        { bg: "bg-violet-100/70",   text: "text-violet-600", cover: "from-violet-100/80 to-purple-100/50", Icon: Brain },
  "Lối sống":          { bg: "bg-amber-100/70",    text: "text-amber-600",  cover: "from-amber-100/80 to-orange-100/50", Icon: Leaf },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "">("");

  const filtered = activeCategory
    ? MOCK_ARTICLES.filter((a) => a.category === activeCategory)
    : MOCK_ARTICLES;

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl border transition shrink-0 ${
      active
        ? "bg-primary text-white border-primary shadow-sm"
        : "bg-background/60 text-foreground/60 border-border/40 hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="w-full pb-10 space-y-8">
      {/* Header */}
      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Thư viện</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Bài viết về tâm lý học, xu hướng chữa lành và nghiên cứu khoa học — miễn phí, dễ đọc.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory("")}
          className={`${chipClass(activeCategory === "")} `}
        >
          <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
          Tất cả ({MOCK_ARTICLES.length})
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const { Icon, bg, text } = CATEGORY_CONFIG[cat];
          const count = MOCK_ARTICLES.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={chipClass(activeCategory === cat)}
            >
              <span className={`w-3.5 h-3.5 ${activeCategory === cat ? "" : text}`}>
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((article) => {
          const { bg, text, cover, Icon } = CATEGORY_CONFIG[article.category];
          return (
            <Card
              key={article.id}
              className="card-lifted border-none rounded-3xl overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer"
            >
              {/* Cover */}
              <div className={`h-28 bg-gradient-to-br ${cover} flex items-end px-5 pb-4 relative`}>
                <Icon
                  className="absolute top-4 right-5 w-12 h-12 text-foreground/5"
                  strokeWidth={1.5}
                />
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${bg} ${text}`}>
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-foreground/50 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/30">
                  <div className="flex items-center gap-3 text-[11px] text-foreground/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      {article.read_minutes} phút đọc
                    </span>
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <span className={`text-[11px] font-semibold ${text} group-hover:underline`}>
                    Đọc thêm →
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
