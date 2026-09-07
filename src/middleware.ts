import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { panelPara } from "@/lib/roles";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user as { role?: string } | undefined;
  const path = nextUrl.pathname;

  const necesitaAuth = ["/cliente", "/chef", "/repartidor", "/admin"].some((p) =>
    path.startsWith(p),
  );

  if (necesitaAuth && !user) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // El área /admin es solo para administradores.
  if (path.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL(panelPara(user?.role), nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/cliente/:path*",
    "/chef/:path*",
    "/repartidor/:path*",
    "/admin/:path*",
  ],
};
