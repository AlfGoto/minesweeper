"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function StatsHeader() {
  return (
    <div className="flex w-full justify-between">
      <h2 className="text-2xl font-bold">Stats</h2>
      <div className="flex gap-2">
        <Link href="/">
          <Button>Back to game</Button>
        </Link>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </Button>
      </div>
    </div>
  );
}
