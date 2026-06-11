"use client";

import { useState, useRef, useEffect } from "react";
import {
    Music2, Plus, Upload, Trash2, Eye, EyeOff,
    Loader2, CheckCircle2, X, CloudUpload,
} from "lucide-react";
import apiService from "@/lib/api/core";
import { type Sound, type SoundCategory } from "@/lib/api/services/fetchSounds";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<SoundCategory, string> = {
    nature: "Thiên nhiên",
    meditation: "Thiền",
    music: "Nhạc thiền",
    noise: "Tiếng ồn",
};

const CATEGORIES: SoundCategory[] = ["nature", "meditation", "music", "noise"];

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };
const overlayStyle = { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" };
const COLS = "grid grid-cols-[1fr_120px_100px_80px_140px] gap-4 px-6";
const TABLE_HEADERS = ["Sound", "Danh mục", "Thời lượng", "File", "Hành động"];

const hasAudio = (s: Sound) => !!s.audio_url;

const apiDetail = (e: unknown, fallback: string) =>
    (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? fallback;

function slugify(title: string) {
    return title
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// ── Shared ────────────────────────────────────────────────────────────────────

function CloseBtn({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
        </button>
    );
}

// ── Add Sound Modal (create + upload in one step) ─────────────────────────────

type Step = "idle" | "creating" | "uploading" | "done";

function AddSoundModal({ onClose, onAdded }: { onClose: () => void; onAdded: (s: Sound) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<SoundCategory>("nature");
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState<Step>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!title.trim()) { setError("Nhập tên sound."); return; }
        if (!file) { setError("Chọn file audio."); return; }
        setError("");

        // Step 1 — create record
        setStep("creating");
        let sound: Sound;
        try {
            const id = slugify(title) || `sound-${Date.now()}`;
            const res = await apiService.post<Sound>("api/v1/sounds", {
                id,
                title: title.trim(),
                description: null,
                category,
                cloudinary_public_id: `placeholder/${id}`,
                audio_url: "",
                duration_seconds: null,
                sort_order: 0,
                is_published: true,
            });
            sound = res.data;
        } catch (e) {
            setError(apiDetail(e, "Tạo record thất bại."));
            setStep("idle");
            return;
        }

        // Step 2 — upload file → Cloudinary URL auto-saved to DB
        setStep("uploading");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await apiService.upload<Sound>(`api/v1/sounds/${sound.id}/upload`, fd, setProgress);
            onAdded(res.data);
        } catch (e) {
            setError(apiDetail(e, "Upload thất bại — record đã tạo, thử upload lại từ danh sách."));
            setStep("idle");
        }
    };

    const stepLabel: Record<Step, string> = {
        idle: "Thêm",
        creating: "Đang tạo...",
        uploading: `Đang upload ${progress}%`,
        done: "Xong",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={overlayStyle}>
            <div className="w-full max-w-md rounded-[24px] border border-white/10 p-6 space-y-5" style={{ background: "#111915" }}>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Thêm sound</h2>
                    <CloseBtn onClick={onClose} />
                </div>

                {/* Tên */}
                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Tên sound *</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Tiếng suối rừng"
                        className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    />
                </div>

                {/* Danh mục */}
                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Danh mục</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value as SoundCategory)}
                        className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                    </select>
                </div>

                {/* File picker */}
                <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">File audio *</label>
                    <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
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
                                <p className="text-sm font-semibold">Chọn file MP3 / OGG / WAV</p>
                            </>
                        )}
                    </button>
                </div>

                {/* Upload progress */}
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
                        {stepLabel[step]}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Re-upload Modal (for existing sounds without audio) ───────────────────────

