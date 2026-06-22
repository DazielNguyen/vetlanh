"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthIconCircle } from "@/components/auth/auth-card";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

type Status = "loading" | "success" | "error";

export default function VerifyEmailChangeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<Status>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Token xác thực không hợp lệ hoặc đã hết hạn.");
            return;
        }
        fetchAuth
            .verifyEmailChange(token)
            .then(() => {
                setStatus("success");
                // JWT containing old email is now invalid — user must re-login.
                // Store the timer so we can cancel it if the component unmounts before it fires.
                redirectTimerRef.current = setTimeout(() => router.replace("/login"), 3000);
            })
            .catch((err) => {
                setStatus("error");
                setErrorMessage(err?.message ?? "Xác thực thất bại. Vui lòng thử lại.");
            });

        return () => {
            if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        };
        // router from next/navigation is referentially stable across renders — safe to omit from deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <AuthCard>
            <div className="flex justify-center mb-6">
                <AuthIconCircle>
                    {status === "loading" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
                    {status === "success" && <CheckCircle2 className="w-8 h-8 text-white" />}
                    {status === "error" && <XCircle className="w-8 h-8 text-white" />}
                </AuthIconCircle>
            </div>

            <div className="text-center mb-8">
                {status === "loading" && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Đang xác thực...</h2>
                        <p className="text-white/65 text-sm">Vui lòng chờ trong giây lát.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Email đã được xác thực</h2>
                        <p className="text-white/65 text-sm leading-relaxed">
                            Địa chỉ email của bạn đã được cập nhật thành công.
                            <br />
                            Đang chuyển về trang đăng nhập...
                        </p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Xác thực thất bại</h2>
                        <p className="text-white/65 text-sm leading-relaxed">{errorMessage}</p>
                    </>
                )}
            </div>

            {status === "error" && (
                <Button
                    onClick={() => router.replace("/login")}
                    variant="outline"
                    className="w-full h-12 rounded-2xl bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white font-semibold transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                </Button>
            )}
        </AuthCard>
    );
}
