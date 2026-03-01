"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/dates";
import { BestGame } from "@/types/bff";

interface LeaderboardRowProps {
  game: BestGame;
  rank: number;
}

export function LeaderboardRow({ game, rank }: LeaderboardRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => router.push(`/stats/${game.userId}`)}
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
            src={game.userPicture}
            alt={game.userName}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-muted"
          />
          <span className="font-medium">{game.userName}</span>
        </div>
      </TableCell>
      <TableCell
        className="font-mono font-semibold"
        style={{ textAlign: "left" }}
      >
        {formatTime(game.time)}
      </TableCell>
      <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
        {game.flags}
      </TableCell>
      <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
        {formatDate(game.date)}
      </TableCell>
    </TableRow>
  );
}
