"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, decodeToken } from "@/lib/redux/slices/authSlice";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const code = searchParams.get("code");

    const [error, setError] = useState("");

    useEffect(() => {
        if (!code) {
            setError("Không nhận được mã xác thực từ Google. Vui lòng thử lại.");
            return;
        }

        fetchAuth.googleCallback(code)
            .then(({ access_token }) => {
                dispatch(setToken({ token: access_token, user: decodeToken(access_token) }));
                router.push("/services");
            })
            .catch(() => {
                setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
            });
    }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return (
            <div className="w-full">
                <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center flex flex-col items-center gap-4">
                    <XCircle className="h-12 w-12 text-red-400" />
                    <h2 className="text-2xl font-bold text-slate-800">Đăng nhập thất bại</h2>
                    <p className="text-slate-500">{error}</p>
                    <Link href="/login">
                        <Button className="mt-2 rounded-2xl bg-primary text-white font-bold px-8">
                            Thử lại
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center flex flex-col items-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-slate-600 font-medium">Đang xử lý đăng nhập Google...</p>
            </div>
        </div>
    );
}
