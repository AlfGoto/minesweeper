import Link from "next/link";
import RestartButton from "./restart-button";
import { Button } from "@/components/ui/button";
import LoginButton from "./login-button";
import { getServerSession } from "next-auth";
import Timer from "./timer";

const buttonClassName = "text-lg w-full px-8 py-6 cursor-pointer";

export default async function Menu() {
  const session = await getServerSession();

  return (
    <div className="h-full">
      <div className="flex flex-col gap-2 shadow-lg rounded-lg p-4 ">
        <RestartButton className={buttonClassName} />
        <Timer className={buttonClassName} />
        {session ? (
          <Link href="/stats" prefetch={true} className="w-full">
            <Button className={buttonClassName}>Stats</Button>
          </Link>
        ) : (
          <LoginButton className={buttonClassName} />
        )}
      </div>
    </div>
  );
}
