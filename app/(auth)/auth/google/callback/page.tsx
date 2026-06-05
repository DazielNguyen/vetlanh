"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, decodeToken } from "@/lib/redux/slices/authSlice";

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            // No token — redirect to login; BE error case is handled there via ?error=
            router.replace("/login");
            return;
        }

        dispatch(setToken({ token, user: decodeToken(token) }));
        // Hard navigation so the browser sends a fresh HTTP request.
        // router.replace is a soft navigation — Next.js may not include the newly
        // set authToken cookie in the RSC fetch, causing middleware to see no token
        // and redirect back to /login.
        window.location.replace("/services");
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full">
            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center flex flex-col items-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-slate-600 font-medium">Đang xử lý đăng nhập Google...</p>
            </div>
        </div>
    );
}
