"use client";

import { Link } from "@/i18n/navigation";

/**
 * Skin title on a shop card. Links to the skin's SEO page, but stays visually
 * plain (underline on hover only) so the shop remains about picking skins.
 */
export function SkinName({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <p className="font-semibold">{children}</p>;
  return (
    <Link
      href={href}
      className="font-semibold underline-offset-4 hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </Link>
  );
}
