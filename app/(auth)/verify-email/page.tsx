"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");
    const [resendEmail, setResendEmail] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Liên kết xác minh không hợp lệ. Vui lòng kiểm tra email của bạn.");
            return;
        }

        fetchAuth.verifyEmail(token)
            .then((res) => {
                setStatus("success");
                setMessage(res.message || "Email đã được xác minh thành công!");
            })
            .catch(() => {
                setStatus("error");
                setMessage("Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại.");
            });
    }, [token]);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resendEmail) return;
        setResending(true);
        setResendMessage("");
        try {
            const res = await fetchAuth.resendVerification(resendEmail);
            setResendMessage(res.message || "Email xác minh đã được gửi lại!");
        } catch {
            setResendMessage("Không thể gửi lại. Vui lòng thử lại sau.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-slate-600 font-medium">Đang xác minh email của bạn...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <CheckCircle className="h-12 w-12 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-slate-800">Xác minh thành công!</h2>
                        <p className="text-slate-500">{message}</p>
                        <Link href="/login">
                            <Button className="mt-2 rounded-2xl bg-primary text-white font-bold px-8">
                                Đăng nhập ngay
                            </Button>
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <XCircle className="h-12 w-12 text-red-400" />
                        <h2 className="text-2xl font-bold text-slate-800">Xác minh thất bại</h2>
                        <p className="text-slate-500">{message}</p>

                        <div className="w-full mt-4 text-left">
                            <p className="text-sm font-semibold text-slate-600 mb-3">Gửi lại email xác minh:</p>
                            <form onSubmit={handleResend} className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="resend-email" className="text-slate-700 font-semibold ml-1">Email</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="resend-email"
                                            type="email"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl"
                                            required
                                        />
                                    </div>
                                </div>
                                {resendMessage && (
                                    <p className="text-sm text-slate-600 font-medium">{resendMessage}</p>
                                )}
                                <Button type="submit" disabled={resending} className="w-full h-12 rounded-2xl bg-primary text-white font-bold">
                                    {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi lại email"}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 font-medium">
                <Link href="/login" className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30">
                    Quay lại đăng nhập
                </Link>
            </p>
        </div>
    );
}
