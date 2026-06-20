import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if target is an admin path
  const isAdminPath = path.startsWith("/admin");
  const isLoginPath = path === "/admin/login";

  if (isAdminPath) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    
    // Decrypt and verify session JWT
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (!session && !isLoginPath) {
      // Not authenticated, redirecting to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (session && isLoginPath) {
      // Already authenticated and trying to access login, redirect to dashboard
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
