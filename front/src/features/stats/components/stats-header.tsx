"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface StatsHeaderProps {
  userName?: string;
  userImage?: string;
}

export function StatsHeader({ userName, userImage }: StatsHeaderProps) {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-3">
        {userImage && (
          <Image
            src={userImage}
            alt={userName ?? "Profile"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">Stats</h2>
          {userName && (
            <p className="text-sm text-muted-foreground">{userName}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/" prefetch={true}>
          <Button>Back to game</Button>
        </Link>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </Button>
      </div>
    </div>
  );
}
