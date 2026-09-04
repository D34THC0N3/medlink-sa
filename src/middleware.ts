/**
 * Root-level middleware: auth guards + security headers.
 * Runs on every matched request.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "patient" | "doctor" | "hospital" | "pharmacy" | "admin";

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  patient: "/dashboard/patient",
  doctor: "/dashboard/doctor",
  hospital: "/dashboard/hospital",
  pharmacy: "/dashboard/pharmacy",
  admin: "/dashboard/admin",
};

const VALID_ROLES = Object.keys(ROLE_DASHBOARDS) as string[];

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/api/auth"];

/**
 * Decode a JWT payload without importing a library.
 * Edge Runtime has no Node crypto — base64url decode is sufficient
 * for reading claims (not verifying signatures).
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;
    // base64url → base64 padding
    const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getSessionUser(req: NextRequest): { role: UserRole } | null {
  const token =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // NextAuth v4 JWT shape: { user: { id, name, email, role, ... }, exp, iat }
  const user = payload.user as Record<string, unknown> | undefined;
  const role = user?.role as string | undefined;
  if (!role || !VALID_ROLES.includes(role)) return null;
  return { role: role as UserRole };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths, static assets, Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Dashboard routes require auth
  if (pathname.startsWith("/dashboard")) {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access guard: enforce that each role only
    // accesses their own dashboard prefix
    const allowedPrefix = ROLE_DASHBOARDS[sessionUser.role];
    if (!pathname.startsWith(allowedPrefix)) {
      const dashUrl = new URL(allowedPrefix, req.url);
      return NextResponse.redirect(dashUrl);
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // ponytail: relaxed CSP for inline styles (shadcn + Tailwind) and
  // framer-motion's script usage. Tighten once inline styles are removed.
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
