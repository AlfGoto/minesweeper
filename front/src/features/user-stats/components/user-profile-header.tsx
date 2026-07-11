import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

interface UserProfileHeaderProps {
  userName?: string;
  userImage?: string;
  isOwnProfile?: boolean;
}

export async function UserProfileHeader({ userName, userImage, isOwnProfile = false }: UserProfileHeaderProps) {
  const t = await getTranslations("statsPage");
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
          <h2 className="text-2xl font-bold">{userName ?? t("playerStats")}</h2>
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? t("yourStats") : t("playerStats")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/">
          <Button>{t("backToGame")}</Button>
        </Link>
        <Link href="/stats">
          <Button variant="outline">{t("leaderboard")}</Button>
        </Link>
      </div>
    </div>
  );
}
