"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, MailWarning, Loader2 } from "lucide-react";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import { useDashboard } from "@/hooks/useDashboard";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { toast } from "sonner";

export function ProfileCard() {
    const { data: user } = useCurrentUser();
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState("");

    function startEdit() {
        setDraftName(user?.display_name ?? "");
        setEditing(true);
    }

    function cancelEdit() {
        setEditing(false);
    }

    function saveEdit() {
        if (!draftName.trim() || isPending) return;
        updateProfile({ display_name: draftName.trim() }, { onSuccess: () => setEditing(false) });
    }

    const { data: dashboard } = useDashboard();
    const avatarSrc = formatImageUrl(user?.avatar_url) ?? "/images/placeholder-user.jpg";

    const [sendingVerify, setSendingVerify] = useState(false);

    async function handleResendVerification() {
        if (!user?.email || sendingVerify) return;
        setSendingVerify(true);
        try {
            await fetchAuth.resendVerification(user.email);
            toast.success("Email xác minh đã được gửi!", { description: "Kiểm tra hộp thư của bạn." });
        } catch {
            toast.error("Không thể gửi email. Vui lòng thử lại sau.");
        } finally {
            setSendingVerify(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="card-lifted border-none rounded-3xl overflow-hidden">
                <CardContent className="p-6 text-center space-y-3">
                    <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto object-cover"
                    />
                    <div>
                        {editing ? (
                            <div className="flex items-center gap-2 justify-center">
                                <Input
                                    value={draftName}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    className="h-8 text-sm text-center rounded-lg"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit();
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                />
                                <button onClick={saveEdit} disabled={isPending} className="text-primary hover:text-primary/80">
                                    <Check className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button onClick={cancelEdit} className="text-foreground/30 hover:text-foreground/60">
                                    <X className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-1">
                                <h2 className="text-lg font-extrabold text-foreground">
                                    {user?.display_name ?? "Chưa đặt tên"}
                                </h2>
                                <button onClick={startEdit} className="text-foreground/20 hover:text-primary transition ml-1">
                                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-foreground/40">{user?.email ?? "Chưa có email"}</p>
                    </div>

                    {user && !user.is_verified && (
                        <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 px-4 py-3 text-left">
                            <MailWarning className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-amber-700">Email chưa xác minh</p>
                                <p className="text-xs text-amber-600/80 mt-0.5">Xác minh để bảo vệ tài khoản của bạn.</p>
                            </div>
                            <button
                                onClick={handleResendVerification}
                                disabled={sendingVerify}
                                className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                {sendingVerify
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : "Gửi lại"
                                }
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-lifted border-none rounded-3xl">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-foreground">Thống kê</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground/50">Bài tập hoàn thành</span>
                            <span className="font-semibold text-foreground">Chưa có dữ liệu</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-foreground/50">Streak hiện tại</span>
                            <span className="font-semibold text-primary">
                                {dashboard?.streak_days != null ? `${dashboard.streak_days} ngày` : "Chưa có dữ liệu"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
