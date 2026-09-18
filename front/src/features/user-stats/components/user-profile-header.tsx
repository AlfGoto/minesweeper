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
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <h1 className="text-2xl font-bold">{userName ?? t("playerStats")}</h1>
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? t("yourStats") : t("playerStats")}
          </p>
        </div>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Link href="/" className="flex-1 sm:flex-none">
          <Button className="w-full">{t("backToGame")}</Button>
        </Link>
        <Link href="/stats" className="flex-1 sm:flex-none">
          <Button variant="outline" className="w-full">
            {t("leaderboard")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
