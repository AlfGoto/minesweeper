"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Square, SquareCheck } from "lucide-react";

type OwnedFilterProps = {
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
  label?: string;
};

export function OwnedFilter({
  value,
  onValueChange,
  label = "Owned",
}: OwnedFilterProps) {
  return (
    <Button
      type="button"
      variant={value ? "default" : "outline"}
      onClick={() => onValueChange(!value)}
      className={cn("gap-2", !value && "bg-white")}
      aria-pressed={value}
    >
      {value ? (
        <SquareCheck className="size-4" aria-hidden />
      ) : (
        <Square className="size-4" aria-hidden />
      )}
      <span>{label}</span>
    </Button>
  );
}
