"use client";

import { useState, useRef } from "react";
import { Loader2, CheckCircle2, CloudUpload } from "lucide-react";
import apiService from "@/lib/api/core";
import { generateSlug } from "@/lib/utils/generateSlug";
import { CloseBtn } from "@/components/admin/CloseBtn";
import { type Article, type ArticleCategory } from "@/lib/api/services/fetchLibrary";
import { CATEGORIES, CATEGORY_LABELS, overlayStyle, apiDetail, uploadCoverImage } from "./constants";

type Step = "idle" | "creating" | "uploading";

const STEP_LABEL: Record<Step, string> = {
    idle: "Thêm",
    creating: "Đang tạo...",
    uploading: "Đang upload...",
};

export function AddArticleModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: Article) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<ArticleCategory>("healing");
    const [readMinutes, setReadMinutes] = useState("5");
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState<Step>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!title.trim()) { setError("Nhập tiêu đề bài viết."); return; }
        setError("");

        setStep("creating");
        let article: Article;
        try {
            const id = generateSlug(title) || `article-${Date.now()}`;
            const res = await apiService.post<Article>("api/v1/articles", {
                id,
                title: title.trim(),
                excerpt: excerpt.trim() || null,
                content: content.trim() || null,
                category,
                read_minutes: readMinutes ? Number(readMinutes) : null,
                cover_url: null,
                cloudinary_public_id: null,
                sort_order: 0,
                is_published: true,
            });
            article = res.data;
        } catch (e) {
            setError(apiDetail(e, "Tạo bài viết thất bại."));
            setStep("idle");
            return;
        }

        if (!file) {
            onAdded(article);
            return;
        }

        setStep("uploading");
        try {
            const updated = await uploadCoverImage(article.id, file, setProgress);
            onAdded(updated);
        } catch (e) {
            setError((e as Error).message || "Upload ảnh thất bại — bài viết đã tạo, thử upload lại từ danh sách.");
            setStep("idle");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={overlayStyle}>
            <div className="w-full max-w-md rounded-[24px] border border-white/10 p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ background: "#111915" }}>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Thêm bài viết</h2>
                    <CloseBtn onClick={onClose} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Tiêu đề *</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="5 kỹ thuật chữa lành hiệu quả nhất"
                        className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Câu dẫn / Tóm tắt</label>
                    <textarea
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                        placeholder="Tóm tắt ngắn hiển thị trên thẻ bài viết..."
                        rows={2}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Nội dung</label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Nội dung đầy đủ của bài viết..."
                        rows={5}
                        className="w-full min-h-[120px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-y"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-white/50 mb-1.5">Danh mục</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value as ArticleCategory)}
                            className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/50 mb-1.5">Phút đọc</label>
                        <input
                            type="number"
                            min="1"
                            value={readMinutes}
                            onChange={e => setReadMinutes(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Ảnh bìa</label>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="w-full h-24 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 text-white/40 hover:text-emerald-400"
                    >
                        {file ? (
                            <>
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <p className="text-sm font-semibold text-white/70">{file.name}</p>
                                <p className="text-xs text-white/30">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                            </>
                        ) : (
                            <>
                                <CloudUpload className="w-6 h-6" />
                                <p className="text-sm font-semibold">Chọn ảnh JPG / PNG / WEBP</p>
                            </>
                        )}
                    </button>
                </div>

                {step === "uploading" && (
                    <div className="space-y-1.5">
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-white/40 text-right">{progress}%</p>
                    </div>
                )}

                {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose} disabled={step !== "idle"} className="flex-1 h-10 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-40">
                        Huỷ
                    </button>
                    <button onClick={submit} disabled={step !== "idle"} className="flex-1 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {step !== "idle" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {STEP_LABEL[step]}
                    </button>
                </div>
            </div>
        </div>
    );
}
