"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, TrendingUp, Sparkles, Brain, Leaf, Loader2, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLibrary, type ArticleCategory } from "@/hooks/useLibrary";
import { ProContentGate } from "@/components/ProContentGate";
import { LevelGate } from "@/components/progression/LevelGate";

// ── Design system mapping ────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<ArticleCategory, {
  bg: string; text: string; cover: string; Icon: LucideIcon;
}> = {
  healing:    { bg: "bg-blue-100/70",   text: "text-blue-600",   cover: "from-blue-100/80 to-indigo-100/50",   Icon: Sparkles },
  psychology: { bg: "bg-teal-100/70",   text: "text-teal-600",   cover: "from-teal-100/80 to-cyan-100/50",     Icon: TrendingUp },
  research:   { bg: "bg-violet-100/70", text: "text-violet-600", cover: "from-violet-100/80 to-purple-100/50", Icon: Brain },
  lifestyle:  { bg: "bg-amber-100/70",  text: "text-amber-600",  cover: "from-amber-100/80 to-orange-100/50",  Icon: Leaf },
};

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  healing: "Kỹ thuật chữa lành",
  psychology: "Xu hướng tâm lý",
  research: "Nghiên cứu",
  lifestyle: "Lối sống",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as ArticleCategory[];
const GRID_CLASS = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | undefined>();
  const { data: articles, isLoading } = useLibrary(activeCategory);

  const allArticles = articles ?? [];

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl border transition shrink-0 ${
      active
        ? "bg-primary text-white border-primary shadow-sm"
        : "bg-background/60 text-foreground/60 border-border/40 hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <LevelGate requiredLevel={1}>
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
          onClick={() => setActiveCategory(undefined)}
          className={`${chipClass(activeCategory === undefined)} `}
        >
          <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
          Tất cả ({allArticles.length})
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const { Icon, text } = CATEGORY_CONFIG[cat];
          const count = allArticles.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={chipClass(activeCategory === cat)}
            >
              <span className={`w-3.5 h-3.5 ${activeCategory === cat ? "" : text}`}>
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/20" strokeWidth={2} />
        </div>
      )}

      {/* Article grid */}
      {!isLoading && (
        <div className={GRID_CLASS}>
          <ProContentGate
            items={allArticles}
            lockedGridClassName={GRID_CLASS}
            renderItem={(article) => {
              const { bg, text, cover, Icon } = CATEGORY_CONFIG[article.category];
              return (
                <Card
                  key={article.id}
                  onClick={() => router.push(`/services/library/${article.id}`)}
                  className="card-lifted border-none rounded-3xl overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  {/* Cover */}
                  <div className={`h-28 ${cover ? `bg-linear-to-br ${cover}` : ""} flex items-end px-5 pb-4 relative overflow-hidden`}>
                    {article.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        className="absolute top-4 right-5 w-12 h-12 text-foreground/5"
                        strokeWidth={1.5}
                      />
                    )}
                    <span className={`relative text-[11px] font-bold px-2.5 py-1 rounded-full ${bg} ${text}`}>
                      {CATEGORY_LABELS[article.category]}
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
                        {article.read_minutes !== null && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            {article.read_minutes} phút đọc
                          </span>
                        )}
                        {article.published_at && <span>{formatDate(article.published_at)}</span>}
                      </div>
                      <span className={`text-[11px] font-semibold ${text} group-hover:underline`}>
                        Đọc thêm →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allArticles.length === 0 && (
        <p className="text-sm text-foreground/40 text-center py-12">
          Chưa có bài viết nào trong danh mục này.
        </p>
      )}
    </div>
    </LevelGate>
  );
}
