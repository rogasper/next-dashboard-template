import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("auth_session")?.value;

  if (currentUser && request.nextUrl.pathname.startsWith("/sign-in")) {
    return Response.redirect(new URL("/dashboard", request.url));
  }
  if (currentUser && request.nextUrl.pathname.startsWith("/sign-up")) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  if (!currentUser && request.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
