import RestartButton from "./restart-button";
import LoginButton from "./login-button";
import { getServerSession } from "next-auth";
import { StatsButton } from "./stats-button";
import { SkinsButton } from "./skins-button";

const buttonClassName =
  "text-sm max-w-[160px] min-w-[160px] w-full px-4 py-2 h-auto cursor-pointer";

export default async function MenuMobile() {
  const session = await getServerSession();

  return (
    <div className="order-1 md:hidden">
      <div className="flex flex-col items-center gap-2">
        <RestartButton className={buttonClassName} />
        {!session ? (
          <LoginButton className={buttonClassName} />
        ) : (
          <>
            <StatsButton className={buttonClassName} />
            <SkinsButton className={buttonClassName} />
          </>
        )}
      </div>
    </div>
  );
}
