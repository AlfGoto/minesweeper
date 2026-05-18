import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SkinsButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link href="/skins" prefetch className="w-full">
      <Button className={className}>Skins</Button>
    </Link>
  );
}
