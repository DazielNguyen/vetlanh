"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

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

    const avatarSrc = formatImageUrl(user?.avatar_url) ?? "/images/placeholder-user.jpg";

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <div className="h-24 bg-linear-to-br from-primary/30 to-[#C9E9D2]/50" />
                <CardContent className="p-5 -mt-12 text-center space-y-3">
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
                                <button onClick={saveEdit} disabled={isPending} className="text-emerald-600 hover:text-emerald-700">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-1">
                                <h2 className="text-lg font-extrabold text-slate-800">
                                    {user?.display_name ?? "—"}
                                </h2>
                                <button onClick={startEdit} className="text-slate-300 hover:text-slate-500 transition ml-1">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-slate-400">{user?.email ?? "—"}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">Free Plan</span>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-sm font-semibold">
                        Nâng cấp Pro
                    </Button>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-slate-800">Thống kê</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Ngày tham gia</span>
                            <span className="font-semibold text-slate-700">–</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Buổi tư vấn</span>
                            <span className="font-semibold text-slate-700">–</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Bài tập hoàn thành</span>
                            <span className="font-semibold text-slate-700">–</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Streak hiện tại</span>
                            <span className="font-semibold text-emerald-600">–</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
