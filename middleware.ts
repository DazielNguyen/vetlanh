import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// FastAPI JWT has NO role claim — check token presence + expiry only.
// exp is optional: some FastAPI configs omit it; the BE validates expiry on each API call.
const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token) as { exp?: number } | null;
    if (!decoded) return false;
    // Only reject if exp is present AND already expired
    if (decoded.exp && decoded.exp <= Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
};

// Reads ADMIN_USERS env var (comma-separated list of JWT sub values or usernames).
// Returns true if the token's sub claim is in the whitelist.
const isAdminToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const adminList = (process.env.ADMIN_USERS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminList.length === 0) return false;
  try {
    const decoded = jwtDecode(token) as { sub?: string } | null;
    if (!decoded?.sub) return false;
    return adminList.includes(decoded.sub);
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
    "/verify",
    "/verify-pending",
    "/verify-email-change",
    "/resend-verification",
    "/auth/google/callback", // Google OAuth callback — token not yet in cookie at this point
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

  // Admin route guard — authenticated but not whitelisted → redirect to services
  if (pathname.startsWith("/admin") && !isAdminToken(token)) {
    return NextResponse.redirect(new URL("/services", request.url));
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
