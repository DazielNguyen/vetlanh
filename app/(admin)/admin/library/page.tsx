"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { BookOpen, Plus, Upload, Trash2, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import apiService from "@/lib/api/core";
import { type Article } from "@/lib/api/services/fetchLibrary";
import { CATEGORY_LABELS, cardStyle, COLS, TABLE_HEADERS, hasCover } from "./constants";
import { AddArticleModal } from "./AddArticleModal";
import { ReplaceCoverModal } from "./ReplaceCoverModal";

export default function AdminLibraryPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [coverTarget, setCoverTarget] = useState<Article | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        apiService.get<Article[]>("api/v1/articles")
            .then(r => setArticles(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleAdded = (a: Article) => {
        setArticles(prev => [...prev, a].sort((x, y) => x.sort_order - y.sort_order));
        setShowAdd(false);
    };

    const handleUploaded = (updated: Article) => {
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
        setCoverTarget(null);
    };

    const togglePublish = useCallback(async (article: Article) => {
        setTogglingId(article.id);
        try {
            const res = await apiService.patch<Article>(`api/v1/articles/${article.id}`, { is_published: !article.is_published });
            setArticles(prev => prev.map(a => a.id === article.id ? res.data : a));
        } catch { } finally { setTogglingId(null); }
    }, []);

    const deleteArticle = useCallback(async (id: string) => {
        if (!confirm("Xoá bài viết này?")) return;
        setDeletingId(id);
        try {
            await apiService.delete(`api/v1/articles/${id}`);
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch { } finally { setDeletingId(null); }
    }, []);

    const stats = useMemo(() => {
        const coverCount = articles.filter(hasCover).length;
        const publishedCount = articles.filter(a => a.is_published).length;
        return [
            { label: "Tổng bài viết", value: articles.length,             accent: "rgba(255,255,255,0.04)", border: "border-white/9",        text: "text-white" },
            { label: "Đã xuất bản",   value: publishedCount,              accent: "rgba(16,185,129,0.08)",  border: "border-emerald-500/20", text: "text-emerald-400" },
            { label: "Thiếu ảnh bìa", value: articles.length - coverCount, accent: "rgba(245,158,11,0.08)",  border: "border-amber-500/20",   text: "text-amber-400" },
        ];
    }, [articles]);

    return (
        <div className="w-full space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Thư viện</h1>
                    <p className="text-white/45 font-medium text-sm">Thêm nội dung và upload ảnh bìa — URL Cloudinary tự lưu vào DB</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all">
                    <Plus className="w-4 h-4" />Thêm bài viết
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <div key={s.label} className={`rounded-[20px] border ${s.border} px-5 py-4`} style={{ background: s.accent, backdropFilter: "blur(12px)" }}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.text} opacity-60`}>{s.label}</p>
                        <p className={`text-2xl font-extrabold tabular-nums ${s.text}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-[24px] border border-white/9 overflow-hidden" style={cardStyle}>
                <div className={`${COLS} py-3 border-b border-white/8`}>
                    {TABLE_HEADERS.map(h => (
                        <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-white/30">{h}</p>
                    ))}
                </div>

                {loading && (
                    <div className="py-14 flex items-center justify-center gap-2 text-white/30">
                        <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">Đang tải...</span>
                    </div>
                )}

                {!loading && articles.length === 0 && (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/8 border border-white/12 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white/30" />
                        </div>
                        <p className="text-sm font-bold text-white/50">Chưa có bài viết nào</p>
                        <p className="text-xs text-white/30">Bấm "Thêm bài viết" để bắt đầu</p>
                    </div>
                )}

                {!loading && articles.map((article, i) => (
                    <div key={article.id} className={`${COLS} py-4 items-center hover:bg-white/3 transition-colors ${i > 0 ? "border-t border-white/6" : ""}`}>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white/90 truncate mb-0.5">{article.title}</p>
                            <code className="text-[11px] font-mono text-white/30">{article.id}</code>
                        </div>

                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/8 text-white/50 border border-white/10 w-fit">
                            {CATEGORY_LABELS[article.category]}
                        </span>

                        <p className="text-xs text-white/40 font-medium">
                            {article.read_minutes ? `${article.read_minutes} phút` : "—"}
                        </p>

                        <div>
                            {hasCover(article) ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />OK
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-1 rounded-full">
                                    Thiếu ảnh
                                </span>
                            )}
                        </div>

                        <div>
                            {article.is_published ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Hiện</span>
                            ) : (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/8 text-white/30 border border-white/10">Ẩn</span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setCoverTarget(article)} title="Thay ảnh bìa" className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 transition-all border border-white/10 hover:border-emerald-500/30">
                                <Upload className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => togglePublish(article)} disabled={togglingId === article.id} title={article.is_published ? "Ẩn" : "Hiện"} className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/70 transition-all border border-white/10 disabled:opacity-40">
                                {togglingId === article.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : article.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => deleteArticle(article.id)} disabled={deletingId === article.id} title="Xoá" className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-all border border-white/10 hover:border-rose-500/30 disabled:opacity-40">
                                {deletingId === article.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
            {coverTarget && <ReplaceCoverModal article={coverTarget} onClose={() => setCoverTarget(null)} onUploaded={handleUploaded} />}
        </div>
    );
}
