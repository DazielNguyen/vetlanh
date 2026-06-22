"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    User, Shield, Palette, Globe, LogOut, ChevronRight,
    MailCheck, Loader2, Sun, Moon, Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useCurrentUser, useUpdateProfile, useUploadAvatar } from "@/hooks/useUser";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import type { ApiError } from "@/lib/api/core";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { toast } from "sonner";

type OpenRow = "personal" | "security" | null;

export function SettingsList() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const [sendingVerify, setSendingVerify] = useState(false);
    const [openRow, setOpenRow] = useState<OpenRow>(null);

    // Thông tin cá nhân state
    const [displayName, setDisplayName] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Bảo mật state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Đổi email state
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);

    const { theme, setTheme } = useTheme();
    const updateProfile = useUpdateProfile("Đã cập nhật thông tin");
    const uploadAvatar = useUploadAvatar();

    const changeEmail = useMutation({
        mutationFn: (data: { new_email: string; current_password: string }) =>
            fetchAuth.changeEmail(data),
        onSuccess: (_, vars) => {
            setShowEmailForm(false);
            setNewEmail("");
            setEmailPassword("");
            setEmailError(null);
            router.push(`/verify-pending?email=${encodeURIComponent(vars.new_email)}`);
        },
        onError: (error: ApiError) => {
            if (error.code === 429) {
                toast.error("Vui lòng thử lại sau 1 giờ");
            } else {
                setEmailError(error.message ?? "Cập nhật thất bại, vui lòng thử lại");
            }
        },
    });

    const changePassword = useMutation({
        mutationFn: (data: { current_password: string; new_password: string }) =>
            fetchAuth.changePassword(data),
        onSuccess: () => {
            toast.success("Mật khẩu đã được cập nhật");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setOpenRow(null);
        },
        onError: (error: ApiError) => {
            if (error.code === 429) {
                toast.error("Vui lòng thử lại sau 1 phút");
            } else {
                setPasswordError(error.message ?? "Cập nhật thất bại, vui lòng thử lại");
            }
        },
    });

    function handleLogout() {
        dispatch(logout());
        window.location.replace("/login");
    }

    async function handleResendVerification() {
        if (!user?.email || sendingVerify) return;
        setSendingVerify(true);
        try {
            await fetchAuth.resendVerification(user.email);
            router.push(`/verify-pending?email=${encodeURIComponent(user.email)}`);
        } catch {
            toast.error("Không thể gửi email. Vui lòng thử lại sau.");
        } finally {
            setSendingVerify(false);
        }
    }

    function handleOpenPersonal() {
        if (openRow === "personal") {
            setOpenRow(null);
            setShowEmailForm(false);
        } else {
            setDisplayName(user?.display_name ?? "");
            setAvatarPreview(null);
            setAvatarFile(null);
            setShowEmailForm(false);
            setOpenRow("personal");
        }
    }

    function handleChangeEmail() {
        setEmailError(null);
        if (!newEmail.trim() || !emailPassword) return;
        changeEmail.mutate({ new_email: newEmail.trim(), current_password: emailPassword });
    }

    function handleOpenSecurity() {
        if (openRow === "security") {
            setOpenRow(null);
        } else {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setOpenRow("security");
        }
    }

    function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 5MB");
            e.target.value = "";
            return;
        }
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAvatarPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    function handleUploadAvatar() {
        if (!avatarFile) return;
        uploadAvatar.mutate(avatarFile, {
            onSuccess: () => {
                setAvatarPreview(null);
                setAvatarFile(null);
            },
        });
    }

    function handleSaveDisplayName() {
        const trimmed = displayName.trim();
        if (!trimmed) return;
        updateProfile.mutate(
            { display_name: trimmed },
            { onSuccess: () => setOpenRow(null) }
        );
    }

    function handleChangePassword() {
        setPasswordError(null);
        if (newPassword.length < 8) {
            setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Mật khẩu xác nhận không khớp");
            return;
        }
        changePassword.mutate({ current_password: currentPassword, new_password: newPassword });
    }

    const currentAvatarSrc = avatarPreview ?? formatImageUrl(user?.avatar_url) ?? "/images/placeholder-user.jpg";

    return (
        <div className="space-y-6">
            {/* Tài khoản */}
            <Card className="card-lifted border-none rounded-3xl overflow-hidden divide-y divide-border/30">
                <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground/40 uppercase tracking-wider">Tài khoản</h2>

                {/* Thông tin cá nhân — accordion */}
                <div>
                    <button
                        onClick={handleOpenPersonal}
                        className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm">Thông tin cá nhân</h3>
                            <p className="text-xs text-foreground/40">Tên, ảnh đại diện, email</p>
                        </div>
                        <ChevronRight
                            className={cn(
                                "w-4 h-4 text-foreground/20 shrink-0 transition-transform duration-200",
                                openRow === "personal" && "rotate-90"
                            )}
                            strokeWidth={2}
                        />
                    </button>

                    <div className={cn(
                        "overflow-hidden transition-all duration-200",
                        openRow === "personal" ? "max-h-160" : "max-h-0"
                    )}>
                        <div className="px-4 pb-4 space-y-4">
                            {/* Avatar upload */}
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <img
                                        src={currentAvatarSrc}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-2xl object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <Camera className="w-5 h-5 text-white" strokeWidth={2} />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-medium text-primary hover:underline text-left"
                                    >
                                        Chọn ảnh mới
                                    </button>
                                    <p className="text-[11px] text-foreground/30">JPG, PNG, WebP · Tối đa 5MB</p>
                                    {avatarFile && (
                                        <Button
                                            size="sm"
                                            onClick={handleUploadAvatar}
                                            disabled={uploadAvatar.isPending}
                                            className="h-7 text-xs"
                                        >
                                            {uploadAvatar.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Cập nhật ảnh"}
                                        </Button>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    className="hidden"
                                    onChange={handleAvatarFileChange}
                                />
                            </div>

                            {/* Display name */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground/60">Tên hiển thị</label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Nhập tên hiển thị"
                                    className="h-9 text-sm"
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveDisplayName()}
                                />
                            </div>

                            {/* Email — expandable change form */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-foreground/60">Email</label>
                                    <button
                                        type="button"
                                        onClick={() => { setShowEmailForm((v) => !v); setEmailError(null); }}
                                        className="text-[11px] font-medium text-primary hover:underline"
                                    >
                                        {showEmailForm ? "Hủy đổi" : "Đổi email"}
                                    </button>
                                </div>
                                <p className="text-sm text-foreground/50 py-1">{user?.email}</p>

                                {showEmailForm && (
                                    <div className="space-y-2 pt-1">
                                        <Input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => { setNewEmail(e.target.value); setEmailError(null); }}
                                            placeholder="Email mới"
                                            className="h-9 text-sm"
                                        />
                                        <Input
                                            type="password"
                                            value={emailPassword}
                                            onChange={(e) => { setEmailPassword(e.target.value); setEmailError(null); }}
                                            placeholder="Mật khẩu hiện tại để xác nhận"
                                            className="h-9 text-sm"
                                            onKeyDown={(e) => e.key === "Enter" && handleChangeEmail()}
                                        />
                                        {emailError && (
                                            <p className="text-xs text-destructive">{emailError}</p>
                                        )}
                                        <Button
                                            size="sm"
                                            onClick={handleChangeEmail}
                                            disabled={changeEmail.isPending || !newEmail.trim() || !emailPassword}
                                            className="h-8 text-xs w-full"
                                        >
                                            {changeEmail.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Gửi email xác nhận"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button
                                    size="sm"
                                    onClick={handleSaveDisplayName}
                                    disabled={updateProfile.isPending || !displayName.trim()}
                                    className="h-8 text-xs"
                                >
                                    {updateProfile.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Lưu"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setOpenRow(null)}
                                    className="h-8 text-xs"
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bảo mật — accordion */}
                <div>
                    <button
                        onClick={handleOpenSecurity}
                        className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm">Bảo mật</h3>
                            <p className="text-xs text-foreground/40">Mật khẩu, xác thực 2 lớp</p>
                        </div>
                        <ChevronRight
                            className={cn(
                                "w-4 h-4 text-foreground/20 shrink-0 transition-transform duration-200",
                                openRow === "security" && "rotate-90"
                            )}
                            strokeWidth={2}
                        />
                    </button>

                    <div className={cn(
                        "overflow-hidden transition-all duration-200",
                        openRow === "security" ? "max-h-90" : "max-h-0"
                    )}>
                        <div className="px-4 pb-4 space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground/60">Mật khẩu hiện tại</label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); }}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="h-9 text-sm"
                                />
                                {passwordError && (
                                    <p className="text-xs text-destructive mt-1">{passwordError}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground/60">Mật khẩu mới</label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); }}
                                    placeholder="Ít nhất 8 ký tự"
                                    className="h-9 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground/60">Xác nhận mật khẩu mới</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="h-9 text-sm"
                                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button
                                    size="sm"
                                    onClick={handleChangePassword}
                                    disabled={changePassword.isPending || !currentPassword || !newPassword || !confirmPassword}
                                    className="h-8 text-xs"
                                >
                                    {changePassword.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Đổi mật khẩu"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setOpenRow(null)}
                                    className="h-8 text-xs"
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email verification row */}
                <button
                    onClick={!user?.is_verified ? handleResendVerification : undefined}
                    disabled={sendingVerify || user?.is_verified}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left disabled:cursor-default disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${user?.is_verified ? "bg-emerald-100/80" : "bg-amber-100/80"}`}>
                        {sendingVerify
                            ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" strokeWidth={2} />
                            : <MailCheck className={`w-5 h-5 ${user?.is_verified ? "text-emerald-500" : "text-amber-500"}`} strokeWidth={2} />
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Xác minh email</h3>
                        <p className="text-xs text-foreground/40">
                            {user?.is_verified ? "Email đã được xác minh" : "Nhấn để gửi lại email xác minh"}
                        </p>
                    </div>
                    {user?.is_verified ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                            Đã xác minh
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                            Chưa xác minh
                        </span>
                    )}
                </button>
            </Card>

            {/* Tùy chỉnh */}
            <Card className="card-lifted border-none rounded-3xl overflow-hidden divide-y divide-border/30">
                <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground/40 uppercase tracking-wider">Tùy chỉnh</h2>

                {/* Giao diện — dark mode toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left"
                >
                    <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                        <Palette className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Giao diện</h3>
                        <p className="text-xs text-foreground/40">
                            {theme === "dark" ? "Chế độ tối" : "Chế độ sáng"}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                        {theme === "dark"
                            ? <Moon className="w-4 h-4 text-primary" strokeWidth={2} />
                            : <Sun className="w-4 h-4 text-primary" strokeWidth={2} />
                        }
                    </div>
                </button>

                {/* Ngôn ngữ — static */}
                <button className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Ngôn ngữ</h3>
                        <p className="text-xs text-foreground/40">Tiếng Việt</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 shrink-0" strokeWidth={2} />
                </button>
            </Card>

            {/* Đăng xuất */}
            <Card className="card-lifted border-none rounded-3xl overflow-hidden">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 hover:bg-destructive/5 transition text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                >
                    <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <LogOut className="w-5 h-5 text-destructive" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-destructive text-sm">Đăng xuất</span>
                </button>
            </Card>
        </div>
    );
}
