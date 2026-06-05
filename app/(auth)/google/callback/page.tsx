"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, decodeToken } from "@/lib/redux/slices/authSlice";

function toViOAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("already_exists") || lower.includes("already exists"))
    return "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu.";
  if (lower.includes("not_verified") || lower.includes("not verified"))
    return "Tài khoản chưa xác minh. Vui lòng kiểm tra hộp thư của bạn.";
  if (lower.includes("bad_credentials") || lower.includes("unauthorized"))
    return "Đăng nhập Google thất bại. Vui lòng thử lại.";
  return "Đăng nhập Google thất bại. Vui lòng thử lại.";
}

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(toViOAuthError(error), { duration: 8000 });
      router.push("/login");
      return;
    }

    if (!token) {
      toast.error("Không tìm thấy token. Vui lòng thử lại.", { duration: 8000 });
      router.push("/login");
      return;
    }

    try {
      const user = decodeToken(token);
      if (!user) {
        console.error("[Google Callback] Token decode returned null");
        toast.error("Xác thực thất bại. Vui lòng thử lại.", { duration: 8000 });
        router.push("/login");
        return;
      }
      dispatch(setToken({ token, user }));
      toast.success("Đăng nhập Google thành công!");
      router.push("/services");
    } catch (err) {
      console.error("[Google Callback] Failed to decode token:", err);
      toast.error("Xác thực thất bại. Vui lòng thử lại.", { duration: 8000 });
      router.push("/login");
    }
  }, [token, error, router, dispatch]);

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đang xác thực...</h2>
        <p className="text-slate-500">Vui lòng chờ trong giây lát.</p>
      </div>
    </div>
  );
}
