import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("jira-token");
  const { pathname } = req.nextUrl;

  // Exclude requests for static files and API routes
  if (
    pathname.startsWith("/_next") || // Next.js static files
    pathname.startsWith("/api") || // API routes
    pathname.startsWith("/favicon.ico") || // Favicon
    pathname.match(/\.(.*)$/) // File extensions like .css, .js, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Unprotected routes
  const unprotectedRoutes = ["/sign-in", "/sign-up"];
  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the user is trying to access a protected path
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token.value, secret);
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow access if the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!sign-in|sign-up).*)", // Protect all routes except 'sign-in' and 'sign-up'
  ],
};
