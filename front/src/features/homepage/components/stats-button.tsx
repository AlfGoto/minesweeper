import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StatsButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/stats" prefetch className="w-full">
      <Button className={className}>Stats</Button>
    </Link>
  );
}
