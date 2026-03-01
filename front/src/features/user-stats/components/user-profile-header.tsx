import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserProfileHeaderProps {
  userName?: string;
  userImage?: string;
}

export function UserProfileHeader({ userName, userImage }: UserProfileHeaderProps) {
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
          <h2 className="text-2xl font-bold">Profile</h2>
          {userName && (
            <p className="text-sm text-muted-foreground">{userName}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/" prefetch={true}>
          <Button>Back to game</Button>
        </Link>
        <Link href="/stats" prefetch={true}>
          <Button variant="outline">Back to stats</Button>
        </Link>
      </div>
    </div>
  );
}
