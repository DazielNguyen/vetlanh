"use client";

import { useState, useRef } from "react";
import { Loader2, CheckCircle2, CloudUpload, Upload } from "lucide-react";
import { CloseBtn } from "@/components/admin/CloseBtn";
import { type Article } from "@/lib/api/services/fetchLibrary";
import { overlayStyle, uploadCoverImage } from "./constants";

export function ReplaceCoverModal({ article, onClose, onUploaded }: { article: Article; onClose: () => void; onUploaded: (a: Article) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const upload = async () => {
        if (!file) return;
        setUploading(true); setError("");
        try {
            const updated = await uploadCoverImage(article.id, file, setProgress);
            onUploaded(updated);
        } catch (e) {
            setError((e as Error).message || "Upload thất bại.");
        } finally { setUploading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={overlayStyle}>
            <div className="w-full max-w-sm rounded-[24px] border border-white/10 p-6 space-y-5" style={{ background: "#111915" }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white">Thay ảnh bìa</h2>
                        <p className="text-xs text-white/40 mt-0.5">{article.title}</p>
                    </div>
                    <CloseBtn onClick={onClose} />
                </div>

                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />

                <button onClick={() => inputRef.current?.click()} className="w-full h-24 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 text-white/40 hover:text-emerald-400">
                    {file ? (
                        <>
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <p className="text-sm font-semibold text-white/70">{file.name}</p>
                        </>
                    ) : (
                        <>
                            <CloudUpload className="w-6 h-6" />
                            <p className="text-sm font-semibold">Chọn ảnh bìa</p>
                        </>
                    )}
                </button>

                {uploading && (
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                    </div>
                )}

                {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all">Huỷ</button>
                    <button onClick={upload} disabled={!file || uploading} className="flex-1 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
