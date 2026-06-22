"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import { useDashboard } from "@/hooks/useDashboard";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

function SubscriptionBadge({ status }: { status: string | undefined }) {
    if (status === "pro") {
        return (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#6D8A96] text-white px-2 py-0.5 rounded-full ml-1">
                Pro
            </span>
        );
    }
    if (status === "expired") {
        return (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-red-100 text-red-500 px-2 py-0.5 rounded-full ml-1">
                Hết hạn
            </span>
        );
    }
    return (
        <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-1">
            Free
        </span>
    );
}

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
                                <SubscriptionBadge status={user?.subscription_status} />
                                <button onClick={startEdit} className="text-foreground/20 hover:text-primary transition ml-1">
                                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-foreground/40">{user?.email ?? "Chưa có email"}</p>
                        {user?.subscription_status === "pro" && user.subscription_expires_at && (
                            <p className="text-xs text-foreground/40 mt-0.5">
                                Pro đến {new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(user.subscription_expires_at))}
                            </p>
                        )}
                        {user?.subscription_status !== "pro" && (
                            <Link
                                href="/services/upgrade"
                                className="inline-flex items-center justify-center mt-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#6D8A96]/40 text-[#6D8A96] hover:bg-[#6D8A96]/10 transition-colors min-h-8"
                            >
                                Nâng cấp Pro
                            </Link>
                        )}
                    </div>
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
