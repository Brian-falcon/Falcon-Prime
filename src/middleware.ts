/**
 * Middleware para proteger rutas de administración.
 * Redirige a /admin/login si se accede a /admin/* sin cookie de sesión (excepto /admin/login).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_LOGIN = "/admin/login";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === ADMIN_LOGIN) {
    const session = request.cookies.get("falcon_admin_session");
    if (session?.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }
  const session = request.cookies.get("falcon_admin_session");
  if (!session?.value) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
