import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** The single "go play" call to action used at the bottom of content pages. */
export function PlayCta({ children, href = "/" }: { children: React.ReactNode; href?: string }) {
  return (
    <Button asChild size="lg">
      <Link href={href}>{children}</Link>
    </Button>
  );
}
