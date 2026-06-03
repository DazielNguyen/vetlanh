"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loginAsync,
  logout,
  selectAuth,
  selectUser,
} from "@/lib/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(loginAsync(credentials)).unwrap();
      toast.success("Đăng nhập thành công");
      router.push("/services");
    } catch (error: unknown) {
      const message = typeof error === "string" ? error : "Đăng nhập thất bại";
      toast.error(message);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.push("/login");
  };

  return {
    ...auth,
    user,
    login,
    logout: handleLogout,
  };
}
