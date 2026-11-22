import { Coins } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  PreviewGrid,
  PREVIEW_2X2_CELLS,
} from "@/features/shared/components/cell-skin-preview";
import { SkinCtaButtons } from "@/components/skin-cta-buttons";
import type { OgColors } from "@/features/skins/cells/skins";
import type { CellSkin } from "@/types/bff";

/** Darkest colour and light tint of a skin, from its `ogColors`. */
export function getSkinColors(ogColors?: OgColors) {
  if (!ogColors) {
    return {
      dark: "var(--color-neutral-900)",
      tint: "var(--color-neutral-50)",
    };
  }
  return {
    dark: ogColors.hidden,
    tint: `color-mix(in srgb, ${ogColors.revealedAlt} 50%, white)`,
  };
}

export function Swatch({ skin, size }: { skin: CellSkin; size: "md" | "lg" }) {
  return (
    <span className="inline-block shrink-0 overflow-hidden rounded-md">
      <PreviewGrid
        skin={skin}
        grid={PREVIEW_2X2_CELLS}
        gridSize={2}
        cellClassName={
          size === "lg" ? "size-7 text-xs" : "size-[22px] text-[10px]"
        }
      />
    </span>
  );
}

export function StatBoxes({
  priceLabel,
  price,
  dark,
}: {
  priceLabel: string;
  price?: number;
  dark?: boolean;
}) {
  const box = cn(
    "min-w-[150px] rounded-xl border px-4 py-2.5",
    dark ? "border-white/18 text-white" : "bg-white",
  );
  const label = cn(
    "text-xs font-semibold uppercase",
    dark ? "text-slate-300" : "text-muted-foreground",
  );
  return (
    <div className="flex flex-wrap gap-3">
      {typeof price === "number" && (
        <div className={box}>
          <p className={label}>{priceLabel}</p>
          <p className="flex items-center gap-1.5 text-[15px]">
            <Coins className="size-4" aria-hidden />
            <strong className="text-xl font-bold">{price}</strong> AlfCoins
          </p>
        </div>
      )}
    </div>
  );
}

export function TextSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h2 className="text-[28px] font-semibold text-neutral-900">{title}</h2>
      <div className="flex flex-col gap-4 text-[17px] leading-7 text-neutral-700">
        {children}
      </div>
    </section>
  );
}

export function FaqSection({
  title,
  entries,
  ariaLabel,
}: {
  title: string;
  entries: { question: string; answer: string }[];
  ariaLabel: string;
}) {
  return (
    <section aria-label={ariaLabel} className="flex flex-col gap-4">
      <h2 className="text-[28px] font-semibold text-neutral-900">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3">
        {entries.map((entry) => (
          <div key={entry.question} className="rounded-xl border bg-white p-5">
            <h3 className="text-base font-semibold text-neutral-900">
              {entry.question}
            </h3>
            <p className="mt-2 text-[15px] text-neutral-600">{entry.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RelatedSection({
  title,
  ariaLabel,
  items,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  ariaLabel: string;
  items: { slug: string; name: string; href: string; swatch: React.ReactNode }[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <section aria-label={ariaLabel} className="flex flex-col gap-4">
      <h2 className="text-[28px] font-semibold text-neutral-900">{title}</h2>
      <nav className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="flex items-center gap-3 rounded-xl border bg-white p-3 transition-colors hover:bg-accent"
          >
            {item.swatch}
            <span className="text-[15px] font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <Link
        href={viewAllHref}
        className="text-sm font-medium text-green-700 hover:underline"
      >
        {viewAllLabel}
      </Link>
    </section>
  );
}

export function BottomCta({
  darkColor,
  swatch,
  trySkinText,
  signInLabel,
  playLabel,
}: {
  darkColor: string;
  swatch: React.ReactNode;
  trySkinText: string;
  signInLabel: string;
  playLabel: string;
}) {
  return (
    <section
      aria-label="Call to action"
      className="mx-4 mt-[72px] mb-16 flex flex-col items-center gap-4 rounded-[28px] px-5 py-8 text-center text-white md:mx-auto md:max-w-[1104px] md:px-6 md:py-12"
      style={{ backgroundColor: darkColor }}
    >
      {swatch}
      <p className="max-w-xl text-lg">{trySkinText}</p>
      <SkinCtaButtons
        signInLabel={signInLabel}
        playLabel={playLabel}
        tone="dark"
        className="justify-center"
      />
    </section>
  );
}
