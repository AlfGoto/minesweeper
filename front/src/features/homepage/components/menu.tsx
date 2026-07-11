import RestartButton from "./restart-button";
import LoginButton from "./login-button";
import { getServerSession } from "next-auth";
import Timer from "./timer";
import { StatsButton } from "./stats-button";
import { SkinsButton } from "./skins-button";
import { HowToPlayButton } from "./how-to-play-button";
import { LocaleSwitcher } from "./locale-switcher";

const buttonClassName = "text-lg max-w-[180px] min-w-[180px] w-full px-8 py-6 cursor-pointer";

export default async function Menu() {
  const session = await getServerSession();

  return (
    <div className="h-full">
      <div className="flex flex-col gap-2 shadow-lg rounded-lg p-4 ">
        <RestartButton className={buttonClassName} />
        <Timer className={buttonClassName} />
        {!session && <LoginButton className={buttonClassName} />}
        <StatsButton className={buttonClassName} />
        <SkinsButton className={buttonClassName} />
        <HowToPlayButton className={buttonClassName} />
        <LocaleSwitcher className={buttonClassName} />
      </div>
    </div>
  );
}
