"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Button className={className} onClick={() => signIn("google")}>
      Login
    </Button>
  );
}
