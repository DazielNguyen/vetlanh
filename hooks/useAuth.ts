/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loginAsync,
  logoutAsync,
  selectAuth,
  selectUser,
  setupAutoRefresh,
} from "@/lib/redux/slices/authSlice";
import { ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT } from "@/lib/types/roles";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  const roles = user?.role ?? [];
  const isAdmin = roles.includes(ROLE_ADMIN);
  const isInstructor = roles.includes(ROLE_INSTRUCTOR);
  const isStudent = roles.includes(ROLE_STUDENT);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap();

      // Setup auto-refresh sau khi login thành công
      if (result.token) setupAutoRefresh(result.token, dispatch as any);

      toast.success("Đăng nhập thành công");

      // Redirect theo role
      if (roles.includes(ROLE_ADMIN)) router.push("/admin/dashboard");
      else if (roles.includes(ROLE_INSTRUCTOR)) router.push("/instructor/dashboard");
      else router.push("/courses");

      return result;
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  return {
    ...auth,
    user,
    isAdmin,
    isInstructor,
    isStudent,
    login,
    logout,
  };
}
