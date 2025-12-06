import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token");
    const isLoginPage = request.nextUrl.pathname === "/login";

    // If trying to access login page while authenticated, redirect to dashboard
    if (isLoginPage && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If trying to access protected route while not authenticated, redirect to login
    if (!isLoginPage && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/login (login API)
         * - api/logout (logout API)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/login|api/logout|_next/static|_next/image|favicon.ico).*)",
    ],
};
