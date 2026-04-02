import RestartButton from "./restart-button";
import LoginButton from "./login-button";
import { getServerSession } from "next-auth";
import Timer from "./timer";
import { StatsButton } from "./stats-button";
import { SkinsButton } from "./skins-button";
import { HowToPlayButton } from "./how-to-play-button";

const buttonClassName = "text-lg w-full px-8 py-6 cursor-pointer";

export default async function Menu() {
  const session = await getServerSession();

  return (
    <div className="h-full">
      <div className="flex flex-col gap-2 shadow-lg rounded-lg p-4 ">
        <RestartButton className={buttonClassName} />
        <Timer className={buttonClassName} />
        {session ? (
          <>
            <StatsButton className={buttonClassName} loggedIn />
            <SkinsButton className={buttonClassName} loggedIn />
          </>
        ) : (
          <>
            <LoginButton className={buttonClassName} />
            <StatsButton className={buttonClassName} loggedIn={false} />
            <SkinsButton className={buttonClassName} loggedIn={false} />
          </>
        )}
        <HowToPlayButton className={buttonClassName} />
      </div>
    </div>
  );
}
