import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const url = request.nextUrl

  const isPublicPath =
    url.pathname.startsWith("/api/auth") ||
    url.pathname === "/login" ||
    url.pathname.startsWith("/_next") ||
    url.pathname === "/favicon.ico"

  if (!session && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", url.pathname + url.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
}