function ReuploadModal({ sound, onClose, onUploaded }: { sound: Sound; onClose: () => void; onUploaded: (s: Sound) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const upload = async () => {
        if (!file) return;
        setUploading(true); setError("");
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await apiService.upload<Sound>(`api/v1/sounds/${sound.id}/upload`, fd, setProgress);
            onUploaded(res.data);
        } catch (e) {
            setError(apiDetail(e, "Upload thất bại."));
        } finally { setUploading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={overlayStyle}>
            <div className="w-full max-w-sm rounded-[24px] border border-white/10 p-6 space-y-5" style={{ background: "#111915" }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white">Thay file audio</h2>
                        <p className="text-xs text-white/40 mt-0.5">{sound.title}</p>
                    </div>
                    <CloseBtn onClick={onClose} />
                </div>

                <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />

                <button onClick={() => inputRef.current?.click()} className="w-full h-24 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 text-white/40 hover:text-emerald-400">
                    {file ? (
                        <>
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <p className="text-sm font-semibold text-white/70">{file.name}</p>
                        </>
                    ) : (
                        <>
                            <CloudUpload className="w-6 h-6" />
                            <p className="text-sm font-semibold">Chọn file audio</p>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminSoundsPage() {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [reuploadTarget, setReuploadTarget] = useState<Sound | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        apiService.get<Sound[]>("api/v1/sounds")
            .then(r => setSounds(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleAdded = (s: Sound) => {
        setSounds(prev => [...prev, s].sort((a, b) => a.sort_order - b.sort_order));
        setShowAdd(false);
    };

    const handleUploaded = (updated: Sound) => {
        setSounds(prev => prev.map(s => s.id === updated.id ? updated : s));
        setReuploadTarget(null);
    };

    const togglePublish = async (sound: Sound) => {
        setTogglingId(sound.id);
        try {
            const res = await apiService.patch<Sound>(`api/v1/sounds/${sound.id}`, { is_published: !sound.is_published });
            setSounds(prev => prev.map(s => s.id === sound.id ? res.data : s));
        } catch { } finally { setTogglingId(null); }
    };

    const deleteSound = async (id: string) => {
        if (!confirm("Xoá sound này?")) return;
        setDeletingId(id);
        try {
            await apiService.delete(`api/v1/sounds/${id}`);
            setSounds(prev => prev.filter(s => s.id !== id));
        } catch { } finally { setDeletingId(null); }
    };

    const audioCount = sounds.filter(hasAudio).length;

    return (
        <div className="w-full space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Âm thanh</h1>
                    <p className="text-white/45 font-medium text-sm">Thêm tên và upload file — URL Cloudinary tự lưu vào DB</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all">
                    <Plus className="w-4 h-4" />Thêm sound
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Tổng sounds",  value: sounds.length,              accent: "rgba(255,255,255,0.04)", border: "border-white/9",        text: "text-white" },
                    { label: "Có audio",     value: audioCount,                 accent: "rgba(16,185,129,0.08)",  border: "border-emerald-500/20", text: "text-emerald-400" },
                    { label: "Chưa có file", value: sounds.length - audioCount, accent: "rgba(245,158,11,0.08)",  border: "border-amber-500/20",   text: "text-amber-400" },
                ].map(s => (
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

                {!loading && sounds.length === 0 && (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/8 border border-white/12 flex items-center justify-center">
                            <Music2 className="w-5 h-5 text-white/30" />
                        </div>
                        <p className="text-sm font-bold text-white/50">Chưa có sound nào</p>
                        <p className="text-xs text-white/30">Bấm "Thêm sound" để bắt đầu</p>
                    </div>
                )}

                {!loading && sounds.map((sound, i) => (
                    <div key={sound.id} className={`${COLS} py-4 items-center hover:bg-white/3 transition-colors ${i > 0 ? "border-t border-white/6" : ""}`}>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-bold text-white/90 truncate">{sound.title}</p>
                                {!sound.is_published && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/8 text-white/30 border border-white/10 shrink-0">Ẩn</span>
                                )}
                            </div>
                            <code className="text-[11px] font-mono text-white/30">{sound.id}</code>
                        </div>

                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/8 text-white/50 border border-white/10 w-fit">
                            {CATEGORY_LABELS[sound.category]}
                        </span>

                        <p className="text-xs text-white/40 font-medium">
                            {sound.duration_seconds ? `${Math.round(sound.duration_seconds / 60)} phút` : "Loop"}
                        </p>

                        <div>
                            {hasAudio(sound) ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />OK
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-1 rounded-full">
                                    Thiếu file
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setReuploadTarget(sound)} title="Thay file audio" className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 transition-all border border-white/10 hover:border-emerald-500/30">
                                <Upload className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => togglePublish(sound)} disabled={togglingId === sound.id} title={sound.is_published ? "Ẩn" : "Hiện"} className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/70 transition-all border border-white/10 disabled:opacity-40">
                                {togglingId === sound.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : sound.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => deleteSound(sound.id)} disabled={deletingId === sound.id} title="Xoá" className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-all border border-white/10 hover:border-rose-500/30 disabled:opacity-40">
                                {deletingId === sound.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && <AddSoundModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
            {reuploadTarget && <ReuploadModal sound={reuploadTarget} onClose={() => setReuploadTarget(null)} onUploaded={handleUploaded} />}
        </div>
    );
}
