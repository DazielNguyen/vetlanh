"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, decodeToken } from "@/lib/redux/slices/authSlice";

export default function GoogleCallbackPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Read directly from window.location.search — always accurate on client.
        // useSearchParams() can return empty params on first render in Next.js 15
        // App Router before hydration completes, causing a false "no token" redirect.
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            // No token — BE error redirect goes to /login?error=... not here
            window.location.replace("/login");
            return;
        }

        // Validate the JWT is well-formed before trusting it.
        // decodeToken returns null for malformed input — reject to avoid setting
        // an unauthenticated session with isAuthenticated: true.
        const user = decodeToken(token);
        if (!user) {
            window.location.replace("/login?error=Xác+thực+Google+thất+bại.+Vui+lòng+thử+lại.");
            return;
        }

        dispatch(setToken({ token, user }));
        // Hard navigation ensures the browser sends a fresh HTTP request with the
        // newly set authToken cookie — soft navigation (router.replace) may not
        // include it, causing middleware to redirect back to /login.
        window.location.replace("/services");
    }, []); // run once on mount — window.location is stable

    return (
        <div className="w-full">
            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center flex flex-col items-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-slate-600 font-medium">Đang xử lý đăng nhập Google...</p>
            </div>
        </div>
    );
}
