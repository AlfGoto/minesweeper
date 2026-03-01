"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const router = useRouter();

  const href = `/stats/${stats.userId}`;
  const winrate =
    stats.totalGames > 0
      ? ((stats.totalWin / stats.totalGames) * 100).toFixed(1)
      : "0.0";

  return (
    <TableRow
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => router.push(href)}
      onMouseEnter={() => router.prefetch(href)}
    >
      <TableCell style={{ textAlign: "left" }}>
        {rank === 1 ? (
          <span className="text-xl">🥇</span>
        ) : rank === 2 ? (
          <span className="text-xl">🥈</span>
        ) : rank === 3 ? (
          <span className="text-xl">🥉</span>
        ) : (
          <span className="text-muted-foreground font-medium">{rank}</span>
        )}
      </TableCell>
      <TableCell style={{ textAlign: "left" }}>
        <div className="flex items-center gap-3">
          <Image
            src={stats.userPicture}
            alt={stats.userName}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-muted"
          />
          <span className="font-medium">{stats.userName}</span>
        </div>
      </TableCell>
      <TableCell
        className="font-mono font-semibold"
        style={{ textAlign: "left" }}
      >
        {formatTime(stats.totalTime)}
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        {stats.totalGames}
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        {stats.totalWin}
      </TableCell>
      <TableCell
        className="text-muted-foreground"
        style={{ textAlign: "left" }}
      >
        {winrate}%
      </TableCell>
    </TableRow>
  );
}
