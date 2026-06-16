"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, Loader2, type LucideIcon, Sparkles, TrendingUp, Brain, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useArticle, type ArticleCategory } from "@/hooks/useLibrary";

interface Props {
  params: Promise<{ id: string }>;
}

const CATEGORY_CONFIG: Record<ArticleCategory, { bg: string; text: string; Icon: LucideIcon }> = {
  healing: { bg: "bg-blue-100/70", text: "text-blue-600", Icon: Sparkles },
  psychology: { bg: "bg-teal-100/70", text: "text-teal-600", Icon: TrendingUp },
  research: { bg: "bg-violet-100/70", text: "text-violet-600", Icon: Brain },
  lifestyle: { bg: "bg-amber-100/70", text: "text-amber-600", Icon: Leaf },
};

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  healing: "Kỹ thuật chữa lành",
  psychology: "Xu hướng tâm lý",
  research: "Nghiên cứu",
  lifestyle: "Lối sống",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function ArticleDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: article, isLoading } = useArticle(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/20" strokeWidth={2} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-sm text-foreground/60 py-10 text-center">
        Không tìm thấy bài viết này.
      </div>
    );
  }

  const { bg, text, Icon } = CATEGORY_CONFIG[article.category];

  return (
    <div className="w-full pb-10 max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-foreground/65 hover:text-foreground/75 transition font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <Card className="card-lifted border-none rounded-3xl overflow-hidden">
        <div className="h-48 relative overflow-hidden bg-gradient-to-br from-background/60 to-background/20">
          {article.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.cover_url} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <Icon className="absolute top-6 right-6 w-16 h-16 text-foreground/5" strokeWidth={1.5} />
          )}
        </div>

        <CardHeader className="space-y-3">
          <span className={`inline-flex w-fit text-[11px] font-bold px-2.5 py-1 rounded-full ${bg} ${text}`}>
            {CATEGORY_LABELS[article.category]}
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground leading-snug">{article.title}</h1>
          <div className="flex items-center gap-3 text-xs text-foreground/40">
            {article.read_minutes !== null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                {article.read_minutes} phút đọc
              </span>
            )}
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {article.excerpt && (
            <p className="text-sm font-medium text-foreground/60 leading-relaxed border-l-2 border-primary/30 pl-4">
              {article.excerpt}
            </p>
          )}
          <div className="text-sm text-foreground/75 leading-relaxed space-y-4 [&_strong]:font-bold [&_strong]:text-foreground [&_em]:italic [&_a]:text-primary [&_a]:underline [&_code]:bg-background/60 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:text-foreground/60 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-foreground [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-foreground">
            {article.content ? <ReactMarkdown>{article.content}</ReactMarkdown> : "Bài viết chưa có nội dung."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
