// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Vérifie si le token est présent dans les cookies
  const token = request.cookies.get("token");

  // Redirige vers la page de login si l'utilisateur tente d'accéder à une page protégée sans token
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Empêche l'accès aux pages de login et de registre si l'utilisateur est déjà connecté
  if (
    token &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Autorise la navigation normale
  return NextResponse.next();
}

// Spécifie les routes pour lesquelles le middleware est applicable
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
