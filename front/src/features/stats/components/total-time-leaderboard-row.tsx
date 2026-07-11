import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatTime } from "@/lib/dates";
import { StatsAll } from "@/types/bff";

interface TotalTimeLeaderboardRowProps {
  stats: StatsAll;
  rank: number;
}

export function TotalTimeLeaderboardRow({
  stats,
  rank,
}: TotalTimeLeaderboardRowProps) {
  const href = `/stats/${stats.userId}`;
  const winrate =
    stats.totalGames > 0
      ? ((stats.totalWin / stats.totalGames) * 100).toFixed(1)
      : "0.0";

  return (
    <TableRow className="hover:bg-gray-100">
      <TableCell style={{ textAlign: "left" }}>
        <Link href={href} className="block">
          {rank === 1 ? (
            <span className="text-xl">🥇</span>
          ) : rank === 2 ? (
            <span className="text-xl">🥈</span>
          ) : rank === 3 ? (
            <span className="text-xl">🥉</span>
          ) : (
            <span className="text-muted-foreground font-medium">{rank}</span>
          )}
        </Link>
      </TableCell>
      <TableCell style={{ textAlign: "left" }}>
        <Link href={href} className="flex items-center gap-3">
          <Image
            src={stats.userPicture}
            alt={stats.userName}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-muted"
          />
          <span className="font-medium">{stats.userName}</span>
        </Link>
      </TableCell>
      <TableCell
        className="font-mono font-semibold"
        style={{ textAlign: "left" }}
      >
        <Link href={href} className="block">
          {formatTime(stats.totalTime)}
        </Link>
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        <Link href={href} className="block">
          {stats.totalGames}
        </Link>
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        <Link href={href} className="block">
          {stats.totalWin}
        </Link>
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        <Link href={href} className="block">
          {winrate}%
        </Link>
      </TableCell>
    </TableRow>
  );
}
