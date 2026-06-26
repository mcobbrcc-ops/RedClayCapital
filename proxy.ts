import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "www.redclaycap.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "redclaycap.com";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*"
};
