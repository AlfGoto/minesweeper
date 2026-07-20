import Grid from "@/features/homepage/components/grid";
import { GameProvider } from "./game-provider";
import Menu from "./components/menu";
import LoseDialog from "./components/lose-dialog";
import WinDialog from "./components/win-dialog";
import { getServerSession } from "next-auth";
import { getUser } from "@/types/bff/uncached-functions";
import type { CellSkin } from "@/types/bff";
import { Link } from "@/i18n/navigation";
import { getPublishedSkinsWithMeta } from "@/features/skins/cells/skins";
import { getPublishedBackgroundSkins } from "@/features/skins/backgrounds";

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const user = userEmail ? await getUser(userEmail) : null;
  const selectedCellSkin: CellSkin = user?.selectedSkin?.cells ?? "default";
  const allCellSkins = getPublishedSkinsWithMeta();
  const allBackgroundSkins = getPublishedBackgroundSkins();

  return (
    <GameProvider>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="sr-only">
          <h1>Minesweeper Online - Free with Rankings, Skins & Detailed Stats</h1>

          <h2>Earn & Unlock 20+ Skins</h2>
          <p>
            Play Minesweeper and unlock skins by playing. Choose from 20+ unique
            cell skins and background themes. From classic Windows style to modern
            pixel art, emoji themes, and more. No purchase required — earn
            everything by playing.
          </p>

          <h2>Multi-Dimensional Leaderboards</h2>
          <p>
            Compete beyond just speed. Our leaderboards track fastest times, most
            wins, and most experienced players. Find your strength and climb the
            rankings that matter to you.
          </p>

          <h2>15+ Tracked Statistics</h2>
          <p>
            Track games played, wins, win rate, best time, average time, no-flags
            wins, cells revealed, flags placed, bombs hit, and more. See your
            detailed progress over time.
          </p>

          <h2>World Ranking Percentile</h2>
          <p>
            See how you compare globally. Your profile shows your world rank and
            what percentage of players you have surpassed. Every player gets a
            public profile page.
          </p>

          <h2>How to Play Minesweeper</h2>
          <p>
            Left-click to reveal a cell. Numbers show how many mines touch that
            cell. Right-click to flag suspected mines. Clear all safe cells to
            win. On mobile: tap reveals, long-press flags.
          </p>

          <h2>Available Minesweeper Skins</h2>
          <p>Browse our collection of free cell skins and background themes:</p>
          <nav aria-label="All skins">
            <h3>Cell Skins</h3>
            <ul>
              {allCellSkins.map((skin) => (
                <li key={skin.slug}>
                  <Link href={`/skins/${skin.slug}`}>
                    {skin.name} Minesweeper Skin - {skin.description}
                  </Link>
                </li>
              ))}
            </ul>
            <h3>Background Skins</h3>
            <ul>
              {allBackgroundSkins.map((skin) => (
                <li key={skin.slug}>
                  <Link href={`/skins/background/${skin.slug}`}>
                    {skin.name} Background Skin - {skin.description}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <Grid selectedCellSkin={selectedCellSkin} />
          <Menu />
          <LoseDialog />
          <WinDialog />
        </div>
      </div>
    </GameProvider>
  );
}
