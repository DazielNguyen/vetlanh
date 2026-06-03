import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// FastAPI JWT has NO role claim — check token presence + expiry only
const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token) as { exp?: number } | null;
    if (!decoded?.exp) return false;
    return decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;
  const authenticated = isTokenValid(token);

  if (pathname.endsWith(".xml") || pathname.endsWith(".json")) return NextResponse.next();

  const publicRoutes = [
    "/",
    "/landing",
    "/login",
    "/register",
    "/reset-password",
    "/supscription",
    "/verify-email",
    "/google/callback",
  ];
  const authRoutes = ["/login", "/register", "/reset-password"];

  const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (!authenticated) {
    if (isPublicRoute) return NextResponse.next();
    // Stale cookie with invalid/expired token — clear it before redirecting
    const res = NextResponse.redirect(new URL("/login", request.url));
    if (token) res.cookies.delete("authToken");
    return res;
  }

  // Already authenticated — redirect away from login/register
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/services", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|xml|glb)$).*)",
  ],
};
