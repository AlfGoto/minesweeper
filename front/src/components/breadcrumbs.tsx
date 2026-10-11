import { Link } from "@/i18n/navigation";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-green-600">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-green-600">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
