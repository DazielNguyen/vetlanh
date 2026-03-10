import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const getUserRoles = (token: string | undefined): string[] => {
  if (!token) return [];
  try {
    const decoded = jwtDecode(token) as { role?: string | string[]; exp?: number } | null;

    // Token hết hạn — coi như chưa đăng nhập
    if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) return [];

    if (!decoded?.role) return [];
    return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
  } catch {
    return [];
  }
};

const hasRole = (roles: string[], target: string) => roles.includes(target);

const getPrimaryRole = (roles: string[]) => {
  if (roles.includes("ROLE_ADMIN")) return "ROLE_ADMIN";
  if (roles.includes("ROLE_INSTRUCTOR")) return "ROLE_INSTRUCTOR";
  if (roles.includes("ROLE_STUDENT")) return "ROLE_STUDENT";
  return null;
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;
  const userRoles = getUserRoles(token);
  const primaryRole = getPrimaryRole(userRoles);

  // Static files — always accessible
  if (pathname.endsWith(".xml") || pathname.endsWith(".json")) return NextResponse.next();

  const publicRoutes = [
    "/",
    "/landing",
    "/login",
    "/register",
    "/reset-password",
    "/courses",
    "/supscription",
  ];
  const authRoutes = ["/login", "/register", "/reset-password"];

  const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Chưa đăng nhập
  if (!token || userRoles.length === 0) {
    if (isPublicRoute) return NextResponse.next();
    const res = NextResponse.redirect(new URL("/login", request.url));
    if (token) res.cookies.delete("authToken");
    return res;
  }

  // Đang ở trang auth mà đã đăng nhập → redirect theo role
  if (isAuthRoute) {
    if (primaryRole === "ROLE_ADMIN")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (primaryRole === "ROLE_INSTRUCTOR")
      return NextResponse.redirect(new URL("/instructor/dashboard", request.url));
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  const isAdminRoute = pathname.startsWith("/admin/");
  const isInstructorRoute = pathname.startsWith("/instructor/");
  const isCoursesRoute = pathname.startsWith("/courses");
  const isMyBeyondRoute = pathname.startsWith("/mybeyond");

  // ADMIN
  if (hasRole(userRoles, "ROLE_ADMIN")) {
    if (isAdminRoute) return NextResponse.next();
    if (userRoles.length > 1) {
      if (isInstructorRoute && hasRole(userRoles, "ROLE_INSTRUCTOR")) return NextResponse.next();
      if ((isCoursesRoute || isMyBeyondRoute) && hasRole(userRoles, "ROLE_STUDENT"))
        return NextResponse.next();
      if (pathname === "/" || pathname === "/landing") return NextResponse.next();
    }
    if (!isPublicRoute) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // INSTRUCTOR
  if (hasRole(userRoles, "ROLE_INSTRUCTOR")) {
    if (isInstructorRoute || isCoursesRoute || pathname === "/" || pathname === "/landing")
      return NextResponse.next();
    if (isMyBeyondRoute) {
      const tab = searchParams.get("tab");
      // Giới hạn tab cho instructor — tùy chỉnh theo business logic
      const allowedTabs = [
        null,
        "mycourse",
        "myprofile",
        "myusage",
        "mycertificate",
        "payment-history",
        "mywallet",
      ];
      if (allowedTabs.includes(tab)) return NextResponse.next();
      return NextResponse.redirect(new URL("/mybeyond?tab=myprofile", request.url));
    }
    if (isAdminRoute && !hasRole(userRoles, "ROLE_ADMIN"))
      return NextResponse.redirect(new URL("/instructor/dashboard", request.url));
    return NextResponse.next();
  }

  // STUDENT
  if (hasRole(userRoles, "ROLE_STUDENT")) {
    if (isAdminRoute) return NextResponse.redirect(new URL("/courses", request.url));
    if (isInstructorRoute && !hasRole(userRoles, "ROLE_INSTRUCTOR"))
      return NextResponse.redirect(new URL("/courses", request.url));
    if (isCoursesRoute || pathname === "/" || pathname === "/landing") return NextResponse.next();
    if (isMyBeyondRoute) {
      const tab = searchParams.get("tab");
      const allowedTabs = [
        null,
        "mycourse",
        "myprofile",
        "myusage",
        "mycertificate",
        "payment-history",
      ];
      if (allowedTabs.includes(tab)) return NextResponse.next();
      // Wallet chỉ cho instructor
      if (tab === "mywallet" && hasRole(userRoles, "ROLE_INSTRUCTOR")) return NextResponse.next();
      return NextResponse.redirect(new URL("/mybeyond?tab=myprofile", request.url));
    }
    return NextResponse.next();
  }

  // Không có role hợp lệ
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete("authToken");
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|xml|glb)$).*)",
  ],
};
