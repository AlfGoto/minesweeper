import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getUserById } from "./lib/api";
import { createPlayerSlug } from "./lib/utils";

const intlMiddleware = createMiddleware(routing);

// Old player URLs: /stats/<userId> and /<locale>/stats/<userId>
const OLD_STATS_URL = /^(?:\/(en|fr|es))?\/stats\/([A-Z0-9]{12})\/?$/;

export async function proxy(request: NextRequest) {
  const match = OLD_STATS_URL.exec(request.nextUrl.pathname);
  if (match) {
    const [, locale, userId] = match;
    const user = await getUserById(userId);
    if (user) {
      const slug = createPlayerSlug(user.userName || "player", userId);
      const prefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
      const url = request.nextUrl.clone();
      url.pathname = `${prefix}/players/${slug}`;
      url.search = "";
      return NextResponse.redirect(url, 301);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|apple-icon|icon|opengraph-image|twitter-image|.*\\..*).*)",
};
